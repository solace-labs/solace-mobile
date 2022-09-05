import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {relayTransaction, requestGuardian} from '../../../utils/relayer';
import {showMessage} from 'react-native-flash-message';
import {getFeePayer} from '../../../utils/apis';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';

export type Props = {
  navigation: any;
};

const AddGuardian: React.FC<Props> = ({navigation}) => {
  const [address, setAddress] = useState(
    'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
  );
  const {state, dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = useState({
    value: false,
    message: 'add guardian',
  });

  const addGuardian = async () => {
    const sdk = state.sdk!;
    const walletName = state.user?.solaceName!;
    const solaceWalletAddress = sdk.wallet.toString();
    console.log({solaceWalletAddress, walletName});
    try {
      const feePayer = await getFeePayer();
      const guardianPublicKey = new PublicKey(address);
      const tx = await sdk.addGuardian(guardianPublicKey, feePayer);
      const transactionId = await relayTransaction(tx);
      console.log({transactionId});
      await confirmTransaction(transactionId);
      await requestGuardian({
        guardianAddress: guardianPublicKey.toString(),
        solaceWalletAddress,
        walletName,
      });
      setLoading({
        message: '',
        value: false,
      });
      navigation.goBack();
    } catch (e) {
      console.log('MAIN ERROR:', JSON.stringify(e));
    }
  };

  const confirmTransaction = async (data: string) => {
    setLoading({
      value: true,
      message: 'confirming transaction...',
    });
    console.log({data});
    let confirm = false;
    let retry = 0;
    while (!confirm) {
      if (retry > 0) {
        setLoading({
          value: true,
          message: 'retrying confirmation...',
        });
      }
      if (retry === 3) {
        setLoading({
          value: false,
          message: 'some error. try again?',
        });
        confirm = true;
        continue;
      }
      try {
        console.log({data});
        const res = await SolaceSDK.testnetConnection.confirmTransaction(data);
        showMessage({
          message: 'transaction confirmed - guardian added',
          type: 'success',
        });
        confirm = true;
      } catch (e: any) {
        if (
          e.message.startsWith(
            'Transaction was not confirmed in 60.00 seconds.',
          )
        ) {
          console.log('Timeout');
          retry++;
        } else {
          // confirm = true;
          console.log('OTHER ERROR: ', e.message);
          retry++;
          // throw e;
        }
      }
    }
  };

  // const getFeePayer = async (accessToken: string) => {
  //   try {
  //     const response = await getMeta(accessToken);
  //     return response.feePayer;
  //   } catch (e: any) {
  //     console.log('FEE PAYER', e.status);
  //     if (e.message === 'Request failed with status code 401') {
  //       showMessage({
  //         message: 'You need to login again',
  //         type: 'info',
  //       });
  //       await StorageDeleteItem('tokens');
  //       dispatch(setAccountStatus(AccountStatus.EXISITING));
  //     }
  //     throw e;
  //   }
  // };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        text="add manually"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 8}}>
        <SolaceCustomInput
          iconName="line-scan"
          iconType="mci"
          value={address}
          onChangeText={setAddress}
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      {/* <View style={styles.subTextContainer}>
        <AntDesign name="checkcircleo" style={styles.subIcon} />
        <Text style={styles.subText}>address found</Text>
      </View>
      <View style={[styles.subTextContainer, {marginTop: 0}]}>
        <Text style={styles.buttonText}>0x8zo881ixpzAdiZ2802hz00zc</Text>
      </View> */}

      {/* <View style={styles.networkContainer}>
        <Text style={styles.secondText}>network</Text>
        <Text style={styles.solanaText}>solana</Text>
      </View> */}
      <SolaceButton
        onPress={addGuardian}
        loading={loading.value}
        disabled={!address || loading.value}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {loading.message}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AddGuardian;
