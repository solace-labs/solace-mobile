import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GuardianRecovery from '../components/screens/recover/GuardianRecovery';
import RecoverScreen from '../components/screens/recover/Recover';
import Login from '../components/screens/recover/Login';
import RecoverLoading from '../components/screens/recover/RecoverLoading';

const Stack = createNativeStackNavigator();

const RecoverStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="RecoverLoading"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="GuardianRecovery" component={GuardianRecovery} />
      <Stack.Screen name="Recover" component={RecoverScreen} />
      <Stack.Screen name="RecoverLoading" component={RecoverLoading} />
    </Stack.Navigator>
  );
};

export default RecoverStack;
