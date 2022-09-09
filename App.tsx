import React from 'react';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigation/Navigation';
import GlobalProvider from './src/state/contexts/GlobalContext';
import codePush from 'react-native-code-push';

let CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    // appendReleaseDescription: true,
    title: 'a new update is available!',
  },
};

let App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  return (
    <GlobalProvider>
      <Navigation />
      <FlashMessage position="top" />
    </GlobalProvider>
  );
};

App = codePush(CodePushOptions)(App);

export default App;
