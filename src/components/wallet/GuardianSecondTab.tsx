import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import {PublicKeyType} from '../screens/wallet/Guardian';
import {SolaceSDK} from 'solace-sdk';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';

export type Props = {
  guarding: PublicKeyType[];
};

const GuardianSecondTab: React.FC<Props> = ({guarding}) => {
  const allGuarding = [
    // SolaceSDK.newKeyPair().publicKey,
    ...guarding,
  ];

  if (allGuarding.length === 0) {
    return (
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../assets/images/solace/secrurity.png')}
          style={globalStyles.image}
        />
      </View>
    );
  }

  const renderGuardian = (
    guardian: PublicKeyType,
    index: number,
    type: 'awaiting' | 'approved',
  ) => {
    return (
      <View key={index}>
        <View style={guardianStyles.item}>
          <View style={guardianStyles.leftSide}>
            <View style={globalStyles.avatar}>
              <SolaceText weight="bold" size="sm">
                {guardian
                  .toString()
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .toLowerCase()}
              </SolaceText>
            </View>
            <View>
              <SolaceText align="left" type="secondary" weight="bold" size="sm">
                {guardian.toString().slice(0, 10)}...
              </SolaceText>
              <SolaceText
                type="secondary"
                size="sm"
                weight="bold"
                align="left"
                variant={type}>
                {type === 'approved' ? 'approved' : 'awaiting response'}
              </SolaceText>
            </View>
          </View>
          <View style={guardianStyles.rightSide}>
            <TouchableOpacity>
              <SolaceText
                type="secondary"
                weight="bold"
                size="sm"
                variant="link">
                confirm
              </SolaceText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView bounces={true}>
      <View style={{marginTop: 8}}>
        {/* <View style={guardianStyles.item}>
          <View style={guardianStyles.leftSide}>
            <View style={globalStyles.avatar}>
              <SolaceText weight="bold" size="sm">
                S
              </SolaceText>
            </View>
            <View>
              <SolaceText align="left" type="secondary" weight="bold" size="sm">
                solace security
              </SolaceText>
              <SolaceText
                type="secondary"
                size="sm"
                weight="bold"
                align="left"
                variant="normal">
                coming soon...
              </SolaceText>
            </View>
          </View>
        </View> */}
        {allGuarding.map((guardian, index) => {
          return renderGuardian(guardian, index, 'awaiting');
        })}
      </View>
    </ScrollView>
  );
};

export default GuardianSecondTab;

export const guardianStyles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
