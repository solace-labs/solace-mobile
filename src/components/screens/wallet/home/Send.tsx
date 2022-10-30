/* eslint-disable react-hooks/exhaustive-deps */
import {View, TouchableOpacity, TextInput} from 'react-native';
import React, {useContext, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import HapticFeedback from 'react-native-haptic-feedback';

import {
  AccountStatus,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import TopNavbar from '../../../common/TopNavbar';
import globalStyles from '../../../../utils/global_styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SolaceSDK, PublicKey} from 'solace-sdk';
import {confirmTransaction, getFeePayer} from '../../../../utils/apis';
import {relayTransaction} from '../../../../utils/relayer';
import {LAMPORTS_PER_SOL} from '../../../../utils/constants';
import {setAccountStatus, setReciever} from '../../../../state/actions/global';
import SolaceLoader from '../../../common/solaceui/SolaceLoader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../../hooks/useRefreshOnFocus';
import {getMaxBalance} from '../../../../apis/sdk';
import {minifyAddress} from '../../../../utils/helpers';
import {Colors} from '../../../../utils/colors';
import {SolaceToast} from '../../../common/solaceui/SolaceToast';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import {PublicKeyType} from '../security/SecurityScreen';

const hapticFeedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

type SendScreenProps = NativeStackScreenProps<WalletStackParamList, 'Send'>;

const SendScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<SendScreenProps['navigation']>();
  const {
    params: {asset},
  } = useRoute<SendScreenProps['route']>();

  const isSol = asset === 'SOL';

  const shortAsset = isSol ? 'SOL' : minifyAddress(asset, 4);
  const recipientAddress =
    state.send?.reciever || 'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF';
  // const recipientAddress = 'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF';

  const [amount, setAmount] = useState('');
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

  const handleSolTransfer = async (
    sdk: SolaceSDK,
    amountInLamports: number,
    reciever: PublicKeyType,
    feePayer: PublicKeyType,
  ) => {
    return await sdk.requestSolTransfer(
      {
        amount: amountInLamports,
        reciever,
      },
      feePayer,
    );
  };

  const handleSplTransfer = async (
    sdk: SolaceSDK,
    amountInLamports: number,
    reciever: PublicKeyType,
    feePayer: PublicKeyType,
  ) => {
    const splTokenAddress = new PublicKey(asset);
    const recieverTokenAccount = await sdk.getAnyAssociatedTokenAccount(
      splTokenAddress,
      reciever,
    );
    const accountInfo = await sdk.provider.connection.getAccountInfo(
      recieverTokenAccount,
    );
    if (!accountInfo) {
      const txn = await sdk.createAnyTokenAccount(
        reciever,
        recieverTokenAccount,
        splTokenAddress,
        feePayer,
      );
      setSendLoading({
        message: 'creating token account...',
        value: true,
      });
      const rs = await relayTransaction(txn);
      await confirmTransaction(rs);
    }
    setSendLoading({
      message: 'sending...',
      value: true,
    });
    return await sdk.requestSplTransfer(
      {
        amount: amountInLamports,
        mint: splTokenAddress,
        reciever,
        recieverTokenAccount,
      },
      feePayer!,
    );
  };

  const send = async () => {
    setSendLoading({
      message: 'sending...',
      value: true,
    });
    try {
      const sdk = state.sdk!;
      const feePayer = await getFeePayer();
      if (!sdk || !feePayer) {
        return;
      }
      const reciever = new PublicKey(recipientAddress);
      let tx;
      const amountInLamports = +amount * LAMPORTS_PER_SOL;
      console.log(amountInLamports);

      if (isSol) {
        tx = await handleSolTransfer(sdk, amountInLamports, reciever, feePayer);
      } else {
        tx = await handleSplTransfer(sdk, amountInLamports, reciever, feePayer);
      }

      console.log('IS guarded', tx.isGuarded, tx);
      const response = await relayTransaction(tx.transaction);
      setSendLoading({
        message: 'finalizing... please wait',
        value: true,
      });
      await confirmTransaction(response);
      setSendLoading({message: '', value: false});
      queryClient.invalidateQueries(['maxbalance']);
      queryClient.invalidateQueries(['ongoing-transfers']);
      navigation.goBack();
    } catch (e: any) {
      console.log('SENDING ERROR: ', e);
      if (e.message === 'Request failed with status code 401') {
        dispatch(setAccountStatus(AccountStatus.EXISITING));
      } else {
        setSendLoading({message: '', value: false});
        Toast.show({
          type: 'error',
          text1: e.message,
        });
      }
    }
  };

  const isDisabled = () => {
    if (+amount === 0) return true;
    if (isLoading) return true;
    if (isFetching) return true;
    if (+amount > +maxBalance!) return false;
    return (!amount || !recipientAddress || sendLoading.value) as boolean;
  };

  const handleAmountChange = (key: string, type?: 'max') => {
    if (+maxBalance < +(amount + key)) {
      return;
    }
    if (type === 'max') {
      setAmount(key);
      return;
    }
    if (key === 'b') {
      setAmount(amt => amt.slice(0, amt.length - 1));
      return;
    }
    if ((amount + key).match(/^\d*\.?\d*$/)) {
      setAmount(amount + key);
      return;
    }
  };

  const handleMax = () => {
    handleAmountChange(maxBalance!.toString(), 'max');
    Toast.show({
      type: 'success',
      text1: 'max balance value set',
      // text2: 'max value set',
    });
  };

  const handleEdit = () => {
    dispatch(setReciever(recipientAddress));
    navigation.navigate('EditReciever');
  };

  return (
    <SolaceContainer fullWidth={true}>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        // text={`to: (${ra})`}
        startClick={handleGoBack}
        endClick={handleEdit}
        endIcon="edit"
        endIconType="feather">
        <TouchableOpacity onPress={handleEdit} style={globalStyles.rowCenter}>
          <SolaceText size="md" weight="semibold">
            to:{''}
          </SolaceText>
          {recipientAddress ? (
            <SolaceText size="md" weight="semibold" color="normal">
              {' '}
              ({minifyAddress(recipientAddress, 5)})
            </SolaceText>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      </TopNavbar>
      <View
        style={[
          globalStyles.fullCenter,
          {
            flex: 0.33,
            paddingHorizontal: 16,
            justifyContent: 'space-evenly',
          },
        ]}>
        <View style={globalStyles.rowSpaceBetween}>
          <SolaceText size="lg" weight="semibold">
            {shortAsset}
          </SolaceText>
        </View>
        <View
          style={[
            globalStyles.fullWidth,
            {flexDirection: 'row', justifyContent: 'space-between'},
          ]}>
          <SolaceText style={{color: Colors.background.darkest}}>
            amount
          </SolaceText>
          <TextInput
            value={amount}
            showSoftInputOnFocus={false}
            placeholder="0"
            placeholderTextColor={Colors.text.normal}
            style={{
              fontSize: 26,
              color: Colors.text.white,
              fontWeight: '700',
            }}
            onChangeText={text => handleAmountChange(text)}
          />
          <TouchableOpacity onPress={handleMax}>
            <SolaceText type="secondary" size="sm" weight="bold">
              use max
            </SolaceText>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 0.33,
          borderTopWidth: 1,
          borderColor: Colors.text.dark,
        }}>
        <SolaceContainer
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View style={[globalStyles.rowSpaceBetween, {marginTop: 12}]}>
            <View style={globalStyles.rowCenter}>
              <Entypo
                name="wallet"
                size={20}
                color={Colors.text.normal}
                style={{marginRight: 10}}
              />
              <SolaceText type="secondary" color="normal" weight="bold">
                available balance
              </SolaceText>
            </View>
            <SolaceText type="secondary" color="white" weight="bold">
              {maxBalance}
            </SolaceText>
          </View>
          {sendLoading.value && <SolaceLoader text={sendLoading.message} />}
          <View
            style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 12}}>
            <SolaceButton
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'sending',
                });
                send();
              }}
              loading={sendLoading.value}
              background="purple"
              disabled={isDisabled()}
              style={{padding: 10}}>
              <SolaceText type="secondary" weight="bold" color="white">
                confirm
              </SolaceText>
            </SolaceButton>
          </View>
        </SolaceContainer>
      </View>
      <View
        style={{
          flex: 0.33,
          borderTopWidth: 1,
          borderColor: Colors.text.dark,
        }}>
        <SolaceKeypad handleKeyChange={handleAmountChange} />
      </View>
      {/* <Toast topOffset={50} /> */}
      <SolaceToast topOffset={10} />
    </SolaceContainer>
  );
};

const SolaceKeypad = ({
  handleKeyChange,
}: {
  handleKeyChange: (key: string) => void;
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'b'];
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {keys.map(key => {
        return (
          <TouchableOpacity
            onPress={() => {
              HapticFeedback.trigger('keyboardPress', hapticFeedbackOptions);
              handleKeyChange(key);
            }}
            key={key}
            style={{
              width: '33%',
              height: '25%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
            }}>
            {key === 'b' ? (
              <MaterialIcons
                name="keyboard-backspace"
                color="white"
                size={22}
              />
            ) : (
              <SolaceText size="lg" type="secondary">
                {key}
              </SolaceText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SendScreen;
