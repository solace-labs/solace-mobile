import {showMessage} from 'react-native-flash-message';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {LAMPORTS_PER_SOL, TOKEN_PROGRAM_ID} from '../utils/constants';
import moment from 'moment';
import {WalletDataType} from '../components/screens/wallet/home/Incubation';
import {StorageGetItem} from '../utils/storage';
import {AppState} from '../state/contexts/GlobalContext';
import {fetchGuardianData} from 'solace-sdk/dist/cjs/sdk/setup/guardian';

export type Account = {
  amount: number;
  tokenAddress: string;
};

export const getAccounts = async (sdk: SolaceSDK) => {
  console.log('GETTING ACCOUNTS');
  try {
    const allAccounts = await sdk.provider.connection.getTokenAccountsByOwner(
      sdk.wallet,
      {
        programId: TOKEN_PROGRAM_ID,
      },
    );
    const accs: Account[] = [];
    for (let i = 0; i < allAccounts.value.length; i++) {
      const accountInfoBuffer = Buffer.from(allAccounts.value[i].account.data);
      const accountInfo = await SolaceSDK.getAccountInfo(accountInfoBuffer);
      const balance = +accountInfo.amount.toString() / LAMPORTS_PER_SOL;
      const tokenAddress = accountInfo.mint.toString();
      accs.push({
        amount: balance,
        tokenAddress,
      });
    }
    return accs;
  } catch (e) {
    console.log('ERR', e);
    showMessage({
      message: 'service unavilable',
      type: 'danger',
    });
  }
};

const getIncubationTime = (createdAt: number) => {
  return moment(new Date(createdAt * 1000))
    .add(12, 'h')
    .format('DD MMM HH:mm');
};

const checkIncubationMode = (data: WalletDataType) => {
  const date = moment(new Date(data.createdAt * 1000)).add(12, 'h');
  const current = moment(new Date());
  const difference = date.diff(current);
  return (difference > 0 && data.incubationMode) as boolean;
};

export const getIncubationData = async (sdk: SolaceSDK) => {
  const data = await sdk!.fetchWalletData();
  return {
    inIncubation: checkIncubationMode(data),
    endTime: getIncubationTime(data.createdAt),
  };
};

export const getTokenAccount = async (sdk: SolaceSDK, spltoken: string) => {
  try {
    return (await sdk.getTokenAccount(new PublicKey(spltoken))).toString();
  } catch (e) {
    console.log(e);
    showMessage({
      message: 'some error getting token account',
      type: 'danger',
    });
  }
};

export const getMaxBalance = async (sdk: SolaceSDK, asset: string) => {
  try {
    if (asset === 'SOL') {
      return 0;
    }
    const splTokenAddress = new PublicKey(asset);
    const accountInfo = await sdk?.getTokenAccountInfo(splTokenAddress);
    return +accountInfo!.amount.toString() / LAMPORTS_PER_SOL;
  } catch (e: any) {
    console.log(e.message);
    showMessage({message: 'some error try again', type: 'warning'});
  }
};

export const getGuardians = async (sdk: SolaceSDK) => {
  console.log('FETCHING Guardian');
  const appstate = await StorageGetItem('appstate');
  try {
    if (!sdk) {
      showMessage({
        message: 'wallet not setup properly. logout',
        type: 'danger',
      });
    }
    // const {
    //   pendingGuardians,
    //   approvedGuardians,
    //   guarding: whoIProtect,
    // } = await sdk.fetchWalletData();
    const {approvedGuardians, pendingGuardianData: pendingGuardians} =
      await sdk.fetchGuardianData();

    return {
      approved: approvedGuardians,
      pending: pendingGuardians,
      guarding: [],
    };
  } catch (e) {
    if (!(appstate === AppState.TESTING)) {
      showMessage({
        message: 'some error fetching guardians',
        type: 'danger',
      });
    }
  }
};

export const getContacts = async (sdk: SolaceSDK) => {
  try {
    const walletData = await sdk.fetchWalletData();
    console.log(walletData);
    return walletData.trustedPubkeys;
  } catch (e: any) {
    console.log('Error: ', e);
  }
};

export const getOngoingTransfers = async (sdk: SolaceSDK) => {
  try {
    console.log('FETCHING transfers');
    return await sdk.fetchOngoingTransfers();
  } catch (e: any) {
    console.log('Error: ', e);
  }
};
