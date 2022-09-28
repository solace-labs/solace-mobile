import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {Account} from '../screens/wallet/Recieve';
import {WalletStackParamList} from '../../navigation/Wallet';

export type Props = {
  account: Account;
  type: 'send' | 'recieve';
};

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Send'>;

const AccountItem: React.FC<Props> = ({
  account: {tokenAddress, amount},
  type,
}) => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const accountAddress =
    tokenAddress.slice(0, 5) + '...' + tokenAddress.slice(-5);
  const currentBalance = amount.toFixed(2);

  const redirectToAsset = () => {
    if (type === 'send') {
      navigation.navigate('Contact', {asset: tokenAddress.toString()});
    } else if (type === 'recieve') {
      navigation.navigate('RecieveItem', {token: tokenAddress.toString()});
    }
  };

  return (
    <View
      style={{
        marginVertical: 10,
      }}>
      <TouchableOpacity
        style={[globalStyles.rowSpaceBetween]}
        onPress={redirectToAsset}>
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
