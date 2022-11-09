import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {getAccounts} from '../../apis/sdk';
import {useRefreshOnFocus} from '../../hooks/useRefreshOnFocus';
import {WalletStackParamList} from '../../navigation/Home/Home';
import {GlobalContext} from '../../state/contexts/GlobalContext';
import globalStyles from '../../utils/global_styles';
import SolaceText from '../common/solaceui/SolaceText';
import AccountItem from './AccountItem';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Wallet'>;

const WalletHoldings = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const {data: accounts, isLoading} = useQuery(
    ['accounts'],
    () => getAccounts(state?.sdk!),
    {
      enabled: !!state.sdk,
    },
  );

  const queryClient = useQueryClient();

  const refresh = async () => {
    !isLoading && (await queryClient.invalidateQueries(['accounts']));
  };

  useRefreshOnFocus(refresh);

  const goToAssets = () => {
    navigation.navigate('Assets');
  };

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
      <View style={{paddingTop: 12}}>
        {accounts?.map((account, index) => {
          return <AccountItem account={account} key={index} type="send" />;
        })}
      </View>
    </View>
  );
};

export default WalletHoldings;
