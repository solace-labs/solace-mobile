/* eslint-disable react-hooks/exhaustive-deps */
import {Image, View} from 'react-native';
import React from 'react';

import {PublicKey} from 'solace-sdk';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import TopNavbar from '../../../common/TopNavbar';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';
import {IconType} from '../../../common/solaceui/SolaceIcon';
import globalStyles from '../../../../utils/global_styles';
import {OptionsItem} from './SecurityScreen';
import SolaceText from '../../../common/solaceui/SolaceText';

type AboutScreenProps = NativeStackScreenProps<SecurityStackParamList, 'About'>;

export type PublicKeyType = InstanceType<typeof PublicKey>;

export type OptionItemType = {
  iconType: IconType;
  icon: string;
  heading: string;
  subHeading?: string;
  handlePress: () => void;
};

const AboutScreen = () => {
  const navigation = useNavigation<AboutScreenProps['navigation']>();

  const items: OptionItemType[] = [
    {
      iconType: 'ionicons',
      icon: 'document-outline',
      heading: 'terms of service',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'document-outline',
      heading: 'privacy policy',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'globe-outline',
      heading: 'website',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'logo-twitter',
      heading: 'twitter',
      handlePress: () => {},
    },
    {
      iconType: 'mci',
      icon: 'discord',
      heading: 'discord',
      handlePress: () => {},
    },
  ];

  const navigateTo = (screen: keyof SecurityStackParamList) => {
    navigation.navigate(screen);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer fullWidth={true}>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="about solace"
        startClick={goBack}
      />
      <View style={globalStyles.fullWidth}>
        {items.map((item, index) => {
          return <OptionsItem key={item.heading} item={item} index={index} />;
        })}
      </View>
      <View style={globalStyles.fullCenter}>
        <View style={globalStyles.rowCenter}>
          <Image
            source={require('../../../../../assets/images/solace/solace-color-logo.png')}
            style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              marginRight: 10,
            }}
          />
          <SolaceText weight="bold" size="lg">
            Solace
          </SolaceText>
        </View>
        <SolaceText mt={12} color="normal" size="xs" type="secondary">
          app version 22.9.19
        </SolaceText>
      </View>
    </SolaceContainer>
  );
};

export default AboutScreen;
