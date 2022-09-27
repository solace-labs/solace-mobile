/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useContext} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import AccountItem from '../../wallet/AccountItem';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../hooks/useRefreshOnFocus';
import {getAccounts} from '../../../apis/sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WalletStackParamList} from '../../../navigation/Wallet';
import {useNavigation} from '@react-navigation/native';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'Recieve'
>;

export type Account = {
  amount: number;
  tokenAddress: string;
};

const RecieveScreen = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();

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

  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useQuery(['accounts'], () => getAccounts(state?.sdk!), {
    enabled: !!state?.sdk,
  });

  const queryClient = useQueryClient();
  const refresh = async () => {
    isLoading &&
      isFetching &&
      (await queryClient.invalidateQueries(['accounts']));
  };

  useRefreshOnFocus(refresh);

  if (isLoading) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="ios-return-up-back"
          startIconType="ionicons"
          endIcon="plus"
          text="recieve"
          startClick={handleGoBack}
          endClick={handleAdd}
        />
        <SolaceLoader text={'fetching accounts...'}>
          <ActivityIndicator size="small" />
        </SolaceLoader>
      </SolaceContainer>
    );
  }

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        fetching={isFetching}
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
                <RefreshControl refreshing={isLoading} onRefresh={refresh} />
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
