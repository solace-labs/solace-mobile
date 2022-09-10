import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {setAccountStatus, setSDK, setUser} from '../../../state/actions/global';
import {
  AccountStatus,
  AppState,
  getKeypairFromPrivateKey,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {KeyPair, PublicKey, SolaceSDK} from 'solace-sdk';
import {showMessage} from 'react-native-flash-message';
import {relayTransaction} from '../../../utils/relayer';
import {StorageGetItem, StorageSetItem} from '../../../utils/storage';
import {
  NETWORK,
  PROGRAM_ADDRESS,
  TEST_PRIVATE_KEY,
} from '../../../utils/constants';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import Header from '../../common/Header';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';

const CreateWalletScreen: React.FC = () => {
  const initalLoadingState = {
    value: false,
    message: 'create',
  };
  const {state, dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = useState(initalLoadingState);

  const resetLoading = () => {
    setLoading(initalLoadingState);
  };

  const handleClick = async () => {
    try {
      dispatch(setUser(await StorageGetItem('user')));
      setLoading({message: 'creating vault...', value: true});
      const keypair = getKeypairFromPrivateKey(state.user!);
      const feePayer = await getFeePayer();
      const {sdk, transactionId} = await createWallet(keypair, feePayer!);
      setLoading({message: 'finalizing vault...please wait', value: true});
      await confirmTransaction(transactionId);
      const awsCognito = state.awsCognito!;
      await awsCognito.updateAttribute('address', sdk.wallet.toString());
      dispatch(setSDK(sdk));
      dispatch(setUser({...state.user, isWalletCreated: true}));
      await StorageSetItem('appstate', AppState.ONBOARDED);
      await StorageSetItem('user', {...state.user, isWalletCreated: true});
      resetLoading();
      showMessage({
        message: 'vault created',
        type: 'success',
      });
      dispatch(setAccountStatus(AccountStatus.EXISITING));
    } catch (e) {
      console.log('MAIN ERROR: ', e);
      resetLoading();
    }
  };

  const createWallet = async (
    keypair: ReturnType<typeof SolaceSDK.newKeyPair>,
    payer: InstanceType<typeof PublicKey>,
  ) => {
    try {
      const sdk = new SolaceSDK({
        network: NETWORK,
        owner: keypair,
        programAddress: PROGRAM_ADDRESS,
      });
      const username = state.user?.solaceName!;
      const tx = await sdk.createFromName(username, payer);
      const res = await relayTransaction(tx);
      console.log('TX', res);
      return {
        sdk,
        transactionId: res,
      };
    } catch (e: any) {
      setLoading({
        message: 'create',
        value: false,
      });
      showMessage({
        message: e.message,
      });
      throw e;
    }
  };

  const createTestWallet = async () => {
    setLoading({message: 'creating...', value: true});
    const privateK = Uint8Array.from(TEST_PRIVATE_KEY.split(',').map(e => +e));
    const keypair = KeyPair.fromSecretKey(privateK);
    const sdk = await SolaceSDK.retrieveFromName(state.user?.solaceName!, {
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
    await StorageSetItem('user', {
      ...state.user,
      isWalletCreated: true,
      ownerPrivateKey: TEST_PRIVATE_KEY,
    });
    dispatch(setSDK(sdk));
    setLoading({message: '', value: false});
    dispatch(setAccountStatus(AccountStatus.EXISITING));
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="create vault"
          subHeading="once your vault is created, it will be in “incubation mode”. you can add any number of guardians or trusted addresses when in this mode. 
          incubation mode ends in 12 hours after you create the vault"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      <SolaceButton
        onPress={async () => {
          const appState = await StorageGetItem('appstate');
          if (appState === AppState.TESTING) {
            createTestWallet();
          } else {
            handleClick();
          }
        }}
        loading={loading.value}
        disabled={loading.value}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {loading.message}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default CreateWalletScreen;
