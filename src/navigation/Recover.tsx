import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GuardianRecovery from '../components/screens/recover/GuardianRecovery/GuardianRecovery';
import RecoverScreen from '../components/screens/recover/Recover/Recover';
import Login from '../components/screens/recover/Login/Login';

const Stack = createNativeStackNavigator();

const RecoverStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Recover"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="GuardianRecovery" component={GuardianRecovery} />
      <Stack.Screen name="Recover" component={RecoverScreen} />
    </Stack.Navigator>
  );
};

export default RecoverStack;
