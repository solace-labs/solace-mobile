import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddGuardian from '../../components/screens/wallet/security/AddGuardian';
import Guardian from '../../components/screens/wallet/security/Guardian';
import SecurityScreen from '../../components/screens/wallet/security/SecurityScreen';
import AboutScreen from '../../components/screens/wallet/security/AboutScreen';
import ChooseGuardian from '../../components/screens/wallet/security/ChooseGuardian';
import SendScreen from '../../components/screens/wallet/home/Send';
import GuardianInfo from '../../components/screens/wallet/security/GuardianInfo';
import EditGuardian from '../../components/screens/wallet/security/EditGuardian';

export type SecurityStackParamList = {
  SecurityHome: undefined;
  Guardian: undefined;
  ChooseGuardian: undefined;
  AddGuardian: undefined;
  About: undefined;
  EditGuardian: undefined;
  GuardianInfo: undefined;
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
      <SecurityStack.Screen name="GuardianInfo" component={GuardianInfo} />
      <SecurityStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="EditGuardian"
        component={EditGuardian}
      />
    </SecurityStack.Navigator>
  );
};

export default SecurityScreenStack;
