import React, {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigation/Navigation';
import GlobalProvider from './src/state/contexts/GlobalContext';
import codePush from 'react-native-code-push';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {Platform} from 'react-native';
import {useOnlineManager} from './src/hooks/useOnlineManager';
import {useAppState} from './src/hooks/useAppState';

const queryClient = new QueryClient();
function onAppStateChange(status: any) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

let CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  // checkFrequency: codePush.CheckFrequency.ON_APP_START,
  // mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    // appendReleaseDescription: true,
    title: 'a new update is available!',
  },
};

let App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const [updating, setUpdating] = useState(true);
  // const [updating, setUpdating] = useState(false);
  useOnlineManager();
  useAppState(onAppStateChange);

  const update = async () => {
    setUpdating(true);
    try {
      await codePush.sync({
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          appendReleaseDescription: true,
          title: 'a new update is available!',
        },
      });
      setUpdating(false);
    } catch (e) {
      setUpdating(false);
      console.log('ERROR DURING UPDATE', e);
    }
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider updating={updating}>
        <Navigation />
        <FlashMessage position="top" />
      </GlobalProvider>
    </QueryClientProvider>
  );
};

App = codePush(CodePushOptions)(App);

export default App;
