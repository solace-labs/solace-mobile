/* eslint-disable react-hooks/exhaustive-deps */
import {View, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  AccountStatus,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import {
  setAccountStatus,
  setAwsCognito,
  setUser,
} from '../../../../state/actions/global';
import {AwsCognito} from '../../../../utils/aws_cognito';
import {showMessage} from 'react-native-flash-message';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceInput from '../../../common/SolaceUI/SolaceInput/SolaceInput';
import SolacePasswordInput from '../../../common/SolaceUI/SolacePasswordInput/SolacePasswordInput';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import Header from '../../../common/Header/Header';

export type Props = {
  navigation: any;
};

const EmailScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState({
    value: '',
    isValid: false,
  });
  const [password, setPassword] = useState({
    value: '',
    isValid: false,
  });
  const [otp, setOtp] = useState({
    value: '',
    isValid: false,
    isVerified: false,
  });
  const [active, setActive] = useState('email');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    validateEmail(email.value);
    validatePassword(password.value);
  }, []);

  const {state, dispatch} = useContext(GlobalContext);

  const validateEmail = (text: string) => {
    if (isOtpSent) {
      setIsOtpSent(false);
    }
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail({
        value: text,
        isValid: false,
      });
      return false;
    } else {
      setEmail({value: text, isValid: true});
    }
  };

  const validateOtp = (text: string) => {
    let reg = /^[0-9]{6,6}$/;
    if (reg.test(text) === false) {
      setOtp({
        value: text,
        isValid: false,
        isVerified: false,
      });
      return false;
    } else {
      setOtp({
        value: text,
        isValid: true,
        isVerified: false,
      });
    }
  };

  const validatePassword = (text: string) => {
    if (isOtpSent) {
      setIsOtpSent(false);
    }
    let reg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (reg.test(text) === false) {
      setPassword({
        value: text,
        isValid: false,
      });
      return false;
    } else {
      setPassword({
        value: text,
        isValid: true,
      });
    }
  };

  const handleMailSubmit = async () => {
    const username = state.user!.solaceName;
    const awsCognito = new AwsCognito();
    awsCognito.setCognitoUser(username);
    dispatch(setAwsCognito(awsCognito));
    if (!username) {
      showMessage({
        message: 'Username not provided',
        type: 'info',
      });
      return;
    }
    if (!awsCognito) {
      showMessage({
        message: 'Server Error. Try again later',
        type: 'danger',
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await awsCognito?.emailSignUp(
        username,
        email.value,
        password.value,
      );
      console.log({response});
      dispatch(setUser({...state.user, email: email.value}));
      setIsOtpSent(true);
      showMessage({
        message: 'OTP sent to the provided mail',
        type: 'success',
      });
    } catch (e: any) {
      showMessage({
        message: e.message,
        type: 'danger',
      });
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    const awsCognito = state.awsCognito;
    if (!awsCognito) {
      showMessage({
        message: 'Server Error. Try again later',
        type: 'danger',
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await awsCognito?.confirmRegistration(otp.value);
      console.log({response});
      setOtp({...otp, isVerified: true});
      setIsLoading(false);
      dispatch(setAccountStatus(AccountStatus.SIGNED_UP));
    } catch (e: any) {
      setIsLoading(false);
      showMessage({
        message: e.message,
        type: 'danger',
      });
    }
  };

  const isDisable = () => {
    return !email.isValid || !password.isValid || isLoading || otp.isVerified;
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading={`enter ${
            active === 'email'
              ? 'email'
              : active === 'password'
              ? 'password'
              : 'otp'
          }`}
          subHeading={
            'we’ll notify you of important or suspicious activity on your wallet'
          }
        />
        <SolaceInput
          placeholder="email address"
          onFocus={() => setActive('email')}
          mt={16}
          value={email.value}
          onChangeText={text => validateEmail(text)}
        />
        <SolacePasswordInput
          placeholder="password"
          value={password.value}
          onFocus={() => setActive('password')}
          onChangeText={text => validatePassword(text)}
          mt={16}
        />
        {!password.isValid && (
          <SolaceText type="secondary" size="sm" variant="normal" align="left">
            must be at least 8 characters long, contain at least one lowercase
            letter, one uppercase letter, one number, and one special character
          </SolaceText>
        )}
        {isOtpSent && (
          <SolaceInput
            placeholder="enter 6 digit otp"
            onFocus={() => setActive('otp')}
            keyboardType="number-pad"
            mt={16}
            value={email.value}
            onChangeText={text => validateOtp(text)}
          />
        )}
        {isLoading && (
          <View style={{flex: 1}}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </View>
      <SolaceButton
        onPress={() => {
          isOtpSent ? handleVerifyOtp() : handleMailSubmit();
        }}
        loading={isLoading}
        disabled={isDisable()}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {isOtpSent ? 'verify otp' : 'send otp'}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default EmailScreen;
