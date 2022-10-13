/* eslint-disable react-hooks/exhaustive-deps */
import {Image, InteractionManager, View} from 'react-native';
import React, {Fragment} from 'react';

import {PublicKey} from 'solace-sdk';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import TopNavbar from '../../../common/TopNavbar';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';
import globalStyles from '../../../../utils/global_styles';
import {OptionsItem} from './SecurityScreen';
import SolaceText from '../../../common/solaceui/SolaceText';

type GuardianInfoScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'GuardianInfo'
>;

export type PublicKeyType = InstanceType<typeof PublicKey>;

const GuardianInfo = () => {
  const navigation = useNavigation<GuardianInfoScreenProps['navigation']>();

  const goBack = () => {
    navigation.goBack();
  };

  const data = [
    {
      heading: 'what are guardians?',
      subHeading:
        'you need 1 guardian approval for solace wallet recovery or to approve an untrusted transaction',
    },
    {
      heading: 'what are social guardians?',
      subHeading:
        'you need 1 guardian approval for solace wallet recovery or to approve an untrusted transaction you need 1 guardian approval for solace wallet recovery or to approve an untrusted transaction',
    },
  ];

  return (
    <SolaceContainer fullWidth={true}>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="types of guardian"
        startClick={goBack}
      />
      <SolaceContainer>
        {data.map(item => {
          return (
            <Fragment key={item.heading}>
              <SolaceText align="left" mt={20} color="white">
                {item.heading}
              </SolaceText>
              <SolaceText align="left" mt={8} color="normal" type="secondary">
                {item.subHeading}
              </SolaceText>
            </Fragment>
          );
        })}
      </SolaceContainer>
    </SolaceContainer>
  );
};

export default GuardianInfo;
