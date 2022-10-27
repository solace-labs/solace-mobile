/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import {PublicKeyType} from '../screens/wallet/security/Guardian';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {guardianStyles as styles} from './GuardianSecondTab';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {firstCharacter, minifyAddress} from '../../utils/helpers';

import Fontisto from 'react-native-vector-icons/Fontisto';
import {SecurityStackParamList} from '../../navigation/Home/Security';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {GuardianTimeData} from 'solace-sdk/dist/cjs/sdk/types';
import moment from 'moment';

export type Props = {
  guardians: {
    approved: PublicKeyType[];
    pending: GuardianTimeData[];
  };
  loading: boolean;
};

type GuardianScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'Guardian'
>;

const GuardianTab: React.FC<Props> = ({guardians, loading}) => {
  const navigation = useNavigation<GuardianScreenProps['navigation']>();
  if (loading) {
    return (
      <View style={globalStyles.fullCenter}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  const handleCopy = async (text: string) => {
    // Clipboard.setString(text);
    // showMessage({
    //   message: 'copied successfully',
    // });
    navigation.navigate('EditGuardian');
  };

  const renderPendingGuardian = (guardian: GuardianTimeData, index: number) => {
    return (
      <View key={index}>
        <View style={styles.item}>
          <View style={styles.leftSide}>
            <View style={globalStyles.avatar}>
              <SolaceText weight="bold" size="sm" color="awaiting">
                {firstCharacter(guardian.guardian)}
              </SolaceText>
            </View>
            <View>
              <SolaceText align="left" type="secondary" weight="bold" size="sm">
                {minifyAddress(guardian.guardian, 5)}
              </SolaceText>
              <SolaceText
                type="secondary"
                size="sm"
                weight="bold"
                align="left"
                color={'normal'}>
                approve on{' '}
                {moment(new Date(guardian.time * 1000)).format('DD MMM HH:mm')}
              </SolaceText>
            </View>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity onPress={() => handleCopy(guardian.toString())}>
              {/* <SolaceText type="secondary" weight="bold" size="sm" color="link">
                copy
              </SolaceText> */}
              <Fontisto name="arrow-right-l" color="gray" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderApprovedGuardian = (guardian: PublicKeyType, index: number) => {
    return (
      <View key={index}>
        <View style={styles.item}>
          <View style={styles.leftSide}>
            <View style={globalStyles.avatar}>
              <SolaceText weight="bold" size="sm" color="awaiting">
                {firstCharacter(guardian)}
              </SolaceText>
            </View>
            <View>
              <SolaceText align="left" type="secondary" weight="bold" size="sm">
                {minifyAddress(guardian, 5)}
              </SolaceText>
              <SolaceText
                type="secondary"
                size="sm"
                weight="bold"
                align="left"
                color={'approved'}>
                {/* {type === 'approved' ? 'approved' : 'pending'} */}
                approved
              </SolaceText>
            </View>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity onPress={() => handleCopy(guardian.toString())}>
              {/* <SolaceText type="secondary" weight="bold" size="sm" color="link">
                copy
              </SolaceText> */}
              <Fontisto name="arrow-right-l" color="gray" size={20} />
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
        <SolaceText type="secondary" size="sm" weight="bold" color="normal">
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
          return renderPendingGuardian(guardian, index);
        })}
        {approvedGuardians.map((guardian, index) => {
          return renderApprovedGuardian(guardian, index);
        })}
      </View>
    </ScrollView>
  );
};

export default GuardianTab;
