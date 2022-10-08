import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SwapScreen from '../../components/screens/wallet/swap/SwapScreen';
import SwapPreviewScreen from '../../components/screens/wallet/swap/SwapPreviewScreen';
import TokenListScreen from '../../components/screens/wallet/swap/TokenList';

export type SwapStackParamList = {
  SwapScreen: undefined;
  SwapPreviewScreen: undefined;
  TokenListScreen: undefined;
};

const SwapStack = createNativeStackNavigator<SwapStackParamList>();
const SwapScreenStack = () => {
  return (
    <SwapStack.Navigator
      initialRouteName="SwapScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <SwapStack.Screen name="SwapScreen" component={SwapScreen} />
      <SwapStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="SwapPreviewScreen"
        component={SwapPreviewScreen}
      />
      <SwapStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="TokenListScreen"
        component={TokenListScreen}
      />
    </SwapStack.Navigator>
  );
};

export default SwapScreenStack;
