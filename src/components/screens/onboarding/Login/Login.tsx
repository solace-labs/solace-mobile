/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {setAwsCognito, setUser} from '../../../../state/actions/global';
import {AwsCognito} from '../../../../utils/aws_cognito';
import {showMessage} from 'react-native-flash-message';
import {StorageSetItem} from '../../../../utils/storage';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import Header from '../../../common/Header/Header';
import SolaceInput from '../../../common/SolaceUI/SolaceInput/SolaceInput';
import SolacePasswordInput from '../../../common/SolaceUI/SolacePasswordInput/SolacePasswordInput';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceLoader from '../../../common/SolaceUI/SolaceLoader/SolaceLoader';

export type Props = {
  navigation: any;
};

const Login: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = useState({
    value: '',
    isValid: false,
  });
  const [password, setPassword] = useState({
    value: '',
    isValid: true,
  });
  const [active, setActive] = useState('username');
  const [isLoading, setIsLoading] = useState(false);
  const {state, dispatch} = useContext(GlobalContext);

  const validateUsername = (text: string) => {
    setUsername({
      value: text,
      isValid: false,
    });
  };

  const validatePassword = (text: string) => {
    let reg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    setPassword({
      value: text,
      isValid: reg.test(text),
    });
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const awsCognito = new AwsCognito();
      awsCognito.setCognitoUser(username.value);
      dispatch(setAwsCognito(awsCognito));
      console.log(username.value, password.value);
      const response = await awsCognito?.emailLogin(
        username.value,
        password.value,
      );
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
      dispatch(setUser({...state.user, solaceName: username.value}));
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'GoogleDrive'}],
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
    return !password.isValid || isLoading;
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
          placeholder="username"
          onFocus={() => setActive('username')}
          mt={16}
          value={username.value}
          onChangeText={text => validateUsername(text)}
        />
        <SolacePasswordInput
          placeholder="password"
          value={password.value}
          onFocus={() => setActive('password')}
          onChangeText={text => validatePassword(text)}
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
