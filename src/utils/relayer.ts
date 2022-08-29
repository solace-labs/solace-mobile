import axios from 'axios';
import {KeyPair, PublicKey, SolaceSDK} from 'solace-sdk';
import {
  DEFAULT_PRIVATE_KEY,
  LAMPORTS_PER_SOL,
  NETWORK,
  RELAYER_BASE_URL,
} from './constants';
import {relayTransaction as rlTransaction} from 'solace-sdk/relayer';

interface RequestGuardianshipBody {
  guardianAddress: string;
  solaceWalletAddress: string;
  walletName: string;
}

/**
 * Get meta information of the url
 * @param accessToken
 */
export const getMeta = async (accessToken: string) => {
  return (
    await axios.get<{feePayer: any; clusterUrl: string}>(
      `${RELAYER_BASE_URL}/meta`,
      {
        headers: {Authorization: accessToken},
      },
    )
  ).data;
};

/**
 * Request airdrop
 * @param publicKey
 * @param accessToken
 * @returns
 */
export const airdrop = async (publicKey: string, accessToken: string) => {
  try {
    if (NETWORK === 'local') {
      return await SolaceSDK.localConnection.requestAirdrop(
        new PublicKey(publicKey),
        LAMPORTS_PER_SOL,
      );
    }
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
export const relayTransaction = async (tx: any, accessToken: string) => {
  console.log('RELAYING');
  if (NETWORK === 'local') {
    const keypair = KeyPair.fromSecretKey(Uint8Array.from(DEFAULT_PRIVATE_KEY));
    console.log('DONE RELAYING');
    const res = await rlTransaction(tx, keypair);
    console.log('RES', res);
    return res;
  }
  const res = await axios.post(`${RELAYER_BASE_URL}/relay`, tx, {
    headers: {Authorization: accessToken},
  });
  return res.data;
};

/**
 * Request for guardianship
 * @param {RequestGuardianshipBody} data
 * @param accessToken
 * @returns
 */
export const requestGuardian = async (
  data: RequestGuardianshipBody,
  accessToken: string,
) => {
  return await axios.post(`${RELAYER_BASE_URL}/guardian/request`, data, {
    headers: {Authorization: accessToken},
  });
};
