import {showMessage} from 'react-native-flash-message';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {PublicKeyType} from '../components/screens/wallet/Guardian';
import {NETWORK} from './constants';
import {getMeta} from './relayer';

export const confirmTransaction = async (transactionId: string) => {
  showMessage({
    message: 'confirming transaction...',
  });
  let confirm = false;
  let retry = 0;
  while (!confirm) {
    if (retry > 0) {
      showMessage({
        message: 'confirming, please wait...',
      });
    }
    try {
      if (NETWORK === 'local') {
        await SolaceSDK.localConnection.confirmTransaction(transactionId);
      } else {
        await SolaceSDK.testnetConnection.confirmTransaction(transactionId);
      }
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
      } else {
        console.log('Confirmation Error: ', e.message);
      }
      retry++;
    }
  }
};

export const getFeePayer = async (
  accessToken: string,
): Promise<PublicKeyType> => {
  try {
    const {feePayer} = await getMeta(accessToken);
    return new PublicKey(feePayer);
  } catch (e: any) {
    console.log('FEE PAYER', e.status);
    if (e.message === 'Request failed with status code 401') {
      showMessage({
        message: 'You need to login again',
        type: 'info',
      });
      // TODO: refresh token refetch and new access token
      // return 'ACCESS_TOKEN_EXPIRED';
      // return getFeePayer(accessToken);
    }
    throw e;
  }
};
