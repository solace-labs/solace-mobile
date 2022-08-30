import {View, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import SolaceContainer from '../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../common/SolaceUI/SolaceText/SolaceText';
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
        <ActivityIndicator size="small" />
      </View>
    </SolaceContainer>
  );
};
export default Loading;
