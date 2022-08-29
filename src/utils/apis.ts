import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';
import {getMeta} from './relayer';
import {StorageDeleteItem} from './storage';

export const confirmTransaction = async (data: any) => {
  let confirm = false;
  let retry = 0;
  while (!confirm) {
    if (retry > 0) {
      showMessage({
        message: 'retrying, please wait...',
      });
    }
    try {
      await SolaceSDK.testnetConnection.confirmTransaction(data);
      showMessage({
        message: 'confirmed',
        type: 'success',
      });
      confirm = true;
    } catch (e: any) {
      if (
        e.message.startsWith('Transaction was not confirmed in 60.00 seconds.')
      ) {
        console.log('Timeout');
        retry++;
      } else {
        console.log('OTHER ERROR: ', e.message);
        retry++;
      }
    }
  }
};

export const getFeePayer = async (accessToken: string) => {
  try {
    const response = await getMeta(accessToken);
    return response.feePayer;
  } catch (e: any) {
    console.log('FEE PAYER', e.status);
    if (e.message === 'Request failed with status code 401') {
      showMessage({
        message: 'You need to login again',
        type: 'info',
      });
      return 'ACCESS_TOKEN_EXPIRED';
    }
    throw e;
  }
};
