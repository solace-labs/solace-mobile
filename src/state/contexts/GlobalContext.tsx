/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {Contact} from '../../components/wallet/ContactItem';
import {
  clearData,
  setAccountStatus,
  setUpdate,
  setUser,
} from '../actions/global';
import globalReducer from '../reducers/global';
import {KeyPair, SolaceSDK} from 'solace-sdk';
import {AwsCognito} from '../../utils/aws_cognito';
import {GoogleApi} from '../../utils/google_apis';
import {NETWORK, PROGRAM_ADDRESS} from '../../utils/constants';
import {StorageClearAll, StorageGetItem} from '../../utils/storage';
import {Update} from '../../../App';

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

type InitialStateType = {
  accountStatus: AccountStatus;
  send?: {
    reciever: string;
  };
  user?: User;
  sdk?: SolaceSDK;
  updateStatus?: Update;
  googleApi?: GoogleApi;
  contact?: Contact;
  contacts?: Contact[];
  awsCognito?: AwsCognito;
  retrieveData?: RetrieveData;
  addresses: {
    guardian: string;
    contact: string;
  };
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
  solaceName: string;
  ownerPrivateKey: string;
  isWalletCreated: boolean;
  pin?: string;
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
  UPDATE = 'UPDATE',
}

export enum AppState {
  SIGNUP = 'SIGNUP',
  GDRIVE = 'GDRIVE',
  ONBOARDED = 'ONBOARDED',
  RECOVERY = 'RECOVERY',
  TESTING = 'TESTING',
}

export const initialState = {
  accountStatus: AccountStatus.LOADING,
  user: {
    solaceName: '',
    ownerPrivateKey: '',
    isWalletCreated: false,
    pin: '',
  },
  send: {
    reciever: '',
  },
  updateStatus: {
    loading: false,
    status: StatusEnum.CHECKING_FOR_UPDATE,
    progress: 0,
  },
  contacts: [
    {
      id: new Date().getTime().toString() + Math.random().toString(),
      name: 'ashwin prasad',
      username: 'ashwin.solace.money',
      address: '1231jkajsdkf02198487',
    },
  ],
  addresses: {
    guardian: '',
    contact: '',
  },
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

const GlobalProvider = ({
  children,
  updating,
}: {
  children: any;
  updating: Update;
}) => {
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
      storedUser.solaceName) as boolean;
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
    if (updating.loading) {
      dispatch(setUpdate(updating));
      dispatch(setAccountStatus(AccountStatus.UPDATE));
      return;
    }
    /*** GETDATA */
    // const appstate = await StorageGetItem('appstate');
    // console.log('appstate', appstate);
    // console.log('storeduser', storeduser);
    // await StorageClearAll();
    // await StorageSetItem('appstate', AppState.ONBOARDED);
    const storedUser: User = await StorageGetItem('user');
    const appState: AppState = await StorageGetItem('appstate');
    if (appState === AppState.TESTING) {
      dispatch(setAccountStatus(AccountStatus.EXISITING));
      return;
    }

    if (
      appState === AppState.SIGNUP &&
      storedUser &&
      storedUser.solaceName &&
      storedUser.solaceName.trim().length > 0
    ) {
      dispatch(setAccountStatus(AccountStatus.SIGNED_UP));
      return;
    }

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
  }, [checkInRecoverMode, checkRecovery, isUserValid, updating]);

  /** ONLY FOR DEVELOPMENT USE */
  const checking = async () => {
    /*** GETDATA */
    // const appstate = await StorageGetItem('appstate');
    // const storeduser = await StorageGetItem('user');
    // console.log(appstate);
    // console.log(storeduser);
    /*** LOGOUT */
    // await StorageClearAll();
    /*** LOGIN */
    // await StorageSetItem('appstate', AppState.ONBOARDED);
    // await StorageSetItem('user', {
    //   email: 'ankit.negi@onpar.in',
    //   isWalletCreated: true,
    //   ownerPrivateKey:
    //     '182,177,209,146,232,29,199,170,151,161,22,146,203,238,222,240,212,83,59,9,170,179,80,154,16,15,205,81,49,85,99,216,205,53,40,98,14,176,223,191,216,223,218,61,109,178,102,218,255,88,222,12,99,251,125,67,199,123,78,250,251,19,162,6',
    //   pin: '12341234',
    //   solaceName: 'solace8',
    // });
    // const datatoencrypt =
    //   '182,177,209,146,232,29,199,170,151,161,22,146,203,238,222,240,212,83,59,9,170,179,80,154,16,15,205,81,49,85,99,216,205,53,40,98,14,176,223,191,216,223,218,61,109,178,102,218,255,88,222,12,99,251,125,67,199,123,78,250,251,19,162,6';
  };

  useEffect(() => {
    init();
  }, [updating]);

  return (
    <GlobalContext.Provider value={{state, dispatch}}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
