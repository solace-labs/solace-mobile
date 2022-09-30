/* eslint-disable react-hooks/exhaustive-deps */
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import TopNavbar from '../../common/TopNavbar';
import globalStyles from '../../../utils/global_styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import {PublicKey} from 'solace-sdk';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {relayTransaction} from '../../../utils/relayer';
import {LAMPORTS_PER_SOL} from '../../../utils/constants';
import {showMessage} from 'react-native-flash-message';
import {setAccountStatus} from '../../../state/actions/global';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WalletStackParamList} from '../../../navigation/Wallet';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../hooks/useRefreshOnFocus';
import {getMaxBalance} from '../../../apis/sdk';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Asset'>;

const AssetScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const {
    params: {asset, contact},
  } = useRoute<WalletScreenProps['route']>();

  const shortAsset = asset.slice(0, 4) + '...' + asset.slice(-4);

  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(
    contact ? contact : '',
    // 'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
  );
  // const [recipientAddress, setRecipientAddress] = useState('');
  const [sendLoading, setSendLoading] = useState({
    message: '',
    value: false,
  });

  const queryClient = useQueryClient();

  const {data, isLoading, isFetching} = useQuery(
    ['maxbalance'],
    () => getMaxBalance(state.sdk!, asset),
    {
      enabled: !!state.sdk,
    },
  );

  const maxBalance = data ?? 0;

  const refetch = async () => {
    isLoading && (await queryClient.invalidateQueries(['maxbalance']));
  };

  useRefreshOnFocus(refetch);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const send = async () => {
    setSendLoading({
      message: 'sending...',
      value: true,
    });
    // showMessage({
    //   message: 'sending',
    //   type: 'info',
    // });
    try {
      const sdk = state.sdk!;
      const feePayer = await getFeePayer();
      if (!sdk) {
        return;
      }
      const splTokenAddress = new PublicKey(asset);
      const reciever = new PublicKey(recipientAddress);
      const recieverTokenAccount = await sdk.getPDAAssociatedTokenAccount(
        splTokenAddress,
        reciever,
      );
      const tx = await sdk.requestSplTransfer(
        {
          amount: +amount * LAMPORTS_PER_SOL,
          mint: splTokenAddress,
          reciever,
          recieverTokenAccount,
        },
        feePayer!,
      );
      const response = await relayTransaction(tx);
      setSendLoading({
        message: 'finalizing... please wait',
        value: true,
      });
      await confirmTransaction(response);
      const res = await sdk.fetchWalletData();
      setSendLoading({message: '', value: false});
      queryClient.invalidateQueries(['maxbalance']);
      navigation.goBack();
    } catch (e: any) {
      console.log('SENDING ERROR: ', e);
      if (e.message === 'Request failed with status code 401') {
        dispatch(setAccountStatus(AccountStatus.EXISITING));
      } else {
        setSendLoading({message: '', value: false});
        showMessage({
          message: 'some error sending. try again later',
          type: 'danger',
        });
      }
    }
  };

  const isDisabled = () => {
    if (isLoading) return true;
    if (isFetching) return true;
    if (+amount > +maxBalance!) return false;
    return (!amount || !recipientAddress || sendLoading.value) as boolean;
  };

  const handleAmountChange = (amt: string) => {
    if (+amt > +maxBalance!) {
      showMessage({
        message: 'value must be less than total amount',
        type: 'info',
      });
      return;
    }
    setAmount(amt);
  };

  const handleMax = () => {
    handleAmountChange(maxBalance!.toString());
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="send"
        startClick={handleGoBack}
      />
      <View style={[globalStyles.fullCenter, {flex: 0.5}]}>
        <View style={globalStyles.fullWidth}>
          <SolaceCustomInput
            iconName="line-scan"
            placeholder="recipient's address"
            iconType="mci"
            handleIconPress={() => {
              showMessage({
                message: 'scan coming soon...',
                type: 'info',
              });
            }}
            value={recipientAddress}
            onChangeText={setRecipientAddress}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        <View style={globalStyles.rowSpaceBetween}>
          <SolaceText size="2xl" weight="semibold">
            {shortAsset}
          </SolaceText>
        </View>
        <SolaceInput
          mt={20}
          value={amount}
          placeholder="0.00"
          keyboardType="decimal-pad"
          onChangeText={text => handleAmountChange(text)}
        />
        <View style={[globalStyles.rowSpaceBetween, {marginTop: 10}]}>
          <SolaceText type="secondary" variant="normal" weight="bold">
            {maxBalance} available
          </SolaceText>
          <TouchableOpacity onPress={handleMax}>
            <SolaceText type="secondary">use max</SolaceText>
          </TouchableOpacity>
        </View>
        {sendLoading.value && <SolaceLoader text={sendLoading.message} />}
      </View>
      <SolaceButton
        onPress={send}
        mb={10}
        loading={sendLoading.value}
        disabled={isDisabled()}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          send
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AssetScreen;
