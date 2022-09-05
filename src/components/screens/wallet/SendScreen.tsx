/* eslint-disable react-hooks/exhaustive-deps */
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {getFeePayer} from '../../../utils/apis';
import {relayTransaction} from '../../../utils/relayer';
import {
  LAMPORTS_PER_SOL,
  PROGRAM_ADDRESS,
  SPL_TOKEN,
  TOKEN_PROGRAM_ID,
} from '../../../utils/constants';
import AccountItem from '../../wallet/AccountItem';
import SolaceLoader from '../../common/solaceui/SolaceLoader';

export type Props = {
  navigation: any;
};

export type Account = {
  amount: number;
  tokenAddress: string;
};

const SendScreen: React.FC<Props> = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [address, setAddress] = useState(state.sdk?.wallet.toString() ?? '');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddContact');
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    showMessage({
      message: 'address copied',
    });
  };

  const getAccounts = async () => {
    try {
      setLoading(true);
      const sdk = state.sdk;
      const splTokenAddress = new PublicKey(SPL_TOKEN);
      const tokenAccount = await sdk?.getTokenAccount(splTokenAddress);
      console.log('Getting account', tokenAccount!.toString());
      const accountInfo = await sdk?.getTokenAccountInfo(splTokenAddress);
      console.log({accountInfo});

      if (!accountInfo) {
        const feePayer = await getFeePayer();
        const tx = await sdk?.createTokenAccount(
          {
            tokenAccount: tokenAccount!,
            tokenMint: splTokenAddress,
          },
          feePayer,
        );
        console.log({tx});
        const response = await relayTransaction(tx);
        console.log(response);
        setLoading(false);
        return;
      }
      const balance = +accountInfo!.amount.toString() / LAMPORTS_PER_SOL;
      setAccounts([
        {amount: balance, tokenAddress: splTokenAddress.toString()},
      ]);
      console.log(balance);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      showMessage({message: 'some error try again', type: 'warning'});
    }
    // constsdk?.getTokenAccountInfo();
  };

  const getAllAccounts = async () => {
    try {
      setLoading(true);
      const sdk = state.sdk!;
      const allAccounts = await sdk.provider.connection.getTokenAccountsByOwner(
        sdk.wallet,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );
      const accs: Account[] = [];
      for (let i = 0; i < allAccounts.value.length; i++) {
        const accountInfoBuffer = Buffer.from(
          allAccounts.value[i].account.data,
        );
        const accountInfo = await SolaceSDK.getAccountInfo(accountInfoBuffer);
        const balance = +accountInfo.amount.toString() / LAMPORTS_PER_SOL;
        const tokenAddress = accountInfo.mint.toString();
        accs.push({
          amount: balance,
          tokenAddress,
        });
      }
      console.log({accs});
      setAccounts(accs);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERR', e);
    }
  };

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', async () => {
      await getAllAccounts();
    });
    return willFocusSubscription;
  }, [navigation]);

  useEffect(() => {
    getAllAccounts();
  }, []);

  if (loading) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="back"
          // endIcon="plus"
          text="send"
          startClick={handleGoBack}
          // endClick={handleAdd}
        />
        <SolaceLoader text="getting tokens">
          <ActivityIndicator size="small" style={{marginLeft: 8}} />
        </SolaceLoader>
      </SolaceContainer>
    );
  }
  // const contacts = state.contacts!;
  const contacts: any[] = [];
  const showContacts = contacts.length > 0;

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        endIcon="plus"
        text="send"
        startClick={handleGoBack}
        endClick={handleAdd}
      />
      <View style={globalStyles.fullCenter}>
        {/* <View style={globalStyles.fullWidth}>
          <SolaceCustomInput
            placeholder="username or address"
            iconName="content-copy"
            handleIconPress={() => handleCopy(address)}
            value={address}
            iconType="mci"
          />
        </View> */}
        {/* <TouchableOpacity style={[globalStyles.rowCenter, {marginTop: 8}]}>
          <SolaceIcon name="gift" type="dark" />
          <SolaceText type="secondary" weight="bold" variant="normal">
            send a gift
          </SolaceText>
        </TouchableOpacity> */}
        {accounts && accounts.length > 0 ? (
          <ScrollView bounces={true} style={{margin: 8, width: '100%'}}>
            {accounts.map((account, index) => {
              return <AccountItem account={account} key={index} type="send" />;
            })}
          </ScrollView>
        ) : (
          <View style={{flex: 1, width: '100%'}}>
            <Image
              source={require('../../../../assets/images/solace/send-money.png')}
              style={globalStyles.image}
            />
            <SolaceText type="secondary" size="sm">
              <SolaceText
                onPress={handleAdd}
                type="secondary"
                size="sm"
                variant="white"
                style={{textDecorationLine: 'underline'}}
                weight="bold">
                add a address token
              </SolaceText>{' '}
              no tokens found
            </SolaceText>
          </View>
        )}
      </View>
    </SolaceContainer>
  );
};

export default SendScreen;
