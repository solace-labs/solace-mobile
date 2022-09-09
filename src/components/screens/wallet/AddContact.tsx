import {View} from 'react-native';
import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {addNewContact, setSDK} from '../../../state/actions/global';
import {showMessage} from 'react-native-flash-message';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import TopNavbar from '../../common/TopNavbar';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import {relayTransaction} from '../../../utils/relayer';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import moment from 'moment';

export type Props = {
  navigation: any;
};

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const AddContactScreen: React.FC<Props> = ({navigation}) => {
  const initialLoading = {message: '', value: false};
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(initialLoading);
  const {state, dispatch} = useContext(GlobalContext);

  const addContact = async () => {
    const sdk = state.sdk!;
    const feePayer = await getFeePayer();
    const pubKey = new PublicKey(address);
    const tx = await sdk.addTrustedPubkey(pubKey, feePayer);
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
      console.log('incubation', inIncubation);
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
        startIcon="back"
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
          <SolaceText type="secondary" weight="bold" variant="normal">
            network
          </SolaceText>
          <SolaceText type="secondary" weight="bold" variant="solana-green">
            solana testnet
          </SolaceText>
        </View>
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      <SolaceButton
        onPress={handleAdd}
        loading={loading.value}
        disabled={!address}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          save contact
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AddContactScreen;
