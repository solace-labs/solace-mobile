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
import {WalletStackParamList} from '../../navigation/Home/Home';
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

  return (
    <View style={{flex: 0.6, justifyContent: 'space-between', marginTop: 20}}>
      <View style={globalStyles.rowSpaceBetween}>
        <SolaceText weight="semibold" size="lg">
          vault holdings
        </SolaceText>
        <TouchableOpacity onPress={goToAssets}>
          <SolaceText
            type="secondary"
            color="normal"
            style={{fontSize: 14}}
            weight="bold">
            view all
          </SolaceText>
        </TouchableOpacity>
      </View>
      {/* <ScrollView bounces={true} style={{width: '100%', paddingTop: 10}}> */}
      <View style={{paddingTop: 10}}>
        {accounts?.map((account, index) => {
          return <AccountItem account={account} key={index} type="send" />;
        })}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default WalletHoldings;
