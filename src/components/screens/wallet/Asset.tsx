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
import {useNavigation} from '@react-navigation/native';
import SolaceInput from '../../common/solaceui/SolaceInput';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import {PublicKey} from 'solace-sdk';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {relayTransaction} from '../../../utils/relayer';
import {LAMPORTS_PER_SOL} from '../../../utils/constants';
import {showMessage} from 'react-native-flash-message';
import {setAccountStatus} from '../../../state/actions/global';
import SolaceLoader from '../../common/solaceui/SolaceLoader';

const AssetScreen = () => {
  const navigation = useNavigation();
  const {state, dispatch} = useContext(GlobalContext);
  const [amount, setAmount] = useState('');
  const [maxBalance, setMaxBalance] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState(
    'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
  );
  // const [recipientAddress, setRecipientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState({
    message: '',
    value: false,
  });
  const navState = navigation.getState();
  const params = navState.routes.find(route => route.name === 'Asset')
    ?.params as any;
  const asset = params.id;
  const shortAsset = asset.slice(0, 4) + '...' + asset.slice(-4);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getMaxBalance = async () => {
    try {
      setLoading(true);
      const sdk = state.sdk;
      const splTokenAddress = new PublicKey(asset);
      const accountInfo = await sdk?.getTokenAccountInfo(splTokenAddress);
      const balance = +accountInfo!.amount.toString() / LAMPORTS_PER_SOL;
      setMaxBalance(balance);
      setLoading(false);
    } catch (e: any) {
      console.log(e.message);
      if (e.message === 'Request failed with status code 401') {
        dispatch(setAccountStatus(AccountStatus.EXISITING));
      } else {
        setLoading(false);
        showMessage({message: 'some error try again', type: 'warning'});
      }
    }
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
      console.log({feePayer});
      if (!sdk) {
        return;
      }
      const splTokenAddress = new PublicKey(asset);
      const reciever = new PublicKey(recipientAddress);
      console.log(reciever, recipientAddress, splTokenAddress);
      const recieverTokenAccount = await sdk.getPDAAssociatedTokenAccount(
        splTokenAddress,
        reciever,
      );
      // const recieverTokenAccount = await sdk.getAnyAssociatedTokenAccount(
      //   splTokenAddress,
      //   reciever,
      // );
      console.log({
        splTokenAddress,
        recieverTokenAccount,
        reciever,
        amount,
      });
      const tx = await sdk.requestSplTransfer(
        {
          amount: +amount * LAMPORTS_PER_SOL,
          mint: splTokenAddress,
          reciever,
          recieverTokenAccount,
        },
        feePayer,
      );
      console.log({
        tx,
        splTokenAddress,
        recieverTokenAccount,
        reciever,
        amount,
      });
      const response = await relayTransaction(tx);
      console.log(response);
      setSendLoading({
        message: 'finalizing... please wait',
        value: true,
      });
      await confirmTransaction(response);
      const data = await sdk.fetchWalletData();
      console.log({data});
      console.log(data.ongoingTransfer.approvals);
      setSendLoading({message: '', value: false});
      await getMaxBalance();
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

  useEffect(() => {
    getMaxBalance();
  }, []);

  const isDisabled = () => {
    if (+amount > +maxBalance) {
      return false;
    }
    return (!amount || !recipientAddress || sendLoading.value) as boolean;
  };

  const handleAmountChange = (amt: string) => {
    if (+amt > +maxBalance) {
      showMessage({
        message: 'value must be less than total amount',
        type: 'info',
      });
      return;
    }
    setAmount(amt);
  };

  const handleMax = () => {
    handleAmountChange(maxBalance.toString());
  };

  return (
    <SolaceContainer>
      <TopNavbar startIcon="back" text="send" startClick={handleGoBack} />
      <View style={[globalStyles.fullCenter, {flex: 0.5}]}>
        <View style={globalStyles.fullWidth}>
          <SolaceCustomInput
            iconName="line-scan"
            placeholder="recipient's address"
            iconType="mci"
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
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <SolaceText type="secondary" variant="normal" weight="bold">
              {maxBalance} available
            </SolaceText>
          )}
          <TouchableOpacity onPress={handleMax}>
            <SolaceText type="secondary">use max</SolaceText>
          </TouchableOpacity>
        </View>
        {sendLoading.value && <SolaceLoader text={sendLoading.message} />}
      </View>
      <SolaceButton
        onPress={send}
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
