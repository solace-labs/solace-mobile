import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalletHomeScreen from '../components/screens/wallet/WalletHome';
import SendScreen from '../components/screens/wallet/Send';
import AddContactScreen from '../components/screens/wallet/AddContact';
import ContactScreen from '../components/screens/wallet/Contact';
import AssetScreen from '../components/screens/wallet/Asset';
import AddGuardian from '../components/screens/wallet/AddGuardian';
import Guardian from '../components/screens/wallet/Guardian';
import RecieveScreen from '../components/screens/wallet/Recieve';

const Stack = createNativeStackNavigator();

const WalletStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Wallet"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Wallet" component={WalletHomeScreen} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="Recieve" component={RecieveScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Asset" component={AssetScreen} />
      <Stack.Screen name="AddGuardian" component={AddGuardian} />
      <Stack.Screen name="Guardian" component={Guardian} />
    </Stack.Navigator>
  );
};

export default WalletStack;
