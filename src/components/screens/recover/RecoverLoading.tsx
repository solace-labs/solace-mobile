/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {AppState} from '../../../state/contexts/GlobalContext';
import {StorageGetItem} from '../../../utils/storage';
import Loading from '../loading/Loading';

export type Props = {
  navigation: any;
};

const RecoverLoading: React.FC<Props> = ({navigation}) => {
  const getTokens = async () => {
    try {
      const appState: AppState = await StorageGetItem('appstate');
      console.log('coming in recover loading', appState);
      if (appState === AppState.RECOVERY) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Recover'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (e: any) {
      console.log('RECOVER LOADING', e);
    }
  };

  useEffect(() => {
    getTokens();
  }, []);

  return <Loading />;
};
export default RecoverLoading;
