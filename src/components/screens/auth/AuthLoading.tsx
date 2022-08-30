/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {StorageGetItem} from '../../../utils/storage';
import Loading from '../loading/Loading';

export type Props = {
  navigation: any;
};

const AuthLoading: React.FC<Props> = ({navigation}) => {
  const getTokens = async () => {
    const tokens = await StorageGetItem('tokens');
    // console.log({tokens});
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
  };

  useEffect(() => {
    getTokens();
  }, []);

  return <Loading />;
};
export default AuthLoading;
