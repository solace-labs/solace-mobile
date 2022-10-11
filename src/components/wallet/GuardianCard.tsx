import {TouchableWithoutFeedback, View} from 'react-native';
import React, {FC, ReactElement} from 'react';
import SolaceText from '../common/solaceui/SolaceText';
import {Colors} from '../../utils/colors';

export type GuardianCardType = {
  data: {
    id: number;
    icon: ReactElement;
    backgroundIcon: ReactElement;
    heading: string;
    subHeading: string;
  };
  active: boolean;
  onPress: () => void;
};

const GuardianCard: FC<GuardianCardType> = ({data, active, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          marginVertical: 10,
          alignItems: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: active
            ? data.id === 0
              ? Colors.background.lightorange
              : Colors.background.lightblue
            : 'transparent',
          backgroundColor: Colors.background.dark,
          padding: 20,
          position: 'relative',
        }}>
        <View
          style={{
            backgroundColor: Colors.background.darkest,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
          }}>
          {data.icon}
        </View>
        <SolaceText mt={20} align="left" weight="medium">
          {data.heading}
        </SolaceText>
        <SolaceText
          mt={10}
          align="left"
          color="normal"
          size="xs"
          type="secondary">
          {data.subHeading}
        </SolaceText>
        <View style={{position: 'absolute', right: 0}}>
          {data.backgroundIcon}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GuardianCard;
