/* eslint-disable react-hooks/exhaustive-deps */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AppState, GlobalContext} from '../../../state/contexts/GlobalContext';
import GuardianTab from '../../wallet/GuardianTab';
import GuardianSecondTab from '../../wallet/GuardianSecondTab';
import {PublicKey} from 'solace-sdk';
import {showMessage} from 'react-native-flash-message';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import TopNavbar from '../../common/TopNavbar';
import {StorageDeleteItem, StorageGetItem} from '../../../utils/storage';

export type Props = {
  navigation: any;
};

export type PublicKeyType = InstanceType<typeof PublicKey>;

const Guardian: React.FC<Props> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState(1);
  const {state, dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [guardians, setGuardians] = useState<{
    approved: PublicKeyType[];
    pending: PublicKeyType[];
  }>({approved: [], pending: []});
  const [guarding, setGuarding] = useState<PublicKeyType[]>([]);

  const getGuardians = async () => {
    setLoading(true);
    const appstate = await StorageGetItem('appstate');
    try {
      const sdk = state.sdk!;
      if (!sdk) {
        showMessage({
          message: 'wallet not setup properly. logout',
          type: 'danger',
        });
      }
      const {
        pendingGuardians,
        approvedGuardians,
        guarding: whoIProtect,
      } = await sdk.fetchWalletData();
      setGuardians({
        approved: approvedGuardians,
        pending: pendingGuardians,
      });
      setGuarding(whoIProtect);
      setLoading(false);
    } catch (e) {
      if (!(appstate === AppState.TESTING)) {
        showMessage({
          message: 'some error fetching guardians',
          type: 'danger',
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', async () => {
      await getGuardians();
    });
    return willFocusSubscription;
  }, [navigation]);

  const renderTab = () => {
    switch (activeTab) {
      case 1:
        return <GuardianTab guardians={guardians} loading={loading} />;
      case 2:
        return <GuardianSecondTab guarding={guarding} />;
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
        startIcon="back"
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
