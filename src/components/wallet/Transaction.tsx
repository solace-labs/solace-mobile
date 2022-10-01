import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import moment from 'moment';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';

const Transaction = ({item}: {item: any}) => {
  return (
    <View style={{marginVertical: 10}}>
      <SolaceText
        align="left"
        type="secondary"
        size="sm"
        weight="bold"
        color="white"
        mb={8}>
        {moment(item?.date)?.format('DD MMM yyyy')?.toLowerCase()}
      </SolaceText>
      <TouchableOpacity style={globalStyles.rowCenter}>
        <View style={globalStyles.avatar}>
          <SolaceText type="secondary" weight="bold">
            ap
          </SolaceText>
        </View>
        <View>
          <SolaceText
            align="left"
            type="secondary"
            size="sm"
            weight="bold"
            color="light">
            from
          </SolaceText>
          <SolaceText align="left" type="secondary" size="sm" weight="bold">
            {item.username}
          </SolaceText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Transaction;
