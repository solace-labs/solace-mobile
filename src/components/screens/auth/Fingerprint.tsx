import {View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';

export type Props = {
  navigation: any;
};

const FingerprintScreen: React.FC<Props> = ({navigation}) => {
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
      <View style={[globalStyles.fullCenter, {justifyContent: 'flex-start'}]}>
        <Image
          source={require('../../../../assets/images/solace/light-fingerprint.png')}
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
