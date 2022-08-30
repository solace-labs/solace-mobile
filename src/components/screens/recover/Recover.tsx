import {View, Image, StyleProp, ImageStyle} from 'react-native';
import React from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer/SolaceContainer';
import Header from '../../common/Header';
import SolaceText from '../../common/solaceui/SolaceText/SolaceText';
export type Props = {
  navigation: any;
};

const RecoverScreen: React.FC<Props> = ({navigation}) => {
  const imageStyle: StyleProp<ImageStyle> = {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="recovering your wallet"
          subHeading="please request your guardians to approve your solace wallet recovery. in the mean time, your funds will be protected by the"
        />
        <SolaceText type="secondary" weight="bold" align="left">
          safe mode
        </SolaceText>
        <Image
          source={require('../../../../assets/images/solace/secrurity.png')}
          style={imageStyle}
        />
      </View>
    </SolaceContainer>
  );
};

export default RecoverScreen;
