/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {OnboardingStackParamList} from '../../../navigation/Onboarding';
import {AppState} from '../../../state/contexts/GlobalContext';
import {StorageGetItem} from '../../../utils/storage';
import Loading from '../loading/Loading';

type OnboardingScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'OnboardLoading'
>;

const OnboardLoading = () => {
  const navigation = useNavigation<OnboardingScreenProps['navigation']>();

  const getScreen = async () => {
    const appState: AppState = await StorageGetItem('appstate');
    if (appState === AppState.TESTING) {
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
  };

  useEffect(() => {
    getScreen();
  }, []);

  return <Loading />;
};
export default OnboardLoading;
