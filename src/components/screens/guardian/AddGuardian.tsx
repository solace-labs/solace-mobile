import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {AppState, GlobalContext} from '../../../state/contexts/GlobalContext';
import {PublicKey} from 'solace-sdk';
import {relayTransaction, requestGuardian} from '../../../utils/relayer';
import {showMessage} from 'react-native-flash-message';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import {StorageGetItem} from '../../../utils/storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GuardianStackParamList} from '../../../navigation/Wallet';
import {useNavigation} from '@react-navigation/native';

type AddGuardianScreenProps = NativeStackScreenProps<
  GuardianStackParamList,
  'AddGuardian'
>;

const AddGuardian = () => {
  const [address, setAddress] = useState(
    // 'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
    '',
  );
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<AddGuardianScreenProps['navigation']>();
  const [loading, setLoading] = useState({
    value: false,
    message: 'add guardian',
  });

  const addGuardian = async () => {
    setLoading({
      message: 'adding guardian...',
      value: true,
    });
    const appstate = await StorageGetItem('appstate');
    const sdk = state.sdk!;
    const walletName = state.user?.solaceName!;
    const solaceWalletAddress = sdk.wallet.toString();
    try {
      const feePayer = await getFeePayer();
      const guardianPublicKey = new PublicKey(address);
      const tx = await sdk.addGuardian(guardianPublicKey, feePayer!);
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
      if (!(appstate === AppState.TESTING)) {
        showMessage({
          message: 'service unavilable. try again later',
          type: 'warning',
        });
      } else {
        showMessage({
          message: 'do a transaction first',
          type: 'info',
        });
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="add manually"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 8}}>
        <SolaceCustomInput
          iconName="line-scan"
          iconType="mci"
          handleIconPress={() => {
            showMessage({
              message: 'scan coming soon...',
              type: 'info',
            });
          }}
          value={address}
          placeholder="wallet address of guardian"
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
      <View style={{paddingBottom: 12}}>
        <SolaceButton
          onPress={addGuardian}
          background="purple"
          loading={loading.value}
          disabled={!address || loading.value}>
          <SolaceText type="secondary" weight="bold" color="white">
            {loading.message}
          </SolaceText>
        </SolaceButton>
      </View>
    </SolaceContainer>
  );
};

export default AddGuardian;
