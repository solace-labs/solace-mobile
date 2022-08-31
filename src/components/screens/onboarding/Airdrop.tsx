import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  getKeypairFromPrivateKey,
  GlobalContext,
  Tokens,
} from '../../../state/contexts/GlobalContext';
import {showMessage} from 'react-native-flash-message';
import {airdrop} from '../../../utils/relayer';
import {StorageGetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import {confirmTransaction} from '../../../utils/apis';

export type Props = {
  navigation: any;
};

const AirdropScreen: React.FC<Props> = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [loading, setLoading] = useState({
    value: false,
    message: 'request now',
  });

  const handleClick = async () => {
    try {
      const tokens: Tokens = await StorageGetItem('tokens');
      if (!tokens) {
        showMessage({
          message: 'please login again',
          type: 'default',
        });
        navigation.navigate('Login');
        return;
      }
      const keypair = getKeypairFromPrivateKey(state.user!);
      const {publicKey} = keypair;
      const publicKeyString = publicKey.toString();
      const accessToken = tokens.accesstoken;
      /** Requesting Airdrop */
      console.log('REQUESTING');
      const data = await requestAirdrop(publicKeyString, accessToken);
      /** Airdrop confirmation */
      console.log('AIRDROP CONFIRMATION');
      await confirmTransaction(data);
      navigation.reset({
        index: 0,
        routes: [{name: 'CreateWallet'}],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const requestAirdrop = async (publicKey: string, accessToken: string) => {
    console.log({publicKey, accessToken});
    setLoading({
      value: true,
      message: 'requesting air drop...',
    });
    try {
      const data: any = await airdrop(publicKey, accessToken);
      showMessage({
        message: 'transaction sent',
        type: 'success',
      });
      return data;
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
      throw e;
    }
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="request airdrop"
          subHeading="store your encrypted key in google drive so you can recover your wallet if you lose your device"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>

      <SolaceButton
        onPress={() => {
          handleClick();
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

export default AirdropScreen;
