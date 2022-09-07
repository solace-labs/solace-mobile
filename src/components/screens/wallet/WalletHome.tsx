import {View, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {
  clearData,
  setAccountStatus,
  setUser,
} from '../../../state/actions/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageClearAll} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import SolaceText from '../../common/solaceui/SolaceText';
import WalletActivity from '../../wallet/WalletActivity';
import globalStyles from '../../../utils/global_styles';
import SolaceStatus from '../../common/solaceui/SolaceStatus';

export type Props = {
  navigation: any;
};

export const DATA = [
  {
    id: 1,
    date: new Date(),
    username: 'ashwin.solace.money',
  },
  {
    id: 2,
    date: new Date(),
    username: 'ankit.solace.money',
  },
];

const WalletHomeScreen: React.FC<Props> = ({navigation}) => {
  const [username, setUsername] = useState('user');

  const {
    state: {user},
    dispatch,
  } = useContext(GlobalContext);

  const handleSend = () => {
    navigation.navigate('Send');
  };

  const handleRecieve = () => {
    navigation.navigate('Recieve');
  };

  useEffect(() => {
    const getInitialData = async () => {
      const userdata = await AsyncStorage.getItem('user');
      if (userdata) {
        const _user = JSON.parse(userdata);
        dispatch(setUser(_user));
      }
    };
    getInitialData();
  }, [dispatch]);

  const getIncubationTime = () => {
    return new Date().toLocaleTimeString();
  };

  const logout = async () => {
    await StorageClearAll();
    dispatch(clearData());
    dispatch(setAccountStatus(AccountStatus.NEW));
  };

  return (
    <SolaceContainer>
      <View style={globalStyles.rowSpaceBetween}>
        <SolaceIcon
          onPress={() => navigation.navigate('Guardian')}
          type="normal"
          variant="antdesign"
          name="lock"
        />
        <View style={globalStyles.rowCenter}>
          <SolaceStatus type="warning" style={{marginRight: 8}} />
          <SolaceText size="xs">incubation ends: </SolaceText>
          <SolaceText size="xs" weight="bold">
            {/* {new Date().toLocaleTimeString()} */}
            {getIncubationTime()}
          </SolaceText>
        </View>
        <SolaceIcon
          onPress={() => logout()}
          type="normal"
          variant="antdesign"
          name="logout"
        />
      </View>
      <View style={[globalStyles.fullCenter, {flex: 0.3}]}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
          style={{
            height: 35,
            resizeMode: 'contain',
            overflow: 'hidden',
            marginBottom: 12,
          }}
        />
        <SolaceText weight="semibold" size="sm">
          {user?.solaceName ? user.solaceName : username}
          {/* .solace.money */}
        </SolaceText>
      </View>
      <View style={[globalStyles.fullCenter, {flex: 0.7}]}>
        <SolaceText size="xl" weight="bold">
          $0.04
        </SolaceText>
        <View
          style={[globalStyles.rowSpaceBetween, {marginTop: 20, width: '70%'}]}>
          <SolaceIcon
            onPress={handleSend}
            type="light"
            name="arrowup"
            variant="antdesign"
            subText="send"
          />
          <SolaceIcon
            onPress={() => {}}
            type="light"
            name="line-scan"
            variant="mci"
            subText="scan"
          />
          <SolaceIcon
            onPress={handleRecieve}
            type="light"
            name="arrowdown"
            variant="antdesign"
            subText="recieve"
          />
        </View>
      </View>
      <WalletActivity data={[]} />
    </SolaceContainer>
  );
};

export default WalletHomeScreen;
