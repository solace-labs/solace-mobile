import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';

import {GlobalContext, Tokens} from '../../../state/contexts/GlobalContext';
import {setSDK, setUser} from '../../../state/actions/global';
import {airdrop, relayTransaction} from '../../../utils/relayer';
import {NETWORK, PROGRAM_ADDRESS} from '../../../utils/constants';
import {StorageGetItem, StorageSetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import Header from '../../common/Header';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';

export type Props = {
  navigation: any;
};

const GuardianRecovery: React.FC<Props> = ({navigation}) => {
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
        value: false,
      });
      const newSDK = new SolaceSDK({
        network: NETWORK,
        programAddress: PROGRAM_ADDRESS,
        owner: keypair,
      });
      const username = state.user?.solaceName!;
      const feePayer = await getFeePayer();
      console.log({feePayer, username});
      const data = await requestAirdrop(keypair.publicKey.toString());
      console.log('AIRDROP CONFIRMATION', data);
      await confirmTransaction(data);
      const tx = await newSDK.recoverWallet(username, feePayer);
      console.log({tx});
      const res = await relayTransaction(tx);
      console.log({res});
      await confirmTransaction(res);
      await StorageSetItem('user', {
        solaceName: username,
        ownerPrivateKey: keypair.secretKey.toString(),
        inRecovery: true,
      });
      dispatch(setSDK(newSDK));
      dispatch(
        setUser({
          ...state.user,
          solaceName: username,
          isWalletCreated: true,
        }),
      );
      setLoading({
        message: 'recovered',
        value: false,
      });
      navigation.navigate('Recover');
    } catch (e: any) {
      console.log('e', JSON.stringify(e));
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

  const requestAirdrop = async (publicKey: string) => {
    const {accesstoken} = (await StorageGetItem('tokens')) as Tokens;
    console.log({publicKey, accesstoken});
    setLoading({
      value: true,
      message: 'requesting air drop...',
    });
    try {
      const res: any = await airdrop(publicKey);
      showMessage({
        message: 'transaction sent',
        type: 'success',
      });
      console.log('inside airdrop', res);
      return res;
    } catch (e) {
      console.log('Airdrop error', e);
      setLoading({
        value: false,
        message: 'request now',
      });
      showMessage({
        message: 'error requesting airdrop. try again!',
        type: 'danger',
      });
      // throw e;
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
