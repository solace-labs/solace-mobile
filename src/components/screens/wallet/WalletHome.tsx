/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {
  clearData,
  setAccountStatus,
  setUser,
} from '../../../state/actions/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageClearAll, StorageGetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import SolaceText from '../../common/solaceui/SolaceText';
import WalletActivity from '../../wallet/WalletActivity';
import globalStyles from '../../../utils/global_styles';
import SolaceStatus from '../../common/solaceui/SolaceStatus';
import moment from 'moment';
import {WalletDataType} from './AddContact';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';

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
  const {state} = useContext(GlobalContext);
  const [username, setUsername] = useState('user');
  const [incubationDate, setIncubationDate] = useState(
    moment(new Date()).format('DD MMM HH:mm'),
  );

  const [loadingIncubation, setLoadingIncubation] = useState(true);
  const [showIncubation, setShowIncubation] = useState(false);

  const {
    state: {user, sdk},
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

  const getIncubationTime = async (createdAt: number) => {
    const date = moment(new Date(createdAt * 1000))
      .add(12, 'h')
      .format('DD MMM HH:mm');
    console.log(date);
    setIncubationDate(date);
  };

  const checkIncubationMode = async (data: WalletDataType) => {
    const date = moment(new Date(data.createdAt * 1000)).add(12, 'h');
    const current = moment(new Date());
    const difference = date.diff(current);
    if (difference > 0 && data.incubationMode) {
      return true;
    }
    return false;
  };

  const init = async () => {
    setLoadingIncubation(true);
    try {
      const data = await sdk!.fetchWalletData();
      console.log(sdk!.wallet);
      const isIncubationMode = await checkIncubationMode(data);
      setShowIncubation(isIncubationMode);
      await getIncubationTime(data.createdAt);
      setLoadingIncubation(false);
    } catch (e) {
      console.log('error fetching incubation', e);
      setLoadingIncubation(false);
    }
  };

  useEffect(() => {
    try {
      init();
    } catch (e) {
      console.log('error during incubation get', e);
    }
  }, []);

  const endIncubation = async () => {
    // Alert.alert();
  };

  const handleIncubationEnd = async () => {
    Alert.alert(
      'end incubation?',
      '',
      // 'you will have to retrieve your wallet using google drive.',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await endIncubation();
            // await StorageClearAll();
            // dispatch(clearData());
            // dispatch(setAccountStatus(AccountStatus.NEW));
          },
        },
      ],
    );
  };

  const logout = async () => {
    Alert.alert(
      'are you sure you want to logout?',
      'you will have to retrieve your vault using google drive.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const appState = await StorageGetItem('appstate');
            if (appState === AppState.TESTING) {
              dispatch(setAccountStatus(AccountStatus.NEW));
            } else {
              await StorageClearAll();
              dispatch(clearData());
              dispatch(setAccountStatus(AccountStatus.NEW));
            }
          },
        },
      ],
    );
  };

  const adrs = sdk!.wallet.toString();
  const shortaddress = adrs.slice(0, 5) + '...' + adrs.slice(-5);

  const copy = () => {
    Clipboard.setString(adrs);
    showMessage({
      message: 'wallet address copied!',
      type: 'info',
    });
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
        {loadingIncubation ? (
          <ActivityIndicator size="small" />
        ) : (
          <TouchableOpacity
            style={globalStyles.rowCenter}
            // onPress={handleIncubationEnd}
          >
            <SolaceStatus
              type={showIncubation ? 'success' : 'error'}
              style={{marginRight: 8}}
            />
            <SolaceText size="xs">
              incubation {showIncubation ? 'ends at' : 'ended on'}{' '}
            </SolaceText>
            <SolaceText size="xs" weight="bold">
              {incubationDate}
            </SolaceText>
          </TouchableOpacity>
        )}

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
        </SolaceText>
      </View>
      <TouchableOpacity onPress={copy}>
        <SolaceText type="secondary" weight="bold">
          {shortaddress}
        </SolaceText>
      </TouchableOpacity>
      <View style={[globalStyles.fullCenter, {flex: 0.7}]}>
        <SolaceText size="xl" weight="bold">
          $0.00
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
            onPress={() => {
              showMessage({
                message: 'coming soon...',
                type: 'info',
              });
            }}
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
