/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {Contact} from '../../components/wallet/ContactItem/ContactItem';
import {setAccountStatus, setUser} from '../actions/global';
import globalReducer from '../reducers/global';
import {KeyPair, SolaceSDK} from 'solace-sdk';
import {AwsCognito} from '../../utils/aws_cognito';
import {GoogleApi} from '../../utils/google_apis';
import {NETWORK, PROGRAM_ADDRESS} from '../../utils/constants';
import {StorageGetItem} from '../../utils/storage';

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
  inRecovery?: boolean;
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

const initialState = {
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

export const GlobalContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<any>;
}>({state: initialState, dispatch: () => {}});

const GlobalProvider = ({children}: {children: any}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const checkInRecoverMode = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    return (storedUser &&
      storedUser.inRecovery &&
      storedUser.solaceName &&
      storedUser.ownerPrivateKey) as boolean;
  }, []);

  const isUserValid = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    return (storedUser &&
      storedUser.pin &&
      storedUser.solaceName &&
      storedUser.ownerPrivateKey &&
      storedUser.isWalletCreated) as boolean;
  }, []);

  const checkRecovery = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    const privateKey = storedUser.ownerPrivateKey! as string;
    const solaceName = storedUser.solaceName!;
    console.log('checking recovery', privateKey);
    const keypair = KeyPair.fromSecretKey(
      Uint8Array.from(privateKey.split(',').map(e => +e)),
    );
    console.log(keypair.publicKey.toString());
    const sdk = await SolaceSDK.retrieveFromName(solaceName, {
      network: NETWORK,
      owner: keypair,
      programAddress: PROGRAM_ADDRESS,
    });
    const res = await sdk.fetchWalletData();
    console.log(res);
  }, []);

  const init = useCallback(async () => {
    const storedUser: User = await StorageGetItem('user');
    console.log({storedUser});
    const inRecoveryMode = await checkInRecoverMode();
    if (inRecoveryMode) {
      checkRecovery();
    } else if (await isUserValid()) {
      dispatch(setUser(storedUser));
      dispatch(setAccountStatus(AccountStatus.EXISITING));
    } else {
      dispatch(setAccountStatus(AccountStatus.NEW));
    }
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
