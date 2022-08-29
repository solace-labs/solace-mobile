import {View, Image, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';

const Loading = () => {
  return (
    <SolaceContainer>
      <View style={styles.container}>
        <Image
          source={require('../../../../../assets/images/solace/solace-icon.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
