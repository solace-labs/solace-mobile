import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';

import {Colors} from '../utils/colors';
import ComingSoon from '../components/screens/loading/ComingSoon';
import HomeScreenStack from './Home/Home';
import SwapScreenStack from './Home/Swap';
import GuardianScreenStack from './Home/Guardian';

export type TabParamList = {
  Home: undefined;
  Swap: undefined;
  GuardianTab: undefined;
  Activity: undefined;
};

const TabStack = createBottomTabNavigator<TabParamList>();

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
      <TabStack.Screen name="Swap" component={SwapScreenStack} />
      <TabStack.Screen name="GuardianTab" component={GuardianScreenStack} />
      <TabStack.Screen name="Activity" component={ComingSoon} />
    </TabStack.Navigator>
  );
};

export default WalletStack;
