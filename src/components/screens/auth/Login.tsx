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
  setSDK,
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
import {
  NETWORK,
  PROGRAM_ADDRESS,
  TEST_PASSWORD,
  TEST_PRIVATE_KEY,
} from '../../../utils/constants';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {KeyPair, SolaceSDK} from 'solace-sdk';

export type Props = {
  navigation: any;
};

const Login: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);
  const [username, setUsername] = useState(state.user?.solaceName!);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const appState = await StorageGetItem('appstate');
      console.log('login', appState);
      if (appState === AppState.TESTING) {
        handleTestSignIn();
        return;
      }
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
      dispatch(setUser({...state.user, solaceName: username}));
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'MainPasscode'}],
      });
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

  const handleTestSignIn = async () => {
    // const solaceName = state.user?.solaceName;
    const user = await StorageGetItem('user');
    console.log('handle test', user, password, username, TEST_PASSWORD);
    // console.log({usre.solaceName, password});
    if (password === TEST_PASSWORD && username === user.solaceName) {
      console.log('INSIDE THIS');
      await createTestWallet();
      setIsLoading(false);
      dispatch(setAccountStatus(AccountStatus.ACTIVE));
    } else {
      console.log('INSIDE THAT');
      showMessage({message: 'email/password is wrong', type: 'danger'});
      setIsLoading(false);
    }
  };

  const createTestWallet = async () => {
    // setIsLoading({message: 'creating...', value: true});
    const privateK = Uint8Array.from(TEST_PRIVATE_KEY.split(',').map(e => +e));
    const keypair = KeyPair.fromSecretKey(privateK);
    const sdk = await SolaceSDK.retrieveFromName(state.user?.solaceName!, {
      network: NETWORK,
      owner: keypair,
      programAddress: PROGRAM_ADDRESS,
    });
    dispatch(
      setUser({
        ...state.user,
        isWalletCreated: true,
        ownerPrivateKey: TEST_PRIVATE_KEY,
      }),
    );
    await StorageSetItem('user', {
      ...state.user,
      isWalletCreated: true,
      ownerPrivateKey: TEST_PRIVATE_KEY,
    });
    dispatch(setSDK(sdk));
    // setLoading({message: '', value: false});
    dispatch(setAccountStatus(AccountStatus.EXISITING));
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading={`enter ${
            active === 'username' ? 'solace username' : 'password'
          }`}
          subHeading="sign in to your account"
        />
        <SolaceInput
          // editable={}
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
        loading={isLoading}
        disabled={isDisable()}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          sign in
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default Login;
