import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {WebView as WV} from 'react-native-webview';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar';

type WebViewScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'WebView'
>;

function WebView() {
  const navigation = useNavigation<WebViewScreenProps['navigation']>();
  const route = useRoute<WebViewScreenProps['route']>();
  const url = route.params.uri;
  const title = route.params.title;

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text={title}
        startClick={() => navigation.goBack()}
      />
      <WV
        startInLoadingState
        style={{backgroundColor: '#1e1e1e'}}
        source={{uri: url}}
      />
    </SolaceContainer>
  );
}

export default WebView;
