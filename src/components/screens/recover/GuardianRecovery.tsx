import {View} from 'react-native';
import React, {Props, useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';

import {AppState, GlobalContext} from '../../../state/contexts/GlobalContext';
import {setSDK, setUser} from '../../../state/actions/global';
import {relayTransaction} from '../../../utils/relayer';
import {NETWORK, PROGRAM_ADDRESS} from '../../../utils/constants';
import {StorageSetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import Header from '../../common/Header';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RecoverStackParamList} from '../../../navigation/Recover';
import {useNavigation} from '@react-navigation/native';

type RecoverScreenProps = NativeStackScreenProps<
  RecoverStackParamList,
  'Login'
>;

const GuardianRecovery = () => {
  const navigation = useNavigation<RecoverScreenProps['navigation']>();
  const [loading, setLoading] = useState({
    value: false,
    message: 'recover',
  });
  const {state, dispatch} = useContext(GlobalContext);

  const handleRecovery = async () => {
    const keypair = SolaceSDK.newKeyPair();
    try {
      setLoading({
        message: 'recovering...',
        value: true,
      });
      const newSDK = new SolaceSDK({
        network: NETWORK,
        programAddress: PROGRAM_ADDRESS,
        owner: keypair,
      });
      const username = state.user?.solaceName!;
      const feePayer = await getFeePayer();
      const tx = await newSDK.recoverWallet(username, feePayer!);
      console.log({tx});
      const res = await relayTransaction(tx);
      console.log({res});
      setLoading({
        message: 'finalizing...please wait',
        value: true,
      });
      await confirmTransaction(res);
      await StorageSetItem('user', {
        solaceName: username,
        ownerPrivateKey: keypair.secretKey.toString(),
      });
      await StorageSetItem('appstate', AppState.RECOVERY);
      dispatch(setSDK(newSDK));
      dispatch(
        setUser({
          ...state.user,
          solaceName: username,
          ownerPrivateKey: keypair.secretKey.toString(),
        }),
      );
      setLoading({
        message: 'recovered',
        value: false,
      });
      navigation.navigate('Recover');
    } catch (e: any) {
      console.log('e', e);
      if (e.message === 'Request failed') {
        showMessage({
          message: 'already in recovery phase',
          type: 'info',
        });
      }
      setLoading({
        message: 'some error. try again?',
        value: false,
      });
    }
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="recover?"
          subHeading="recover your solace account by guardians approval"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      <SolaceButton
        onPress={() => {
          handleRecovery();
        }}
        loading={loading.value}
        disabled={loading.value}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {loading.message}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default GuardianRecovery;
