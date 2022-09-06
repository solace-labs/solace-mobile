/* eslint-disable react-hooks/exhaustive-deps */
import {View, Image, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {setAccountStatus, setUser} from '../../../state/actions/global';
import {decryptData, generateKey} from '../../../utils/aes_encryption';
import {showMessage} from 'react-native-flash-message';
import {StorageSetItem} from '../../../utils/storage';
import PasscodeContainer, {
  PASSCODE_LENGTH,
} from '../../common/PasscodeContainer';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';

export type Props = {
  navigation: any;
};

const PasscodeScreen: React.FC<Props> = ({navigation}) => {
  const [code, setCode] = useState('');
  const {state, dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = useState({
    value: false,
    message: '',
  });

  const decryptSecretKey = async (encryptedData: any, pin: string) => {
    const key = await generateKey(pin, 'salt', 5000, 256);
    const decryptedData = await decryptData(encryptedData, key);
    return decryptedData;
  };

  const decryptStoredData = async () => {
    try {
      const {encryptedSecretKey, encryptedSolaceName} = state.retrieveData!;
      setLoading({
        message: 'logging you in...',
        value: true,
      });
      const secretKey = await decryptSecretKey(encryptedSecretKey, code);
      const solaceName = await decryptSecretKey(encryptedSolaceName, code);
      const user = {
        solaceName,
        ownerPrivateKey: secretKey,
        pin: code,
        isWalletCreated: true,
      };
      await StorageSetItem('appstate', AppState.ONBOARDED);
      dispatch(setUser(user));
      await StorageSetItem('user', user);
      showMessage({
        message: 'successfully retrieved account',
        type: 'success',
      });
      setLoading({
        message: '',
        value: false,
      });
      dispatch(setAccountStatus(AccountStatus.EXISITING));
    } catch (e: any) {
      console.log(e.message);
      setCode('');
      showMessage({
        message: 'Incorrect passcode. Please try again.',
        type: 'danger',
      });
      setLoading({
        message: '',
        value: false,
      });
    }
  };

  const filled = code.length === PASSCODE_LENGTH;

  useEffect(() => {
    if (filled) {
      decryptStoredData();
    }
  }, [code]);

  return (
    <SolaceContainer>
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} variant="white" size="xl" weight="semibold">
          solace
        </SolaceText>
      </View>
      <View style={{flex: 1}}>
        <SolaceText variant="white" size="lg" weight="semibold">
          enter passcode
        </SolaceText>
        <PasscodeContainer code={code} setCode={setCode} />
        {loading.value && (
          <SolaceLoader
            style={{justifyContent: 'flex-start'}}
            text={loading.message}>
            <ActivityIndicator style={{paddingLeft: 8}} size="small" />
          </SolaceLoader>
        )}
      </View>
    </SolaceContainer>
  );
};

export default PasscodeScreen;
