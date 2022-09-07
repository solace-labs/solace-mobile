/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {getFeePayer} from '../../../utils/apis';
import {StorageDeleteItem, StorageGetItem} from '../../../utils/storage';
import Loading from '../loading/Loading';

export type Props = {
  navigation: any;
};

const AuthLoading: React.FC<Props> = ({navigation}) => {
  const getTokens = async () => {
    try {
      console.log('COMING HERE');
      await getFeePayer();
      const tokens = await StorageGetItem('tokens');
      if (tokens) {
        navigation.reset({
          index: 0,
          routes: [{name: 'MainPasscode'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    } catch (e: any) {
      await StorageDeleteItem('tokens');
      if (
        e === 'TOKEN_NOT_AVAILABLE' ||
        e.message === 'Request failed with status code 401'
      ) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        return;
      }
      showMessage({
        message: 'service unavailable',
        type: 'danger',
      });
    }
  };

  useEffect(() => {
    getTokens();
  }, []);

  return <Loading />;
};
export default AuthLoading;
