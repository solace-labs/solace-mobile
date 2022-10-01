import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {PublicKey} from 'solace-sdk';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import {SPL_TOKEN} from '../../../utils/constants';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {relayTransaction} from '../../../utils/relayer';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {WalletStackParamList} from '../../../navigation/Wallet';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'AddToken'
>;

const AddToken = () => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const initialLoading = {message: '', value: false};
  const [address, setAddress] = useState(
    // 'DB6BcxUpHDSxEFpqDRjm98HTvX2JZapbBNN8RcR4K11z',
    '',
  );
  const [loading, setLoading] = useState(initialLoading);
  const {state} = useContext(GlobalContext);

  const addToken = async () => {
    try {
      setLoading({
        message: 'adding token...',
        value: true,
      });
      const splTokenAddress = new PublicKey(SPL_TOKEN);
      const sdk = state.sdk!;
      const tokenAccount = await sdk?.getTokenAccount(splTokenAddress);
      const accountInfo = await sdk?.getTokenAccountInfo(splTokenAddress);
      const feePayer = await getFeePayer();
      const tx = await sdk?.createTokenAccount(
        {
          tokenAccount: tokenAccount!,
          tokenMint: splTokenAddress,
        },
        feePayer!,
      );
      const transactionId = await relayTransaction(tx);
      setLoading({message: 'finalizing... please wait', value: true});
      await confirmTransaction(transactionId);
      setLoading(initialLoading);
      navigation.goBack();
    } catch (e: any) {
      setLoading(initialLoading);
      showMessage({
        message: 'address is not a valid spl token',
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
        text="add token"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 16}}>
        <SolaceCustomInput
          iconName="line-scan"
          handleIconPress={() => {
            showMessage({
              message: 'scan coming soon...',
              type: 'info',
            });
          }}
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
        onPress={addToken}
        loading={loading.value}
        disabled={!address}>
        <SolaceText type="secondary" weight="bold" color="dark">
          add token
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AddToken;
