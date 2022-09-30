import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalletHomeScreen from '../components/screens/wallet/WalletHome';
import SendScreen from '../components/screens/wallet/SendScreen';
import AddContactScreen from '../components/screens/wallet/AddContact';
import ContactScreen from '../components/screens/wallet/Contact';
import AssetScreen from '../components/screens/wallet/Asset';
import AddGuardian from '../components/screens/wallet/AddGuardian';
import Guardian from '../components/screens/wallet/Guardian';
import RecieveScreen from '../components/screens/wallet/Recieve';
import RecieveItem from '../components/screens/wallet/RecieveItem';
import AddToken from '../components/screens/wallet/AddToken';
import Incubation from '../components/screens/wallet/Incubation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {
  ArrowTrendingUpIcon,
  HomeIcon,
  SparklesIcon as SparklesIconOutline,
} from 'react-native-heroicons/outline';
import {HomeIcon as HomeIconFilled} from 'react-native-heroicons/solid';
import {Colors} from '../utils/colors';

export type WalletStackParamList = {
  Wallet: undefined;
  Send: undefined;
  Recieve: undefined;
  RecieveItem: {token: string};
  AddContact: undefined;
  AddToken: undefined;
  Contact: {asset: string};
  Asset: {asset: string; contact: string};
  AddGuardian: undefined;
  Guardian: undefined;
  Incubation: {show: 'yes' | 'no'};
};

export type TabParamList = {
  Home: undefined;
  Swap: undefined;
  Charity: undefined;
  Charts: undefined;
};

const TabStack = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator<WalletStackParamList>();

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
          <HomeIconFilled size={size} color={color} />
        ) : (
          <HomeIcon size={size} color={color} />
        );
      case 'Swap':
        return <MCI name="swap-horizontal" size={size} color={color} />;
      case 'Charity':
        return <MCI name="charity" size={size} color={color} />;
      case 'Charts':
        return <ArrowTrendingUpIcon size={size} color={color} />;
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
        <HomeStack.Screen name="Send" component={SendScreen} />
        <HomeStack.Screen name="Recieve" component={RecieveScreen} />
        <HomeStack.Screen name="RecieveItem" component={RecieveItem} />
        <HomeStack.Screen name="AddContact" component={AddContactScreen} />
        <HomeStack.Screen name="AddToken" component={AddToken} />
        <HomeStack.Screen name="Contact" component={ContactScreen} />
        <HomeStack.Screen name="Asset" component={AssetScreen} />
        <HomeStack.Screen name="AddGuardian" component={AddGuardian} />
        <HomeStack.Screen name="Guardian" component={Guardian} />
        <HomeStack.Screen
          options={{
            presentation: 'modal',
          }}
          name="Incubation"
          component={Incubation}
        />
      </HomeStack.Navigator>
    );
  };

  return (
    <TabStack.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({focused, color, size}) =>
          renderTabIcon(route, focused, color, size),
        tabBarActiveTintColor: Colors.background.lightest,
        tabBarInactiveTintColor: Colors.background.light,
        tabBarActiveBackgroundColor: Colors.background.darkest,
        tabBarItemStyle: {
          borderRadius: 20,
        },
        tabBarStyle: {
          paddingHorizontal: 24,
          backgroundColor: '#1a1a1a',
          paddingTop: 12,
          paddingBottom: 24,
          height: 80,
          borderTopColor: Colors.background.transparent,
        },
      })}>
      <TabStack.Screen name="Home" component={HomeScreenStack} />
      <TabStack.Screen name="Swap" component={HomeScreenStack} />
      <TabStack.Screen name="Charity" component={HomeScreenStack} />
      <TabStack.Screen name="Charts" component={HomeScreenStack} />
    </TabStack.Navigator>
  );
};

export default WalletStack;
