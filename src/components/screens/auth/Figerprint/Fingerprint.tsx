import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';

export type Props = {
  navigation: any;
};

const FingerprintScreen: React.FC<Props> = ({navigation}) => {
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
      <View style={[styles.container, {justifyContent: 'flex-start'}]}>
        <Image
          source={require('../../../../../assets/images/solace/light-fingerprint.png')}
          style={{width: 40, height: 40}}
        />
        <SolaceText mt={20} weight="semibold" size="lg">
          unlock with fingerprint
        </SolaceText>
        <TouchableOpacity onPress={() => navigation.navigate('MainPasscode')}>
          <SolaceText
            mt={20}
            size="md"
            type="secondary"
            weight="bold"
            variant="normal">
            use passcode
          </SolaceText>
        </TouchableOpacity>
      </View>
    </SolaceContainer>
  );
};

export default FingerprintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
