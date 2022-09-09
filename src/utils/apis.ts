import {CognitoRefreshToken} from 'amazon-cognito-identity-js';
import {Linking} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {PublicKeyType} from '../components/screens/wallet/Guardian';
import {AppState, Tokens, User} from '../state/contexts/GlobalContext';
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
        if (NETWORK === 'local') {
          const response = await SolaceSDK.localConnection.getSignatureStatus(
            transactionId,
          );
          if (response?.value?.confirmationStatus === 'confirmed') {
            resolve('success');
          }
        } else if (NETWORK === 'testnet') {
          const response = await SolaceSDK.testnetConnection.getSignatureStatus(
            transactionId,
            {
              searchTransactionHistory: true,
            },
          );
          console.log('confirm', response);
          if (response.value) {
            const {confirmationStatus, err} = response.value;
            if (confirmationStatus === 'finalized') {
              resolve('success');
            }
            if (
              confirmationStatus === 'confirmed' ||
              confirmationStatus === 'processed'
            ) {
              console.log(confirmationStatus);
            }
            if (err) {
              reject('error confirming transaction');
            }
          }
        }
      }, 2000);
    });
    clearInterval(interval);
    showMessage({
      message: 'finalized, tap to see transaction',
      duration: 5000,
      onPress: () => {
        console.log(transactionId);
        const url = `https://solscan.io/tx/${transactionId}?&cluster=testnet`;
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log("Don't know how to open URI: " + url);
          }
        });
      },
      type: 'success',
    });
  } catch (e: any) {
    console.log('ERROR CONFIRMING', e);
  }
};

export const getFeePayer = async (): Promise<PublicKeyType | void> => {
  const appstate = await StorageGetItem('appstate');
  if (appstate === AppState.TESTING) {
    return;
  }
  try {
    const {feePayer} = await getMeta();
    return new PublicKey(feePayer);
  } catch (e: any) {
    console.log('FEE PAYER', e);
    if (
      e === 'TOKEN_NOT_AVAILABLE' ||
      e.message === 'Request failed with status code 401'
    ) {
      console.log('***************REFRESING SESSION****************');
      showMessage({
        message: 'login again',
        type: 'warning',
      });
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
