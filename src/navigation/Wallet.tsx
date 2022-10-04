import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalletHomeScreen from '../components/screens/wallet/WalletHome';
import Assets from '../components/screens/wallet/Assets';
import AddContactScreen from '../components/screens/wallet/AddContact';
import ContactScreen from '../components/screens/wallet/Contact';
import SendScreen from '../components/screens/wallet/Send';
import AddGuardian from '../components/screens/guardian/AddGuardian';
import Guardian from '../components/screens/guardian/Guardian';
import RecieveScreen from '../components/screens/wallet/Recieve';
import RecieveItem from '../components/screens/wallet/RecieveItem';
import AddToken from '../components/screens/wallet/AddToken';
import Incubation from '../components/screens/wallet/Incubation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {ArrowTrendingUpIcon} from 'react-native-heroicons/outline';
import {Colors} from '../utils/colors';
import ComingSoon from '../components/screens/loading/ComingSoon';
import FlashMessage from 'react-native-flash-message';
import SwapScreen from '../components/screens/wallet/SwapScreen';

export type WalletStackParamList = {
  Wallet: undefined;
  Assets: undefined;
  Recieve: undefined;
  RecieveItem: {token: string};
  AddContact: undefined;
  AddToken: undefined;
  Contact: {asset: string};
  Send: {asset: string; contact: string};
  Incubation: {show: 'yes' | 'no'};
};

export type GuardianStackParamList = {
  AddGuardian: undefined;
  Guardian: undefined;
};

export type TabParamList = {
  Home: undefined;
  Swap: undefined;
  GuardianTab: undefined;
  Activity: undefined;
};

export type SwapStackParamList = {
  SwapScreen: undefined;
};

const TabStack = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<WalletStackParamList>();
const GuardianStack = createNativeStackNavigator<GuardianStackParamList>();
const SwapStack = createNativeStackNavigator<SwapStackParamList>();

const WalletStack = () => {
  const renderTabIcon = (
    route: RouteProp<TabParamList, keyof TabParamList>,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = 'home';
    switch (route.name) {
      case 'Home':
        return focused ? (
          <FontAwesome5
            name="wallet"
            size={size - 2}
            color={Colors.text.lightgreen}
          />
        ) : (
          <FontAwesome5 name="wallet" size={size} color={color} />
        );
      case 'Swap':
        return (
          <MCI
            name="swap-horizontal"
            size={size + 8}
            color={focused ? Colors.text.lightorange : color}
          />
        );
      case 'GuardianTab':
        return (
          <MCI
            name="shield"
            size={size}
            color={focused ? Colors.text.lightblue : color}
          />
        );
      case 'Activity':
        return (
          <MCI
            name="lightning-bolt"
            size={size + 2}
            color={focused ? Colors.text.lightpink : color}
          />
        );
      default:
        return <AntDesign name={iconName} size={size} color={color} />;
    }
  };

  const HomeScreenStack = () => {
    return (
      <HomeStack.Navigator
        initialRouteName="Wallet"
        screenOptions={{
          headerShown: false,
        }}>
        <HomeStack.Screen name="Wallet" component={WalletHomeScreen} />
        <HomeStack.Screen name="Assets" component={Assets} />
        <HomeStack.Screen name="Recieve" component={RecieveScreen} />
        <HomeStack.Screen name="RecieveItem" component={RecieveItem} />
        <HomeStack.Screen name="AddContact" component={AddContactScreen} />
        <HomeStack.Screen name="AddToken" component={AddToken} />
        <HomeStack.Screen name="Contact" component={ContactScreen} />
        <HomeStack.Screen
          options={{
            presentation: 'modal',
          }}
          name="Send"
          component={SendScreen}
        />
        <HomeStack.Screen
          options={{
            presentation: 'modal',
          }}
          name="Incubation"
          component={Incubation}
        />
        {/* <FlashMessage /> */}
      </HomeStack.Navigator>
    );
  };

  const GuardianScreenStack = () => {
    return (
      <GuardianStack.Navigator
        initialRouteName="Guardian"
        screenOptions={{
          headerShown: false,
        }}>
        <GuardianStack.Screen name="AddGuardian" component={AddGuardian} />
        <GuardianStack.Screen name="Guardian" component={Guardian} />
      </GuardianStack.Navigator>
    );
  };

  const SwapScreenStack = () => {
    return (
      <SwapStack.Navigator
        initialRouteName="SwapScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <SwapStack.Screen name="SwapScreen" component={SwapScreen} />
        {/* <SwapStack.Screen name="Guardian" component={Guardian} /> */}
      </SwapStack.Navigator>
    );
  };

  return (
    <TabStack.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({focused, color, size}) =>
          renderTabIcon(route, focused, color, 20),
        tabBarActiveTintColor: Colors.background.lightest,
        tabBarInactiveTintColor: Colors.background.light,
        tabBarItemStyle: {
          borderRadius: 20,
        },
        tabBarStyle: {
          paddingHorizontal: 24,
          backgroundColor: Colors.background.darker,
          paddingTop: 12,
          paddingBottom: 24,
          height: 80,
          borderTopColor: Colors.background.transparent,
        },
      })}>
      <TabStack.Screen name="Home" component={HomeScreenStack} />
      <TabStack.Screen name="Swap" component={SwapScreen} />
      <TabStack.Screen name="GuardianTab" component={GuardianScreenStack} />
      <TabStack.Screen name="Activity" component={ComingSoon} />

      {/* <FlashMessage /> */}
    </TabStack.Navigator>
  );
};

export default WalletStack;
