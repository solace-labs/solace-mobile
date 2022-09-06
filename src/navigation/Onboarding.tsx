import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PasscodeScreen from '../components/screens/onboarding/Passcode';
import ConfirmPasscodeScreen from '../components/screens/onboarding/ConfirmPasscode';
import GoogleDriveScreen from '../components/screens/onboarding/GoogleDrive';
import Login from '../components/screens/onboarding/Login';
import CreateWalletScreen from '../components/screens/onboarding/CreateWallet';
import AirdropScreen from '../components/screens/onboarding/Airdrop';
import OnboardLoading from '../components/screens/onboarding/OnboardLoading';

const Stack = createNativeStackNavigator();
const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardLoading"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Passcode" component={PasscodeScreen} />
      <Stack.Screen name="ConfirmPasscode" component={ConfirmPasscodeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="GoogleDrive" component={GoogleDriveScreen} />
      <Stack.Screen name="Airdrop" component={AirdropScreen} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="OnboardLoading" component={OnboardLoading} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
