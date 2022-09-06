/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {AppState} from '../../../state/contexts/GlobalContext';
import {StorageGetItem} from '../../../utils/storage';
import Loading from '../loading/Loading';

export type Props = {
  navigation: any;
};

const OnboardLoading: React.FC<Props> = ({navigation}) => {
  const getTokens = async () => {
    const appState: AppState = await StorageGetItem('appstate');
    const tokens = await StorageGetItem('tokens');
    if (appState === AppState.GDRIVE) {
      if (tokens) {
        navigation.reset({
          index: 0,
          routes: [{name: 'CreateWallet'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Passcode'}],
      });
    }
  };

  useEffect(() => {
    getTokens();
  }, []);

  return <Loading />;
};
export default OnboardLoading;
