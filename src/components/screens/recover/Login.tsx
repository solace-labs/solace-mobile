/* eslint-disable react-hooks/exhaustive-deps */
import {TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  AccountStatus,
  AppState,
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
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {TEST_PASSWORD} from '../../../utils/constants';

export type Props = {
  navigation: any;
};

const Login: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);
  const [username, setUsername] = useState(state.user?.solaceName!);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState('username');
  const [isLoading, setIsLoading] = useState(false);

  const checkInRecoveryMode = async () => {
    const appState: AppState = await StorageGetItem('appstate');
    if (appState === AppState.RECOVERY) {
      navigation.navigate('Recover');
    }
  };

  useEffect(() => {
    checkInRecoveryMode();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const appState = await StorageGetItem('appstate');
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
      await StorageSetItem('tokens', {
        accesstoken,
        idtoken,
        refreshtoken,
      });
      dispatch(setUser({...state.user, solaceName: username}));
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'GuardianRecovery'}],
      });
    } catch (e: any) {
      showMessage({
        message: e.message,
        type: 'danger',
      });
      setIsLoading(false);
    }
  };

  const isDisable = () => {
    return !username || !password || isLoading;
  };

  const handleTestSignIn = async () => {
    const solaceName = state.user?.solaceName;
    if (password === TEST_PASSWORD && username === solaceName) {
      dispatch(setAccountStatus(AccountStatus.ACTIVE));
    } else {
      showMessage({message: 'email/password is wrong', type: 'danger'});
    }
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
