/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {Contact} from '../../components/wallet/ContactItem';
import {clearData, setAccountStatus, setUser} from '../actions/global';
import globalReducer from '../reducers/global';
import {KeyPair, SolaceSDK} from 'solace-sdk';
import {AwsCognito} from '../../utils/aws_cognito';
import {GoogleApi} from '../../utils/google_apis';
import {NETWORK, PROGRAM_ADDRESS} from '../../utils/constants';
import {
  StorageClearAll,
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from '../../utils/storage';

type InitialStateType = {
  accountStatus: AccountStatus;
  user?: User;
  sdk?: SolaceSDK;
  googleApi?: GoogleApi;
  contact?: Contact;
  contacts?: Contact[];
  awsCognito?: AwsCognito;
  retrieveData?: RetrieveData;
};

export type RetrieveData = {
  encryptedSecretKey?: any;
  encryptedSolaceName?: any;
  decryptedSecretKey?: any;
  decryptedSolaceName?: any;
};

export type Tokens = {
  accesstoken: string;
  idtoken: string;
  refreshtoken: string;
};

export type User = {
  email: string;
  solaceName: string;
  ownerPrivateKey: string;
  publicKey?: string;
  isWalletCreated: boolean;
  pin: string;
};

export enum AccountStatus {
  LOADING = 'LOADING',
  EXISITING = 'EXISITING',
  RECOVERY = 'RECOVERY',
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  SIGNED_UP = 'SIGNED_UP',
  LOGGED_ID = 'LOGGED_ID',
  RETRIEVE = 'RETRIEVE',
}

export enum AppState {
  SIGNUP = 'SIGNUP',
  GDRIVE = 'GDRIVE',
  ONBOARDED = 'ONBOARDED',
  RECOVERY = 'RECOVERY',
}

export const initialState = {
  accountStatus: AccountStatus.LOADING,
  user: {
    email: '',
    solaceName: '',
    ownerPrivateKey: '',
    isWalletCreated: false,
    pin: '',
  },
  contacts: [
    {
      id: new Date().getTime().toString() + Math.random().toString(),
      name: 'ashwin prasad',
      username: 'ashwin.solace.money',
      address: '1231jkajsdkf02198487',
    },
  ],
};

export const getKeypairFromPrivateKey = (user: User) => {
  const privateKey = user.ownerPrivateKey;
  return KeyPair.fromSecretKey(
    Uint8Array.from(privateKey.split(',').map(e => +e)),
  );
};

export const GlobalContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<any>;
}>({state: initialState, dispatch: () => {}});

const GlobalProvider = ({children}: {children: any}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  /** valid recover mode */
  const checkInRecoverMode = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    const appState: AppState = await StorageGetItem('appstate');
    return (storedUser &&
      appState &&
      appState === AppState.RECOVERY &&
      storedUser.solaceName &&
      storedUser.ownerPrivateKey) as boolean;
  }, []);

  /** Valid logged in user */
  const isUserValid = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    return (storedUser &&
      storedUser.pin &&
      storedUser.solaceName &&
      storedUser.ownerPrivateKey &&
      storedUser.isWalletCreated) as boolean;
  }, []);

  const isGdriveUserValid = async () => {
    const storedUser: User = await StorageGetItem('user');
    const appState: AppState = await StorageGetItem('appstate');
    return (storedUser &&
      appState &&
      appState === AppState.GDRIVE &&
      storedUser.pin &&
      storedUser.solaceName &&
      storedUser.ownerPrivateKey) as boolean;
  };

  const checkRecovery = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    const privateKey = storedUser.ownerPrivateKey! as string;
    const solaceName = storedUser.solaceName!;
    const keypair = KeyPair.fromSecretKey(
      Uint8Array.from(privateKey.split(',').map(e => +e)),
    );
    const sdk = await SolaceSDK.retrieveFromName(solaceName, {
      network: NETWORK,
      owner: keypair,
      programAddress: PROGRAM_ADDRESS,
    });
    const res = await sdk.fetchWalletData();
    if (res && res.recoveryMode) {
      dispatch(setAccountStatus(AccountStatus.RECOVERY));
    }
  }, []);

  const init = useCallback(async () => {
    // await StorageClearAll();
    await StorageSetItem('appstate', AppState.RECOVERY);
    const storedUser: User = await StorageGetItem('user');
    const appState: AppState = await StorageGetItem('appstate');

    /** RECOVERY CHECK */
    const inRecoveryMode = await checkInRecoverMode();
    if (inRecoveryMode) {
      dispatch(setAccountStatus(AccountStatus.RECOVERY));
      return;
    }
    /** LOGGED IN CHECK */
    const userValid = await isUserValid();
    if (userValid && appState === AppState.ONBOARDED) {
      dispatch(setUser(storedUser));
      dispatch(setAccountStatus(AccountStatus.EXISITING));
      return;
    }
    /**  GDRIVE ALREADY BACKED UP */
    const gdriveUserValid = await isGdriveUserValid();
    if (gdriveUserValid && appState === AppState.GDRIVE) {
      dispatch(setUser(storedUser));
      dispatch(setAccountStatus(AccountStatus.SIGNED_UP));
      return;
    }
    /** NEW USER */
    await StorageClearAll();
    dispatch(clearData());
    dispatch(setAccountStatus(AccountStatus.NEW));
  }, [checkInRecoverMode, checkRecovery, isUserValid]);

  useEffect(() => {
    init();
  }, []);

  return (
    <GlobalContext.Provider value={{state, dispatch}}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
