/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext} from 'react';
import Clipboard from '@react-native-community/clipboard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';

import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {clearData, setAccountStatus} from '../../../state/actions/global';
import {StorageClearAll, StorageGetItem} from '../../../utils/storage';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import SolaceText from '../../common/solaceui/SolaceText';
import WalletActivity from '../../wallet/WalletActivity';
import globalStyles from '../../../utils/global_styles';
import SolaceStatus from '../../common/solaceui/SolaceStatus';
import {useRefreshOnFocus} from '../../../hooks/useRefreshOnFocus';
import {getIncubationData} from '../../../apis/sdk';
import {WalletStackParamList} from '../../../navigation/Wallet';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Wallet'>;

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

const WalletHomeScreen = () => {
  const {
    state: {user, sdk},
    dispatch,
  } = useContext(GlobalContext);

  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const queryClient = useQueryClient();

  const {data, isLoading, isFetching} = useQuery(
    ['incubation'],
    () => getIncubationData(sdk!),
    {
      enabled: sdk! !== undefined,
    },
  );

  const refetch = async () => {
    isLoading &&
      isFetching &&
      (await queryClient.invalidateQueries(['incubation']));
  };

  useRefreshOnFocus(refetch);

  const handleSend = () => {
    navigation.navigate('Send');
  };

  const handleRecieve = () => {
    navigation.navigate('Recieve');
  };

  const endIncubation = async (show: boolean) => {
    navigation.navigate('Incubation', {show: show ? 'yes' : 'no'});
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
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <TouchableOpacity
            style={globalStyles.rowCenter}
            onPress={() => {
              endIncubation(data?.inIncubation ?? false);
            }}>
            <SolaceStatus
              type={data?.inIncubation ? 'success' : 'error'}
              style={{marginRight: 8}}
            />
            <SolaceText size="xs">
              incubation {data?.inIncubation ? 'ends at' : 'ended'}{' '}
            </SolaceText>
            {data?.inIncubation && (
              <SolaceText size="xs" weight="bold">
                {data?.endTime}
              </SolaceText>
            )}
          </TouchableOpacity>
        )}
        {/* {isFetching && (
          <ActivityIndicator size="small" color={Colors.text.approved} />
        )} */}

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
          {user?.solaceName ? user.solaceName : 'solaceuser'}
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
