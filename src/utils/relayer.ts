import axios from 'axios';
import {KeyPair, PublicKey, SolaceSDK} from 'solace-sdk';
import {relayTransaction as rlTransaction} from 'solace-sdk/dist/cjs/relayer';
import {Tokens} from '../state/contexts/GlobalContext';
import {
  DEFAULT_PRIVATE_KEY,
  DEFAULT_PUBLIC_KEY,
  LAMPORTS_PER_SOL,
  NETWORK,
  RELAYER_BASE_URL,
} from './constants';
import {StorageGetItem} from './storage';

interface RequestGuardianshipBody {
  guardianAddress: string;
  solaceWalletAddress: string;
  walletName: string;
}

export const getAccessToken = async () => {
  const tokens: Tokens = await StorageGetItem('tokens');
  if (!tokens) {
    throw 'TOKEN_NOT_AVAILABLE';
  }
  return tokens.accesstoken;
};

/**
 * Get meta information of the url
 * @param accessToken
 */
export const getMeta = async () => {
  try {
    const accessToken = await getAccessToken();
    if (NETWORK === 'local') {
      return {feePayer: DEFAULT_PUBLIC_KEY};
    }
    return (
      await axios.get<{feePayer: any; clusterUrl: string}>(
        `${RELAYER_BASE_URL}/meta`,
        {
          headers: {Authorization: accessToken},
        },
      )
    ).data;
  } catch (e) {
    console.log('Error getting meta: ', e);
    throw e;
  }
};

/**
 * Request airdrop
 * @param publicKey
 * @param accessToken
 * @returns
 */
export const airdrop = async (publicKey: string) => {
  try {
    if (NETWORK === 'local') {
      return await SolaceSDK.localConnection.requestAirdrop(
        new PublicKey(publicKey),
        LAMPORTS_PER_SOL,
      );
    }
    const accessToken = await getAccessToken();
    const res = await axios.post(
      `${RELAYER_BASE_URL}/airdrop`,
      {
        publicKey,
      },
      {
        headers: {Authorization: accessToken},
      },
    );
    return res.data;
  } catch (e) {
    console.log('ERROR', e);
  }
};

/**
 * Relay a transaction
 * @param tx
 * @param accessToken
 * @returns
 */
export const relayTransaction = async (tx: any) => {
  console.log('RELAYING');
  if (NETWORK === 'local') {
    const keypair = KeyPair.fromSecretKey(Uint8Array.from(DEFAULT_PRIVATE_KEY));
    console.log('DONE RELAYING');
    const res = await rlTransaction(tx, keypair);
    console.log('RES', res);
    return res;
  }
  try {
    const accessToken = await getAccessToken();
    const res = await axios.post(`${RELAYER_BASE_URL}/relay`, tx, {
      headers: {Authorization: accessToken},
    });
    return res.data;
  } catch (e: any) {
    console.log('ERROR RELAYING: ', e);
    throw e;
  }
};

/**
 * Request for guardianship
 * @param {RequestGuardianshipBody} data
 * @param accessToken
 * @returns
 */
export const requestGuardian = async (data: RequestGuardianshipBody) => {
  try {
    const accessToken = await getAccessToken();
    return await axios.post(`${RELAYER_BASE_URL}/guardian/request`, data, {
      headers: {Authorization: accessToken},
    });
  } catch (e) {
    // throw e;
    console.log('Error Requesting Guardian', e);
  }
};
