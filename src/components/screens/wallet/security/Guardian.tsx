/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import GuardianTab from '../../../wallet/GuardianTab';
import GuardianSecondTab from '../../../wallet/GuardianSecondTab';
import {PublicKey} from 'solace-sdk';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../../hooks/useRefreshOnFocus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {getGuardians} from '../../../../apis/sdk';
import TopNavbar from '../../../common/TopNavbar';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';

type GuardianScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'Guardian'
>;

export type PublicKeyType = InstanceType<typeof PublicKey>;

const Guardian = () => {
  const [activeTab, setActiveTab] = useState(1);
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<GuardianScreenProps['navigation']>();
  const queryClient = useQueryClient();

  const {data, isLoading, isFetching} = useQuery(
    ['guardians'],
    () => getGuardians(state.sdk!),
    {
      enabled: !!state.sdk!,
    },
  );

  useRefreshOnFocus(async () => {
    !isLoading && (await queryClient.invalidateQueries(['guardians']));
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
    <SolaceContainer fullWidth={true}>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        endIcon="infocirlceo"
        text="manage guardians"
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
            color="white"
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
            color="white"
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
      <SolaceContainer>
        <View style={{flex: 1}}>{renderTab()}</View>
        <SolaceButton
          onPress={() => navigation.navigate('ChooseGuardian')}
          background="purple">
          <SolaceText type="secondary" color="white" weight="bold">
            add guardian
          </SolaceText>
        </SolaceButton>
      </SolaceContainer>
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
