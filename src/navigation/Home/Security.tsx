import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddGuardian from '../../components/screens/wallet/security/AddGuardian';
import Guardian from '../../components/screens/wallet/security/Guardian';
import SecurityScreen from '../../components/screens/wallet/security/SecurityScreen';
import AboutScreen from '../../components/screens/wallet/security/AboutScreen';
import ChooseGuardian from '../../components/screens/wallet/security/ChooseGuardian';

export type SecurityStackParamList = {
  SecurityHome: undefined;
  Guardian: undefined;
  ChooseGuardian: undefined;
  AddGuardian: undefined;
  About: undefined;
};

const SecurityStack = createNativeStackNavigator<SecurityStackParamList>();

const SecurityScreenStack = () => {
  return (
    <SecurityStack.Navigator
      initialRouteName="SecurityHome"
      screenOptions={{
        headerShown: false,
      }}>
      <SecurityStack.Screen name="SecurityHome" component={SecurityScreen} />
      <SecurityStack.Screen name="Guardian" component={Guardian} />
      <SecurityStack.Screen name="ChooseGuardian" component={ChooseGuardian} />
      <SecurityStack.Screen name="AddGuardian" component={AddGuardian} />
      <SecurityStack.Screen name="About" component={AboutScreen} />
    </SecurityStack.Navigator>
  );
};

export default SecurityScreenStack;
