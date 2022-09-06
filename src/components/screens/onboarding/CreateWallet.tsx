import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {setAccountStatus, setSDK, setUser} from '../../../state/actions/global';
import {
  AccountStatus,
  getKeypairFromPrivateKey,
  GlobalContext,
  Tokens,
} from '../../../state/contexts/GlobalContext';
import {PublicKey, SolaceSDK} from 'solace-sdk';
import {showMessage} from 'react-native-flash-message';
import {relayTransaction} from '../../../utils/relayer';
import {StorageGetItem, StorageSetItem} from '../../../utils/storage';
import {NETWORK, PROGRAM_ADDRESS} from '../../../utils/constants';
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
      setLoading({message: 'creating wallet...', value: true});
      console.log(state.user);
      const keypair = getKeypairFromPrivateKey(state.user!);
      const feePayer = await getFeePayer();
      console.log({feePayer, keypair});
      const {sdk, transactionId} = await createWallet(keypair, feePayer);
      console.log('CREATED. Confirming now...');
      // await confirmTransaction(transactionId);
      const awsCognito = state.awsCognito!;
      await awsCognito.updateAttribute('address', sdk.wallet.toString());
      dispatch(setSDK(sdk));
      dispatch(setUser({...state.user, isWalletCreated: true}));
      showMessage({
        message: 'wallet created',
        type: 'success',
      });
      await StorageSetItem('user', {...state.user, isWalletCreated: true});
      resetLoading();
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
      console.log('CREATING', {sdk, username});
      const tx = await sdk.createFromName(username, payer);
      const res = await relayTransaction(tx);
      return {
        sdk,
        transactionId: res.data,
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

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="create wallet"
          subHeading="store your encrypted key in google drive so you can recover your wallet if you lose your device"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>

      <SolaceButton
        onPress={() => {
          handleClick();
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
