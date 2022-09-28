import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../components/screens/signup/Home';
import EmailScreen from '../components/screens/signup/Email';

export type SignUpStackParamList = {
  Home: undefined;
  Email: undefined;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();
const SignUpStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
    </Stack.Navigator>
  );
};

export default SignUpStack;
