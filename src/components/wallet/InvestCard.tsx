import {
  Image,
  ImageSourcePropType,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import SolaceText from '../common/solaceui/SolaceText';
import {Colors} from '../../utils/colors';

export type GuardianCardType = {
  data: {
    id: number;
    heading: string;
    subHeading: string;
    url: string;
    image: ImageSourcePropType;
  };
};

const InvestCard: FC<GuardianCardType> = ({data}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(data.url);
      }}>
      <View
        style={{
          marginVertical: 10,
          alignItems: 'flex-start',
          borderBottomWidth: 1,
          backgroundColor: Colors.background.dark,
          padding: 20,
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
          <Image
            source={data.image}
            style={{
              width: 50,
              height: 50,
              resizeMode: 'cover',
            }}
          />
        </View>
        <SolaceText mt={20} align="left" weight="medium">
          {data.heading}
        </SolaceText>
        <SolaceText
          mt={10}
          mb={data.heading === 'jet protocol' ? 20 : 0}
          align="left"
          color="normal"
          size="xs"
          type="secondary">
          {data.subHeading}
        </SolaceText>
      </View>
    </TouchableOpacity>
  );
};

export default InvestCard;
