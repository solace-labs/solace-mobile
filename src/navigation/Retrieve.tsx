import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GoogleDriveScreen from '../components/screens/retrieve/GoogleDrive/GoogleDrive';
import PasscodeScreen from '../components/screens/retrieve/Passcode/Passcode';
import GuardianRecovery from '../components/screens/retrieve/GuardianRecovery/GuardianRecovery';
import RecoverScreen from '../components/screens/retrieve/Recover/Recover';
import Login from '../components/screens/retrieve/Login/Login';

const Stack = createNativeStackNavigator();

const RetrieveStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="GoogleDrive"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="GoogleDrive" component={GoogleDriveScreen} />
      <Stack.Screen name="Passcode" component={PasscodeScreen} />
    </Stack.Navigator>
  );
};

export default RetrieveStack;
