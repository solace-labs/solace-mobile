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
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import {clearData, setAccountStatus} from '../../../../state/actions/global';
import {StorageClearAll, StorageGetItem} from '../../../../utils/storage';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceIcon from '../../../common/solaceui/SolaceIcon';
import SolaceText from '../../../common/solaceui/SolaceText';
import WalletActivity from '../../../wallet/WalletActivity';
import globalStyles from '../../../../utils/global_styles';
import SolaceStatus from '../../../common/solaceui/SolaceStatus';
import {useRefreshOnFocus} from '../../../../hooks/useRefreshOnFocus';
import {getIncubationData} from '../../../../apis/sdk';
import {Colors} from '../../../../utils/colors';
import SolacePaper from '../../../common/solaceui/SolacePaper';
import WalletHoldings from '../../../wallet/WalletHoldings';
import {minifyAddress} from '../../../../utils/helpers';
import {WalletStackParamList} from '../../../../navigation/Home/Home';

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
    isLoading && (await queryClient.invalidateQueries(['incubation']));
  };

  useRefreshOnFocus(refetch);

  const handleSend = () => {
    navigation.navigate('Assets');
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
  const shortaddress = minifyAddress(adrs, 5);

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
        {/* <SolaceIcon
          onPress={() => navigation.navigate('Guardian')}
          type="normal"
          variant="antdesign"
          name="lock"
        /> */}
        <Image
          source={require('../../../../../assets/images/solace/solana-icon.png')}
          style={globalStyles.avatar}
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
        <SolaceIcon
          size="sm"
          onPress={() => logout()}
          background="normal"
          color="awaiting"
          variant="fa"
          name="lock"
        />
      </View>
      <View style={[globalStyles.fullCenter, {flex: 0.4}]}>
        <Image
          source={require('../../../../../assets/images/solace/solace-icon.png')}
          style={{
            height: 35,
            resizeMode: 'contain',
            overflow: 'hidden',
            marginBottom: 12,
          }}
        />
        <SolaceText weight="bold" size="lg">
          {user?.solaceName ? user.solaceName : 'solaceuser'}
        </SolaceText>
        <TouchableOpacity onPress={copy} style={{marginTop: 12}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={[
                globalStyles.rowCenter,
                {
                  backgroundColor: Colors.background.normal,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 18,
                },
              ]}>
              <SolaceText type="primary" weight="semibold" size="sm">
                {shortaddress}
              </SolaceText>
              <MCI
                name="content-copy"
                color={Colors.text.white}
                size={18}
                style={{marginLeft: 12}}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[globalStyles.fullCenter, {flex: 0.2}]}>
        <SolaceText size="xl" weight="bold">
          $0.00
        </SolaceText>
      </View>
      <View style={[globalStyles.fullCenter, {flex: 0.4}]}>
        <SolacePaper>
          <View
            style={[
              globalStyles.rowCenter,
              {width: '80%', justifyContent: 'space-between'},
            ]}>
            <SolaceIcon
              onPress={handleSend}
              background="lightpink"
              name="ios-send-outline"
              variant="ionicons"
              subText="send"
            />
            <SolaceIcon
              onPress={() => {
                showMessage({
                  message: 'coming soon...',
                  type: 'info',
                });
              }}
              background="lightblue"
              name="dollar"
              variant="fa"
              subText="buy"
            />
            <SolaceIcon
              onPress={handleRecieve}
              background="lightgreen"
              name="arrowdown"
              variant="antdesign"
              subText="recieve"
            />
          </View>
        </SolacePaper>
      </View>
      <WalletHoldings />
      {/* <WalletActivity data={[]} /> */}
    </SolaceContainer>
  );
};

export default WalletHomeScreen;
