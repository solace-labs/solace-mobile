import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddGuardian from '../../components/screens/wallet/guardian/AddGuardian';
import Guardian from '../../components/screens/wallet/guardian/Guardian';

export type GuardianStackParamList = {
  AddGuardian: undefined;
  Guardian: undefined;
};

const GuardianStack = createNativeStackNavigator<GuardianStackParamList>();

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

export default GuardianScreenStack;
