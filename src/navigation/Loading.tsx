import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Loading from '../components/screens/loading/Loading';

export type LoadingStackParamList = {
  Loading: undefined;
};

const Stack = createNativeStackNavigator<LoadingStackParamList>();
const LoadingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Loading" component={Loading} />
    </Stack.Navigator>
  );
};

export default LoadingStack;
