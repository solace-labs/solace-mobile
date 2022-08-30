import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GoogleDriveScreen from '../components/screens/retrieve/GoogleDrive';
import PasscodeScreen from '../components/screens/retrieve/Passcode';

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
