import Clipboard from '@react-native-community/clipboard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {FC, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {getAccounts} from '../../apis/sdk';
import {useRefreshOnFocus} from '../../hooks/useRefreshOnFocus';
import {WalletStackParamList} from '../../navigation/Wallet';
import {GlobalContext} from '../../state/contexts/GlobalContext';
import globalStyles from '../../utils/global_styles';
import SolaceContainer from '../common/solaceui/SolaceContainer';
import SolaceLoader from '../common/solaceui/SolaceLoader';
import SolaceText from '../common/solaceui/SolaceText';
import AccountItem from './AccountItem';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Wallet'>;

const WalletHoldings = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const {
    data: accounts,
    isLoading,
    isFetching,
  } = useQuery(['accounts'], () => getAccounts(state?.sdk!), {
    enabled: !!state.sdk,
  });

  const queryClient = useQueryClient();

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

  const goToAssets = () => {
    navigation.navigate('Assets');
  };

  // if (data.length > 0) {
  //   return (
  //     <ScrollView>
  //       {data.map((item: any) => {
  //         return <Transaction key={item.id} item={item} />;
  //       })}
  //     </ScrollView>
  //   );
  // }

  const openLink = () => {
    const link = `https://solscan.io/account/${
      state.sdk!.wallet
    }?cluster=testnet`;
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
        showMessage({
          message:
            "can't open link. please select default browser in the setting",
          type: 'info',
        });
      }
    });
  };

  // if (isLoading) {
  //   return (
  //     <SolaceContainer>
  //       {/* <TopNavbar
  //         startIcon="ios-return-up-back"
  //         startIconType="ionicons"
  //         // endIcon="plus"
  //         text="send"
  //         startClick={handleGoBack}
  //         // endClick={handleAdd}
  //       /> */}
  //       <SolaceLoader text="getting tokens">
  //         <ActivityIndicator size="small" />
  //       </SolaceLoader>
  //     </SolaceContainer>
  //   );
  // }

  return (
    <View style={{flex: 0.6, justifyContent: 'space-between', marginTop: 20}}>
      <View style={globalStyles.rowSpaceBetween}>
        <SolaceText weight="semibold" size="lg">
          vault holdings
        </SolaceText>
        <TouchableOpacity onPress={goToAssets}>
          {/* see more */}
          <SolaceText
            type="secondary"
            color="normal"
            style={{fontSize: 14}}
            weight="bold">
            view all
          </SolaceText>
        </TouchableOpacity>
      </View>
      {accounts && accounts.length > 0 ? (
        <ScrollView
          // refreshControl={
          //   <RefreshControl refreshing={isLoading} onRefresh={refresh} />
          // }
          bounces={true}
          style={{width: '100%'}}>
          <View
            style={[
              globalStyles.rowCenter,
              {justifyContent: 'center', marginBottom: 20},
            ]}>
            {/* <SolaceText size="sm" weight="extralight">
              pull to refresh
            </SolaceText>
            <SolaceIcon background="dark" name="down" /> */}
          </View>
          {accounts.map((account, index) => {
            return <AccountItem account={account} key={index} type="send" />;
          })}
        </ScrollView>
      ) : (
        <View style={{flex: 1, width: '100%'}}>
          {isLoading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <>
              <Image
                source={require('../../../assets/images/solace/send-money.png')}
                style={[globalStyles.image, {height: 150}]}
              />
              <SolaceText type="secondary" size="sm" weight="bold">
                no tokens found
              </SolaceText>
              <SolaceText type="secondary" size="xs" mt={10}>
                sol transfers are coming very soon
              </SolaceText>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default WalletHoldings;
