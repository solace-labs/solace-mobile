/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {
  setAccountStatus,
  setAwsCognito,
  setUser,
} from '../../../state/actions/global';
import {AwsCognito} from '../../../utils/aws_cognito';
import {showMessage} from 'react-native-flash-message';
import {StorageGetItem, StorageSetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolacePasswordInput from '../../common/solaceui/SolacePasswordInput';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import {decryptKey} from '../../../utils/aes_encryption';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RetrieveStackParamList} from '../../../navigation/Retrieve';
import {useNavigation} from '@react-navigation/native';

type RetrieveScreenProps = NativeStackScreenProps<
  RetrieveStackParamList,
  'Login'
>;

const Login = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<RetrieveScreenProps['navigation']>();
  console.log('retrieve', state);
  const [username, setUsername] = useState(state.user?.solaceName!);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const decryptStoredData = async () => {
    try {
      const {encryptedSecretKey, encryptedSolaceName} = state.retrieveData!;
      console.log(encryptedSecretKey);
      const secretKey = await decryptKey(encryptedSecretKey, password);
      const solaceName = await decryptKey(encryptedSolaceName, password);
      const user = {
        solaceName,
        ownerPrivateKey: secretKey,
        isWalletCreated: true,
      };
      if (solaceName !== username.trim()) {
        showMessage({
          message: 'username is incorrect',
          type: 'danger',
        });
        setIsLoading(false);
        return;
      }
      await StorageSetItem('appstate', AppState.ONBOARDED);
      dispatch(setUser(user));
      await StorageSetItem('user', user);
      setIsLoading(false);
      showMessage({
        message: 'successfully retrieved account. login again please',
        type: 'success',
      });
      dispatch(setAccountStatus(AccountStatus.EXISITING));
    } catch (e: any) {
      setIsLoading(false);
      console.log(e.message);
      showMessage({
        message: 'incorrect password/username. please try again',
        type: 'danger',
      });
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const appState = await StorageGetItem('appstate');
      console.log('login', appState);
      const awsCognito = new AwsCognito();
      awsCognito.setCognitoUser(username);
      dispatch(setAwsCognito(awsCognito));
      const response = await awsCognito?.emailLogin(username, password);
      const {
        accessToken: {jwtToken: accesstoken},
        idToken: {jwtToken: idtoken},
        refreshToken: {token: refreshtoken},
      } = response;
      await StorageSetItem('tokens', {accesstoken, idtoken, refreshtoken});
      await decryptStoredData();
      // dispatch(setUser({...state.user, solaceName: username}));
    } catch (e: any) {
      setIsLoading(false);
      showMessage({
        message: e.message,
        type: 'danger',
      });
    }
  };

  const isDisable = () => {
    return !username || !password || isLoading;
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading={`enter ${
            active === 'username' ? 'solace username' : 'password'
          }`}
          subHeading="enter credentials to retrieve account"
        />
        <SolaceInput
          // editable={false}
          placeholder="username"
          onFocus={() => setActive('username')}
          mt={16}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <SolacePasswordInput
          placeholder="password"
          value={password}
          onFocus={() => setActive('password')}
          onChangeText={text => setPassword(text)}
          mt={16}
        />
        {isLoading && <SolaceLoader text="signing in..." />}
      </View>
      <SolaceButton
        onPress={() => {
          handleSignIn();
        }}
        background="purple"
        loading={isLoading}
        disabled={isDisable()}>
        <SolaceText type="secondary" weight="bold" color="white">
          retrieve?
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default Login;
