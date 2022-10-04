import React, {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import Navigation from './src/navigation/Navigation';
import GlobalProvider from './src/state/contexts/GlobalContext';
import codePush from 'react-native-code-push';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// type Data = keyof typeof codePush.SyncStatus;
// function onAppStateChange(status: any) {
//   // React Query already supports in web browser refetch on window focus by default
//   if (Platform.OS !== 'web') {
//     focusManager.setFocused(status === 'active');
//   }
// }
export const statusArray = [
  'UP_TO_DATE',
  'UPDATE_INSTALLED',
  'UPDATE_IGNORED',
  'UNKNOWN_ERROR',
  'SYNC_IN_PROGRESS',
  'CHECKING_FOR_UPDATE',
  'AWAITING_USER_ACTION',
  'DOWNLOADING_PACKAGE',
  'INSTALLING_UPDATE',
];

export enum StatusEnum {
  UP_TO_DATE = 'UP_TO_DATE',
  UPDATE_INSTALLED = 'UPDATE_INSTALLED',
  UPDATE_IGNORED = 'UPDATE_IGNORED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  SYNC_IN_PROGRESS = 'SYNC_IN_PROGRESS',
  CHECKING_FOR_UPDATE = 'CHECKING_FOR_UPDATE',
  AWAITING_USER_ACTION = 'AWAITING_USER_ACTION',
  DOWNLOADING_PACKAGE = 'DOWNLOADING_PACKAGE',
  INSTALLING_UPDATE = 'INSTALLING_UPDATE',
}

const queryClient = new QueryClient();

export type Update = {
  loading: boolean;
  status: StatusEnum;
  progress: number;
};

let CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  updateDialog: {
    title: 'a new update is available!',
  },
};

let App = () => {
  const [updating, setUpdating] = useState<Update>({
    loading: true,
    status: StatusEnum.CHECKING_FOR_UPDATE,
    progress: 0,
  });

  const update = async () => {
    setUpdating(prev => ({
      ...prev,
      loading: true,
    }));
    try {
      await codePush.sync(
        {
          installMode: codePush.InstallMode.IMMEDIATE,
          updateDialog: {
            appendReleaseDescription: true,
            title: 'a new update is available!',
          },
        },
        status => {
          setUpdating(prev => ({
            ...prev,
            status: statusArray[status] as StatusEnum,
          }));
        },
        download => {
          setUpdating(prev => ({
            ...prev,
            progress: Math.round(
              (download.receivedBytes / download.totalBytes) * 100,
            ),
          }));
        },
      );
      setUpdating(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (e) {
      setUpdating(prev => ({
        ...prev,
        loading: false,
      }));
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
        <Toast />
      </GlobalProvider>
    </QueryClientProvider>
  );
};

App = codePush(CodePushOptions)(App);

export default App;
