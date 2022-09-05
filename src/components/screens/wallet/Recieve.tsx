/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {GlobalContext, Tokens} from '../../../state/contexts/GlobalContext';
import ContactItem from '../../wallet/ContactItem';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {PublicKey} from 'solace-sdk';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {StorageGetItem} from '../../../utils/storage';
import {relayTransaction} from '../../../utils/relayer';
import {LAMPORTS_PER_SOL, SPL_TOKEN} from '../../../utils/constants';
import AccountItem from '../../wallet/AccountItem';
import SolaceLoader from '../../common/solaceui/SolaceLoader';

export type Props = {
  navigation: any;
};

export type Account = {
  amount: number;
  tokenAddress: string;
};

const RecieveScreen: React.FC<Props> = ({navigation}) => {
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

  useEffect(() => {
    getAccounts();
  }, []);

  if (loading) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="back"
          // endIcon="plus"
          text="recieve"
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
        // endIcon="plus"
        text="recieve"
        startClick={handleGoBack}
        // endClick={handleAdd}
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
            {accounts.map(account => {
              return (
                <AccountItem account={account} key={account.tokenAddress} />
              );
            })}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
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
                add a address token
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
