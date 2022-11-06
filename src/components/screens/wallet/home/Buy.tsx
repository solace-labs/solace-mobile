import React, {useContext} from 'react';
import {SolaceSDK} from 'solace-sdk';

import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import {WebView} from 'react-native-webview';
import {GlobalContext} from '../../../../state/contexts/GlobalContext';

type WalletScreenProps = NativeStackScreenProps<WalletStackParamList, 'Buy'>;

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const Buy = () => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const {state} = useContext(GlobalContext);

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
      <WebView
        source={{
          uri: `https://buy.ramp.network/?userAddress=${state.sdk?.wallet}&swapAsset=SOLANA_SOL,SOLANA_USDC,SOLANA_USDT&hostLogoUrl=https://security.solace.money/solace.png&hostAppName=solace&fiatCurrency=GBP&selectedCountryCode=IND`,
        }}
      />
    </SolaceContainer>
  );
};

export default Buy;
