/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
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
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import {createIconSetFromFontello} from 'react-native-vector-icons';

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
      setAccounts(accs);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('ERR', e);
      showMessage({
        message: 'service unavilable',
        type: 'danger',
      });
    }
  };

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', async () => {
      await getAllAccounts();
    });
    return willFocusSubscription;
  }, [navigation]);

  // useEffect(() => {
  //   getAllAccounts();
  //   const getData = async () => {
  //     const walletData = await state.sdk!.fetchWalletData();
  //     console.log(walletData);
  //   };
  //   getData();
  // }, []);

  const handleRefresh = () => {
    getAllAccounts();
  };

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
          <ActivityIndicator size="small" />
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
        // endIcon="plus"
        text="send"
        startClick={handleGoBack}
        // endClick={handleAdd}
      />
      <View style={globalStyles.fullCenter}>
        {accounts && accounts.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
            bounces={true}
            style={{marginTop: -50, width: '100%'}}>
            <View
              style={[
                globalStyles.rowCenter,
                {justifyContent: 'center', marginBottom: 20},
              ]}>
              <SolaceText size="sm" weight="extralight">
                pull to refresh
              </SolaceText>
              <SolaceIcon type="dark" name="down" />
            </View>
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
            <SolaceText type="secondary" size="sm" weight="bold">
              no tokens found
            </SolaceText>
            <SolaceText type="secondary" size="xs" mt={10}>
              sol transfers are coming very soon
            </SolaceText>
          </View>
        )}
      </View>
    </SolaceContainer>
  );
};

export default SendScreen;
