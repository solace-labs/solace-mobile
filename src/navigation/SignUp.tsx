import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../components/screens/signup/Home';
import EmailScreen from '../components/screens/signup/Email';

const Stack = createNativeStackNavigator();
const SignUpStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
      {/* <Stack.Screen name="Username" component={UsernameScreen} /> */}
    </Stack.Navigator>
  );
};

export default SignUpStack;
