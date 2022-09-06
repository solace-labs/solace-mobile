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
import {SolaceSDK} from 'solace-sdk';
import {LAMPORTS_PER_SOL, TOKEN_PROGRAM_ID} from '../../../utils/constants';
import AccountItem from '../../wallet/AccountItem';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceIcon from '../../common/solaceui/SolaceIcon';

export type Props = {
  navigation: any;
};

export type Account = {
  amount: number;
  tokenAddress: string;
};

const RecieveScreen: React.FC<Props> = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState({
    message: '',
    value: false,
  });
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddToken');
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    showMessage({
      message: 'address copied',
    });
  };

  const getAccounts = async () => {
    console.log('getting');
    try {
      setLoading({
        message: 'fetching tokens...',
        value: true,
      });
      const sdk = state.sdk!;
      const allAccounts = await sdk.provider.connection.getTokenAccountsByOwner(
        sdk.wallet,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );
      console.log({account: allAccounts.value});
      const accs: Account[] = [];
      for (let i = 0; i < allAccounts.value.length; i++) {
        const accountInfoBuffer = Buffer.from(
          allAccounts.value[i].account.data,
        );
        console.log({accountInfoBuffer});
        const accountInfo = await SolaceSDK.getAccountInfo(accountInfoBuffer);
        console.log({accountInfo});
        const balance = +accountInfo.amount.toString() / LAMPORTS_PER_SOL;
        const tokenAddress = accountInfo.mint.toString();
        console.log({
          amount: balance,
          tokenAddress,
        });
        accs.push({
          amount: balance,
          tokenAddress,
        });
      }
      console.log({accs});
      setAccounts(accs);
      setLoading({
        message: '',
        value: false,
      });
    } catch (e) {
      console.log(e);
      setLoading({
        message: '',
        value: false,
      });
      showMessage({message: 'service unavailable', type: 'warning'});
    }
  };

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', async () => {
      await getAccounts();
    });
    return willFocusSubscription;
  }, [navigation]);

  // useEffect(() => {
  //   getAccounts();
  // }, []);

  if (loading.value) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="back"
          endIcon="plus"
          text="recieve"
          startClick={handleGoBack}
          endClick={handleAdd}
        />
        <SolaceLoader text={loading.message}>
          <ActivityIndicator size="small" style={{marginTop: 8}} />
        </SolaceLoader>
      </SolaceContainer>
    );
  }
  const handleRefresh = () => {
    getAccounts();
  };
  // const contacts = state.contacts!;
  const contacts: any[] = [];
  const showContacts = contacts.length > 0;

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        endIcon="plus"
        text="recieve"
        startClick={handleGoBack}
        endClick={handleAdd}
      />
      <View style={globalStyles.fullCenter}>
        {accounts && accounts.length > 0 ? (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={loading.value}
                  onRefresh={handleRefresh}
                />
              }
              bounces={true}
              style={{margin: 8, width: '100%'}}>
              <View
                style={[globalStyles.rowCenter, {justifyContent: 'center'}]}>
                <SolaceText size="sm" weight="extralight">
                  pull to refresh
                </SolaceText>
                <SolaceIcon type="dark" name="down" />
              </View>
              {accounts.map((account, index) => {
                return (
                  <AccountItem account={account} key={index} type="recieve" />
                );
              })}
            </ScrollView>
          </>
        ) : (
          <View style={[globalStyles.fullCenter, globalStyles.fullWidth]}>
            <Image
              source={require('../../../../assets/images/solace/send-money.png')}
              style={{
                width: '100%',
                height: 240,
                resizeMode: 'contain',
              }}
            />
            <SolaceText type="secondary" size="sm">
              <SolaceText
                onPress={handleAdd}
                type="secondary"
                size="sm"
                variant="white"
                style={{textDecorationLine: 'underline'}}
                weight="bold">
                add a token
              </SolaceText>{' '}
              to recieve
            </SolaceText>
          </View>
        )}
      </View>
    </SolaceContainer>
  );
};

export default RecieveScreen;
