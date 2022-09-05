import {CognitoRefreshToken} from 'amazon-cognito-identity-js';
import {showMessage} from 'react-native-flash-message';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {PublicKeyType} from '../components/screens/wallet/Guardian';
import {Tokens, User} from '../state/contexts/GlobalContext';
import {AwsCognito} from './aws_cognito';
import {NETWORK} from './constants';
import {getMeta} from './relayer';
import {StorageGetItem} from './storage';

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
        // await SolaceSDK.testnetConnection.confirmTransaction(transactionId);
        const response = await SolaceSDK.testnetConnection.getSignatureStatus(
          transactionId,
        );
        console.log('STATUS: ', response.value);
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

export const getFeePayer = async (): Promise<PublicKeyType> => {
  try {
    const {feePayer} = await getMeta();
    return new PublicKey(feePayer);
  } catch (e: any) {
    console.log('FEE PAYER', e);
    if (e.message === 'Request failed with status code 401') {
      console.log('***************REFRESING SESSION****************');
      const newTokens = await getRefreshToken();
      console.log({newTokens});
      return await getFeePayer();
    } else {
      throw e;
    }
  }
};

const getRefreshToken = async () => {
  try {
    const {refreshtoken} = (await StorageGetItem('tokens')) as Tokens;
    const {solaceName} = (await StorageGetItem('user')) as User;
    const awsCognito = new AwsCognito();
    awsCognito.setCognitoUser(solaceName);
    const refreshToken = new CognitoRefreshToken({
      RefreshToken: refreshtoken,
    });
    return await awsCognito.refreshSession(refreshToken);
  } catch (e) {
    console.log('Error refreshing token', e);
  }
};
