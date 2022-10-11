import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddGuardian from '../../components/screens/wallet/security/AddGuardian';
import Guardian from '../../components/screens/wallet/security/Guardian';
import SecurityScreen from '../../components/screens/wallet/security/SecurityScreen';
import AboutScreen from '../../components/screens/wallet/security/AboutScreen';
import RecentActivityScreen from '../../components/screens/wallet/activity/RecentActivityScreen';

export type ActivityStackParamList = {
  RecentActivity: undefined;
};

const ActivityStack = createNativeStackNavigator<ActivityStackParamList>();

const ActivityScreenStack = () => {
  return (
    <ActivityStack.Navigator
      initialRouteName="RecentActivity"
      screenOptions={{
        headerShown: false,
      }}>
      <ActivityStack.Screen
        name="RecentActivity"
        component={RecentActivityScreen}
      />
    </ActivityStack.Navigator>
  );
};

export default ActivityScreenStack;
