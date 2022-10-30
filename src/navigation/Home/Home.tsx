import React, {Dispatch, SetStateAction} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WalletHomeScreen from '../../components/screens/wallet/home/WalletHome';
import Assets from '../../components/screens/wallet/home/Assets';
import RecieveScreen from '../../components/screens/wallet/home/Recieve';
import RecieveItem from '../../components/screens/wallet/home/RecieveItem';
import AddContactScreen from '../../components/screens/wallet/home/AddContact';
import AddToken from '../../components/screens/wallet/home/AddToken';
import ContactScreen from '../../components/screens/wallet/home/Contact';
import SendScreen from '../../components/screens/wallet/home/Send';
import Incubation from '../../components/screens/wallet/home/Incubation';
import EditRecieverScreen from '../../components/screens/wallet/home/EditReciever';

export type WalletStackParamList = {
  Wallet: undefined;
  Assets: undefined;
  Recieve: undefined;
  RecieveItem: {token: string};
  AddContact: undefined;
  AddToken: undefined;
  Contact: {asset: string};
  Send: {asset: string};
  Incubation: {show: 'yes' | 'no'};
  EditReciever: undefined;
};

const HomeStack = createNativeStackNavigator<WalletStackParamList>();
const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Wallet"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Wallet" component={WalletHomeScreen} />
      <HomeStack.Screen name="Assets" component={Assets} />
      <HomeStack.Screen name="Recieve" component={RecieveScreen} />
      <HomeStack.Screen name="RecieveItem" component={RecieveItem} />
      <HomeStack.Screen name="AddContact" component={AddContactScreen} />
      <HomeStack.Screen name="AddToken" component={AddToken} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="Send"
        component={SendScreen}
      />
      <HomeStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="EditReciever"
        component={EditRecieverScreen}
      />
      <HomeStack.Screen
        options={{
          presentation: 'modal',
        }}
        name="Incubation"
        component={Incubation}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreenStack;
