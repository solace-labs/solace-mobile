import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../components/screens/signup/Home';
import EmailScreen from '../components/screens/signup/Email';
import UsernameScreen from '../components/screens/signup/Username';

const Stack = createNativeStackNavigator();
const SignUpStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Username" component={UsernameScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
    </Stack.Navigator>
  );
};

export default SignUpStack;
