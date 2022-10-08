import {View, Text} from 'react-native';
import React, {FC} from 'react';
import SolaceText from '../common/solaceui/SolaceText';

type Props = {
  price: number;
  change: 'positive' | 'negative';
};

const PriceChangeChip: FC<Props> = ({price, change}) => {
  return (
    <View
      style={{
        borderRadius: 8,
        paddingHorizontal: 2,
        backgroundColor: change === 'negative' ? '#362828' : '#28362D',
      }}>
      <SolaceText
        size="xs"
        weight="bold"
        type="secondary"
        style={{color: change === 'negative' ? '#DC7070' : '#70DC94'}}>
        {price}%
      </SolaceText>
    </View>
  );
};

export default PriceChangeChip;
