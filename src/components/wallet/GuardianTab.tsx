/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import {PublicKeyType} from '../screens/wallet/Guardian';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {guardianStyles as styles} from './GuardianSecondTab';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';

export type Props = {
  guardians: {
    approved: PublicKeyType[];
    pending: PublicKeyType[];
  };
  loading: boolean;
};

const GuardianTab: React.FC<Props> = ({guardians, loading}) => {
  if (loading) {
    return (
      <View style={globalStyles.fullCenter}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const handleCopy = async (text: string) => {
    Clipboard.setString(text);
    showMessage({
      message: 'copied successfully',
    });
  };

  const renderGuardian = (
    guardian: PublicKeyType,
    index: number,
    type: 'approved' | 'pending',
  ) => {
    return (
      <View key={index}>
        <View style={styles.item}>
          <View style={styles.leftSide}>
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
                {type === 'approved' ? 'approved' : 'pending'}
              </SolaceText>
            </View>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity onPress={() => handleCopy(guardian.toString())}>
              <SolaceText
                type="secondary"
                weight="bold"
                size="sm"
                variant="link">
                copy
              </SolaceText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const pendingGuardians = [
    // SolaceSDK.newKeyPair().publicKey,
    ...guardians.pending,
  ];
  const approvedGuardians = [
    // SolaceSDK.newKeyPair().publicKey,
    ...guardians.approved,
  ];
  const allGuardians = [...approvedGuardians, ...pendingGuardians];

  if (allGuardians.length === 0) {
    return (
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../assets/images/solace/secrurity.png')}
          style={globalStyles.image}
        />
        <SolaceText type="secondary" size="sm" weight="bold" variant="normal">
          you need 1 guardian approval for solace vault recovery or to approve
          an untrusted transaction
        </SolaceText>
      </View>
    );
  }

  return (
    <ScrollView bounces={true}>
      <View style={{marginTop: 8}}>
        {/* <View style={styles.item}>
          <View style={styles.leftSide}>
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
        {pendingGuardians.map((guardian, index) => {
          return renderGuardian(guardian, index, 'pending');
        })}
        {approvedGuardians.map((guardian, index) => {
          return renderGuardian(guardian, index, 'approved');
        })}
      </View>
    </ScrollView>
  );
};

export default GuardianTab;
