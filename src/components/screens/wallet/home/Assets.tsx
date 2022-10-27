/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useContext} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {useQuery, useQueryClient} from '@tanstack/react-query';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import globalStyles from '../../../../utils/global_styles';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar';
import SolaceText from '../../../common/solaceui/SolaceText';
import AccountItem from '../../../wallet/AccountItem';
import SolaceLoader from '../../../common/solaceui/SolaceLoader';
import SolaceIcon from '../../../common/solaceui/SolaceIcon';
import {useRefreshOnFocus} from '../../../../hooks/useRefreshOnFocus';
import {getAccounts} from '../../../../apis/sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {WalletStackParamList} from '../../../../navigation/Home/Home';

type AssetsScreenProps = NativeStackScreenProps<WalletStackParamList, 'Assets'>;

const Assets = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<AssetsScreenProps['navigation']>();
  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useQuery(['accounts'], () => getAccounts(state?.sdk!), {
    enabled: !!state.sdk,
  });

  const queryClient = useQueryClient();

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

  const refresh = async () => {
    !isLoading && (await queryClient.invalidateQueries(['accounts']));
  };

  useRefreshOnFocus(refresh);

  if (isLoading) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="ios-return-up-back"
          startIconType="ionicons"
          // endIcon="plus"
          text="assets"
          startClick={handleGoBack}
          // endClick={handleAdd}
        />
        <SolaceLoader text="getting tokens">
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
        // endIcon=""
        text="assets"
        startClick={handleGoBack}
        // endClick={handleAdd}
      />
      <View style={globalStyles.fullCenter}>
        {/* {accounts && accounts.length > 0 ? ( */}
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
            <SolaceIcon background="darkest" color="white" name="down" />
          </View>
          <AccountItem account={{tokenAddress: 'SOL', amount: 0}} type="send" />
          {accounts?.map((account, index) => {
            return <AccountItem account={account} key={index} type="send" />;
          })}
        </ScrollView>
        {/* ) : ( */}
        {/* <View style={{flex: 1, width: '100%'}}>
            <Image
              source={require('../../../../../assets/images/solace/send-money.png')}
              style={globalStyles.image}
            />
            <SolaceText type="secondary" size="sm" weight="bold">
              no tokens found
            </SolaceText>
            <SolaceText type="secondary" size="xs" mt={10}>
              sol transfers are coming very soon
            </SolaceText>
          </View> */}
        {/* )} */}
      </View>
    </SolaceContainer>
  );
};

export default Assets;
