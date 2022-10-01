import {View, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';

const ComingSoon = () => {
  return (
    <SolaceContainer>
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} color="white" size="xl" weight="semibold">
          coming soon
        </SolaceText>
      </View>
      {/* <View style={{flex: 1}}>
        <ActivityIndicator size="small" />
      </View> */}
    </SolaceContainer>
  );
};
export default ComingSoon;
