import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {Account} from '../screens/wallet/Recieve';

export type Props = {
  account: Account;
};

const AccountItem: React.FC<Props> = ({account: {tokenAddress, amount}}) => {
  const navigation: any = useNavigation();

  const accountAddress =
    tokenAddress.slice(0, 5) + '...' + tokenAddress.slice(-5);
  const currentBalance = amount.toFixed(2);
  return (
    <View
      style={{
        marginVertical: 10,
      }}>
      <TouchableOpacity
        style={[globalStyles.rowSpaceBetween]}
        onPress={() => navigation.navigate('RecieveItem', {id: tokenAddress})}>
        <View style={globalStyles.rowCenter}>
          <View style={globalStyles.avatar}>
            <SolaceText type="secondary" weight="bold">
              {tokenAddress[0]}
            </SolaceText>
          </View>
          <View>
            <SolaceText weight="bold" align="left">
              unknown token
            </SolaceText>
            <SolaceText
              size="sm"
              mt={8}
              type="secondary"
              weight="bold"
              align="left">
              {currentBalance} {accountAddress}
            </SolaceText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AccountItem;
