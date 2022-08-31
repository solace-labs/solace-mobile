/* eslint-disable react-hooks/exhaustive-deps */
import {View, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {
  setAccountStatus,
  setAwsCognito,
  setUser,
} from '../../../state/actions/global';
import {AwsCognito} from '../../../utils/aws_cognito';
import {showMessage} from 'react-native-flash-message';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolacePasswordInput from '../../common/solaceui/SolacePasswordInput';
import SolaceText from '../../common/solaceui/SolaceText';
import Header from '../../common/Header';
import {EMAIL_REGEX, OTP_REGEX, PASSWORD_REGEX} from '../../../utils/constants';

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

  const validateEmail = (value: string) => {
    if (isOtpSent) {
      setIsOtpSent(false);
    }
    setEmail({value, isValid: EMAIL_REGEX.test(value)});
  };
  const validatePassword = (value: string) => {
    if (isOtpSent) {
      setIsOtpSent(false);
    }
    setPassword({value, isValid: PASSWORD_REGEX.test(value)});
  };

  const validateOtp = (value: string) => {
    setOtp({value, isVerified: false, isValid: OTP_REGEX.test(value)});
  };

  const handleMailSubmit = async () => {
    const username = state.user!.solaceName;
    const awsCognito = new AwsCognito();
    awsCognito.setCognitoUser(username);
    dispatch(setAwsCognito(awsCognito));
    if (!username) {
      showMessage({
        message: 'username not provided',
        type: 'info',
      });
      return;
    }
    if (!awsCognito) {
      showMessage({
        message: 'server error! try again later',
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
        message: 'server error. try again later',
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
          <SolaceText
            type="secondary"
            size="xs"
            variant="normal"
            align="left"
            mt={8}>
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
            value={otp.value}
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
