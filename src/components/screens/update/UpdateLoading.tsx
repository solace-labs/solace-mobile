import {View, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';

const Loading = () => {
  return (
    <SolaceContainer>
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} variant="white" size="xl" weight="semibold">
          solace
        </SolaceText>
      </View>
      <View style={{flex: 1}}>
        <SolaceText>checking and downloading updates...</SolaceText>
        <ActivityIndicator size="small" style={{marginTop: 10}} />
      </View>
    </SolaceContainer>
  );
};
export default Loading;
