/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {KeyPair, SolaceSDK} from 'solace-sdk';
import {setAccountStatus, setSDK, setUser} from '../../../state/actions/global';
import {
  AccountStatus,
  AppState,
  GlobalContext,
  User,
} from '../../../state/contexts/GlobalContext';
import {getFeePayer} from '../../../utils/apis';
import {
  NETWORK,
  PROGRAM_ADDRESS,
  TEST_PRIVATE_KEY,
} from '../../../utils/constants';
import {
  StorageDeleteItem,
  StorageGetItem,
  StorageSetItem,
} from '../../../utils/storage';
import Loading from '../loading/Loading';

export type Props = {
  navigation: any;
};

const AuthLoading: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  const createTestWallet = async () => {
    // setIsLoading({message: 'creating...', value: true});
    const user = await StorageGetItem('user');
    const privateK = Uint8Array.from(TEST_PRIVATE_KEY.split(',').map(e => +e));
    const keypair = KeyPair.fromSecretKey(privateK);
    const sdk = await SolaceSDK.retrieveFromName(user.solaceName, {
      network: NETWORK,
      owner: keypair,
      programAddress: PROGRAM_ADDRESS,
    });
    dispatch(
      setUser({
        ...state.user,
        isWalletCreated: true,
        ownerPrivateKey: TEST_PRIVATE_KEY,
      }),
    );
    dispatch(setSDK(sdk));
    await StorageSetItem('user', {
      ...state.user,
      isWalletCreated: true,
      ownerPrivateKey: TEST_PRIVATE_KEY,
    });
    // setLoading({message: '', value: false});
    dispatch(setAccountStatus(AccountStatus.ACTIVE));
  };

  const retrieveAccount = async (user: User) => {
    try {
      const privateKey = user.ownerPrivateKey;
      const solaceName = user.solaceName;
      const keypair = KeyPair.fromSecretKey(
        Uint8Array.from(privateKey.split(',').map(e => +e)),
      );
      const sdk = await SolaceSDK.retrieveFromName(solaceName, {
        network: NETWORK,
        owner: keypair,
        programAddress: PROGRAM_ADDRESS,
      });
      console.log('WALLET ADDRESS', sdk.wallet);
      dispatch(setSDK(sdk));
      dispatch(setAccountStatus(AccountStatus.ACTIVE));
    } catch (e: any) {
      if (e.message === 'Request failed with status code 401') {
        navigation.navigate('AuthLoading');
        return;
      }
      showMessage({
        message: 'error retrieving accout, contact solace team',
        type: 'default',
      });
      console.log('ERROR RETRIEVING ACCOUNT');
    }
  };

  const getScreen = async () => {
    try {
      const appState = await StorageGetItem('appState');
      if (appState === AppState.TESTING) {
        await createTestWallet();
        return;
      }
      const tokens = await StorageGetItem('tokens');
      if (!tokens) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
      await getFeePayer();
      const user = await StorageGetItem('user');
      await retrieveAccount(user);
    } catch (e: any) {
      await StorageDeleteItem('tokens');
      if (
        e === 'TOKEN_NOT_AVAILABLE' ||
        e.message === 'Request failed with status code 401'
      ) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        return;
      }
      showMessage({
        message: 'service unavailable',
        type: 'danger',
      });
    }
  };

  useEffect(() => {
    getScreen();
  }, []);

  return <Loading />;
};
export default AuthLoading;
