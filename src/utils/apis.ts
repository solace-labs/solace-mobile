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
  try {
    let interval: any;
    await new Promise((resolve, reject) => {
      interval = setInterval(async () => {
        console.log('CONFIRMING...');
        if (NETWORK === 'local') {
          const response = await SolaceSDK.localConnection.getSignatureStatus(
            transactionId,
          );
          console.log({
            confirmation_status: response.value?.confirmationStatus,
          });
          if (response?.value?.confirmationStatus === 'confirmed') {
            resolve('success');
          }
        } else if (NETWORK === 'testnet') {
          const response = await SolaceSDK.testnetConnection.getSignatureStatus(
            transactionId,
          );
          console.log({
            confirmation_status: response.value?.confirmationStatus,
          });
          if (response?.value?.confirmationStatus === 'confirmed') {
            resolve('success');
          }
        }
      }, 1000);
    });
    clearInterval(interval);
    showMessage({
      message: 'confirmed. open in explorer',
      duration: 5000,
      onPress: () => {},
      type: 'success',
    });
  } catch (e: any) {
    console.log('ERROR CONFIRMING', e);
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
      showMessage({
        message: 'login again',
        type: 'warning',
      });
      // const newTokens = await getRefreshToken();

      // console.log({newTokens});
      // return await getFeePayer();
      throw e;
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
