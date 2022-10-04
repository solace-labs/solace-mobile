import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import moment from 'moment';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {showMessage} from 'react-native-flash-message';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import TopNavbar from '../../../common/TopNavbar';
import SolaceCustomInput from '../../../common/solaceui/SolaceCustomInput';
import {relayTransaction} from '../../../../utils/relayer';
import {confirmTransaction, getFeePayer} from '../../../../utils/apis';
import SolaceLoader from '../../../common/solaceui/SolaceLoader';
import Toast from 'react-native-toast-message';
import {WalletStackParamList} from '../../../../navigation/Home/Home';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'AddContact'
>;

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const AddContactScreen = () => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const initialLoading = {message: '', value: false};
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(initialLoading);
  const {state} = useContext(GlobalContext);

  const addContact = async () => {
    const sdk = state.sdk!;
    const feePayer = await getFeePayer();
    const pubKey = new PublicKey(address);
    const tx = await sdk.addTrustedPubkey(pubKey, feePayer!);
    const transactionId = await relayTransaction(tx);
    setLoading({message: 'finalizing... please wait', value: true});
    await confirmTransaction(transactionId);
    navigation.goBack();
  };

  const inHistory = (data: WalletDataType) => {
    const present = data.pubkeyHistory.find(
      pubkey => pubkey.toString() === address,
    );
    if (present) {
      return true;
    } else {
      return false;
    }
  };

  const checkIncubationMode = (data: WalletDataType) => {
    const incubationDate = moment(new Date(data.createdAt * 1000)).add(12, 'h');
    const current = moment(new Date());
    const difference = incubationDate.diff(current);
    if (difference > 0 && data.incubationMode) {
      return true;
    } else if (inHistory(data)) {
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    try {
      setLoading({
        message: 'adding contact...',
        value: true,
      });
      const sdk = state.sdk!;
      const data = await sdk.fetchWalletData();
      const inIncubation = checkIncubationMode(data);
      if (inIncubation) {
        await addContact();
        setLoading(initialLoading);
        return;
      }
      showMessage({
        message:
          'do a transaction with the given address to add it to trusted list',
        type: 'warning',
      });
      setLoading(initialLoading);
    } catch (e: any) {
      console.log(e);
      setLoading(initialLoading);
      showMessage({
        message: 'address is not valid',
        type: 'danger',
      });
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
        text="save contact"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 16}}>
        {/* <SolaceInput
          mb={16}
          value={name}
          onChangeText={setName}
          placeholder="name"
        /> */}
        <SolaceCustomInput
          handleIconPress={() => {
            Toast.show({
              type: 'success',
              text1: 'scan coming soon...',
              // text2: 'gre',
            });
            // showMessage({
            //   message: 'scan coming soon...',
            //   type: 'info',
            // });
          }}
          shiftIconUp="xs"
          iconName="line-scan"
          placeholder="address"
          iconType="mci"
          value={address}
          onChangeText={setAddress}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <SolaceText type="secondary" weight="bold" color="normal">
            network
          </SolaceText>
          <SolaceText type="secondary" weight="bold" color="green">
            solana testnet
          </SolaceText>
        </View>
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      <SolaceButton
        onPress={handleAdd}
        loading={loading.value}
        mb={10}
        disabled={!address}>
        <SolaceText type="secondary" weight="bold" color="dark">
          save contact
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AddContactScreen;
