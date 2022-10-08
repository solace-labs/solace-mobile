import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {Account} from '../screens/wallet/home/Recieve';
import SolacePaper from '../common/solaceui/SolacePaper';
import {minifyAddress} from '../../utils/helpers';
import {SwapStackParamList} from '../../navigation/Home/Swap';
import PriceChangeChip from './PriceChangeChip';

export type Asset = {
  name: string;
  symbol: string;
  amount: number;
  amountInDollars: number;
  changeInPrice: number;
};

export type Props = {
  asset: Asset;
};

type AssetItemScreenProps = NativeStackScreenProps<
  SwapStackParamList,
  'TokenListScreen'
>;

const AssetItem: React.FC<Props> = ({
  asset: {symbol, name, amountInDollars, changeInPrice, amount},
}) => {
  const navigation = useNavigation<AssetItemScreenProps['navigation']>();

  const accountAddress = minifyAddress(symbol, 5);
  const currentBalance = amount.toFixed(2);

  // const redirectToAsset = () => {
  //   if (type === 'send') {
  //     navigation.navigate('Contact', {asset: tokenAddress.toString()});
  //   } else if (type === 'recieve') {
  //     navigation.navigate('RecieveItem', {token: tokenAddress.toString()});
  //   }
  // };

  return (
    <SolacePaper size="xs" mt={12}>
      <TouchableOpacity
        style={[globalStyles.rowSpaceBetween, globalStyles.fullWidth]}
        // onPress={redirectToAsset}
      >
        <View style={globalStyles.rowCenter}>
          <View style={globalStyles.avatar}>
            <SolaceText type="secondary" color="awaiting">
              {symbol[0]}
            </SolaceText>
          </View>
          <View>
            <SolaceText type="secondary" align="left">
              {name}
            </SolaceText>
            <SolaceText
              size="sm"
              // mt={8}
              type="secondary"
              // weight="bold"
              align="left">
              {amount} {symbol}
            </SolaceText>
          </View>
        </View>
        <View style={{justifyContent: 'space-between'}}>
          <View>
            <SolaceText type="secondary" mb={4}>
              ${amountInDollars}
            </SolaceText>
          </View>
          <PriceChangeChip
            price={changeInPrice}
            change={changeInPrice >= 0 ? 'positive' : 'negative'}
          />
          {/* <View>
            <SolaceText>{changeInPrice}</SolaceText>
          </View> */}
        </View>
      </TouchableOpacity>
    </SolacePaper>
  );
};

export default AssetItem;
