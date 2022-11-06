import React from 'react';
import {SolaceSDK} from 'solace-sdk';

import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import {WebView} from 'react-native-webview';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Buy'>;

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const Buy = () => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="buy"
        startClick={handleGoBack}
      />
      <WebView source={{uri: 'https://ramp.network/buy'}} />
    </SolaceContainer>
  );
};

export default Buy;
