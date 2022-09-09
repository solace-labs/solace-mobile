import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {relayTransaction, requestGuardian} from '../../../utils/relayer';
import {showMessage} from 'react-native-flash-message';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
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
    // '',
  );
  const {state} = useContext(GlobalContext);
  const [loading, setLoading] = useState({
    value: false,
    message: 'add guardian',
  });

  const addGuardian = async () => {
    setLoading({
      message: 'adding guardian...',
      value: true,
    });
    const sdk = state.sdk!;
    const walletName = state.user?.solaceName!;
    const solaceWalletAddress = sdk.wallet.toString();
    try {
      const feePayer = await getFeePayer();
      const guardianPublicKey = new PublicKey(address);
      const tx = await sdk.addGuardian(guardianPublicKey, feePayer);
      const transactionId = await relayTransaction(tx);
      setLoading({
        message: 'finalizing...',
        value: true,
      });
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
      showMessage({
        message: 'guardian added successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (e) {
      console.log('MAIN ERROR:', JSON.stringify(e));
      setLoading({
        message: '',
        value: false,
      });
      showMessage({
        message: 'service unavilable. try again later',
        type: 'warning',
      });
    }
  };

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
