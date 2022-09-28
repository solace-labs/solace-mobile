import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GoogleDriveScreen from '../components/screens/onboarding/GoogleDrive';
import Login from '../components/screens/onboarding/Login';
import CreateWalletScreen from '../components/screens/onboarding/CreateWallet';
import OnboardLoading from '../components/screens/onboarding/OnboardLoading';

export type OnboardingStackParamList = {
  OnboardLoading: undefined;
  Login: undefined;
  GoogleDrive: undefined;
  CreateWallet: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();
const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardLoading"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnboardLoading" component={OnboardLoading} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="GoogleDrive" component={GoogleDriveScreen} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
