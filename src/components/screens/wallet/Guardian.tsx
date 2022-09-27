/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AppState, GlobalContext} from '../../../state/contexts/GlobalContext';
import GuardianTab from '../../wallet/GuardianTab';
import GuardianSecondTab from '../../wallet/GuardianSecondTab';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {showMessage} from 'react-native-flash-message';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import TopNavbar from '../../common/TopNavbar';
import {StorageGetItem} from '../../../utils/storage';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../hooks/useRefreshOnFocus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WalletStackParamList} from '../../../navigation/Wallet';
import {useNavigation} from '@react-navigation/native';
import {getGuardians} from '../../../apis/sdk';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'Guardian'
>;

export type PublicKeyType = InstanceType<typeof PublicKey>;

const Guardian = () => {
  const [activeTab, setActiveTab] = useState(1);
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const queryClient = useQueryClient();

  const {data, isLoading, isFetching} = useQuery(
    ['guardians'],
    () => getGuardians(state.sdk!),
    {
      enabled: !!state.sdk!,
    },
  );

  useRefreshOnFocus(async () => {
    isLoading &&
      isFetching &&
      (await queryClient.invalidateQueries(['guardians']));
  });

  const renderTab = () => {
    switch (activeTab) {
      case 1:
        return (
          <GuardianTab
            guardians={{
              approved: data?.approved ?? [],
              pending: data?.pending ?? [],
            }}
            loading={isLoading}
          />
        );
      case 2:
        return <GuardianSecondTab guarding={data?.guarding ?? []} />;
      default:
        return <Text style={{color: 'white'}}>404 not found</Text>;
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        endIcon="infocirlceo"
        text="guardians"
        startClick={handleGoBack}
        endClick={() => {}}
      />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            {borderBottomColor: activeTab === 1 ? 'white' : 'transparent'},
          ]}
          onPress={() => setActiveTab(1)}>
          <SolaceText
            variant="white"
            weight="bold"
            type="secondary"
            style={{
              color: activeTab === 1 ? 'white' : '#9999a5',
              fontSize: 14,
            }}>
            my guardians
          </SolaceText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {borderBottomColor: activeTab === 2 ? 'white' : 'transparent'},
          ]}
          onPress={() => setActiveTab(2)}>
          <SolaceText
            variant="white"
            weight="bold"
            type="secondary"
            style={{
              color: activeTab === 2 ? 'white' : '#9999a5',
              fontSize: 14,
            }}>
            who i protect
          </SolaceText>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>{renderTab()}</View>
      <SolaceButton onPress={() => navigation.navigate('AddGuardian')}>
        <SolaceText type="secondary" variant="black" weight="bold">
          add guardian
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default Guardian;

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tab: {
    borderBottomWidth: 2,
    paddingVertical: 8,
    width: '50%',
    justifyContent: 'center',
  },
});
