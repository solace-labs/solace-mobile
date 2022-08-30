import {View, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import {
  clearData,
  setAccountStatus,
  setUser,
} from '../../../../state/actions/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageClearAll} from '../../../../utils/storage';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceIcon from '../../../common/SolaceUI/SolaceIcon/SolaceIcon';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import WalletActivity from '../../../wallet/WalletActivity/WalletActivity';

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

  const logout = async () => {
    await StorageClearAll();
    dispatch(clearData());
    dispatch(setAccountStatus(AccountStatus.NEW));
  };

  return (
    <SolaceContainer>
      <View style={styles.header}>
        <SolaceIcon
          onPress={() => navigation.navigate('Guardian')}
          type="normal"
          variant="antdesign"
          name="lock"
        />
        <SolaceIcon
          onPress={() => logout()}
          type="normal"
          variant="antdesign"
          name="logout"
        />
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../../assets/images/solace/solace-icon.png')}
          style={styles.image}
        />
        {/* <Text style={styles.username}>
          {user?.solaceName ? user.solaceName : username}.solace.money
        </Text> */}
        <SolaceText weight="semibold" size="md">
          {user?.solaceName ? user.solaceName : username}.solace.money
        </SolaceText>
      </View>
      <View style={styles.mainContainer}>
        <SolaceText size="xl" weight="bold">
          $0.04
        </SolaceText>
        <View style={styles.buttonsContainer}>
          <SolaceIcon
            onPress={() => handleSend()}
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
            onPress={() => {}}
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

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    width: '70%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 35,
    resizeMode: 'contain',
    overflow: 'hidden',
    marginBottom: 12,
  },
});
