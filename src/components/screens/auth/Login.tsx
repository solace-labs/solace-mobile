/* eslint-disable react-hooks/exhaustive-deps */
import {TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {
  clearData,
  setAccountStatus,
  setAwsCognito,
  setUser,
} from '../../../state/actions/global';
import {AwsCognito} from '../../../utils/aws_cognito';
import {showMessage} from 'react-native-flash-message';
import {
  StorageClearAll,
  StorageGetItem,
  StorageSetItem,
} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolacePasswordInput from '../../common/solaceui/SolacePasswordInput';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import {AuthStackParamList} from '../../../navigation/Auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type AuthScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<AuthScreenProps['navigation']>();
  const [username, setUsername] = useState(state.user?.solaceName!);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

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
      dispatch(setUser({...state.user, solaceName: username}));
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'Loading'}],
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

  const reset = async () => {
    await StorageClearAll();
    dispatch(clearData());
    dispatch(setAccountStatus(AccountStatus.NEW));
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
          editable={false}
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
        <TouchableOpacity onPress={reset}>
          <SolaceText
            type="secondary"
            variant="normal"
            weight="bold"
            mt={10}
            align="right">
            use another account?
          </SolaceText>
        </TouchableOpacity>
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
