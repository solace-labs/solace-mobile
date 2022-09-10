import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Loading from '../components/screens/update/UpdateLoading';
const Stack = createNativeStackNavigator();
const UpdateStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Loading" component={Loading} />
    </Stack.Navigator>
  );
};

export default UpdateStack;
