/* eslint-disable react-hooks/exhaustive-deps */
import {View, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';

import {
  setAccountStatus,
  setGoogleApi,
  setUser,
} from '../../../state/actions/global';
import {
  AccountStatus,
  AppState,
  GlobalContext,
  User,
} from '../../../state/contexts/GlobalContext';
import {encryptKey} from '../../../utils/aes_encryption';
import {GoogleApi} from '../../../utils/google_apis';
import {StorageGetItem, StorageSetItem} from '../../../utils/storage';
import {
  SOLACE_NAME_FILENAME,
  PRIVATE_KEY_FILENAME,
} from '../../../utils/constants';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';

export type Props = {
  navigation: any;
};

const GoogleDriveScreen: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);
  const [loading, setLoading] = useState({
    value: false,
    message: 'enable now',
  });

  const handleClick = async () => {
    try {
      const keypair = SolaceSDK.newKeyPair();
      const {secretKey} = keypair;
      const secretKeyString = secretKey.toString();
      /** Google Drive Storage of Private Key and Solace Name */
      console.log('STORING');
      await storeToGoogleDrive(secretKeyString);
      // dispatch(
      //   setUser({
      //     ...state.user,
      //     isWalletCreated: false,
      //     ownerPrivateKey: secretKeyString,
      //   }),
      // );
      // await StorageSetItem('user', {
      //   ...state.user,
      //   isWalletCreated: false,
      //   ownerPrivateKey: secretKeyString,
      // });
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'CreateWallet'}],
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const storeToGoogleDrive = async (secretKey: string) => {
    try {
      const googleApi: GoogleApi = new GoogleApi();
      setLoading({
        value: true,
        message: 'storing...',
      });
      await googleApi.signIn();
      await googleApi.setDrive();
      dispatch(setGoogleApi(googleApi));
      const pin = state?.user?.pin!;
      const username = state?.user?.solaceName!;
      const encryptedPrivateKey = await encryptKey(secretKey, pin);
      const encryptedUsername = await encryptKey(username, pin);
      const exists = await googleApi.checkFileExists(PRIVATE_KEY_FILENAME);
      if (!exists) {
        await googleApi.uploadFileToDrive(
          PRIVATE_KEY_FILENAME,
          encryptedPrivateKey,
        );
        await googleApi.uploadFileToDrive(
          SOLACE_NAME_FILENAME,
          encryptedUsername,
        );
        const appState = await StorageGetItem('appstate');
        if (appState === AppState.RECOVERY) {
          const user: User = {
            pin,
            solaceName: username,
            ownerPrivateKey: secretKey,
            isWalletCreated: true,
            email: state.user?.email!,
          };
          await StorageSetItem('appstate', AppState.ONBOARDED);
          await StorageSetItem('user', user);
          dispatch(setUser(user));
          dispatch(setAccountStatus(AccountStatus.EXISITING));
          return;
        }
        dispatch(
          setUser({
            ...state.user,
            isWalletCreated: false,
            ownerPrivateKey: secretKey,
          }),
        );
        await StorageSetItem('appstate', AppState.GDRIVE);
        await StorageSetItem('user', {
          ...state.user,
          isWalletCreated: false,
          ownerPrivateKey: secretKey,
        });
        showMessage({
          message: 'Successfully uploaded to google drive',
          type: 'success',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'CreateWallet'}],
        });
      } else {
        showMessage({
          message:
            'Solace backup already exists. Please login to the account assosiated with this backup',
          type: 'info',
        });
        setLoading({
          value: false,
          message: 'use another account?',
        });
        return;
      }
    } catch (e: any) {
      const googleApi = state.googleApi;
      if (!e.message.startsWith('RNGoogleSignInError')) {
        showMessage({
          message: e.message,
          type: 'danger',
        });
        if (googleApi) {
          await googleApi.deleteFile(PRIVATE_KEY_FILENAME);
          await googleApi.deleteFile(SOLACE_NAME_FILENAME);
        }
      }
      setLoading({
        value: false,
        message: 'enable now',
      });
      throw e;
    }
  };

  const checkIfAlreadyBackup = async () => {
    const appState: AppState = await StorageGetItem('appstate');
    if (appState === AppState.GDRIVE) {
      showMessage({
        message: 'google drive backup already exists',
        type: 'info',
      });
      navigation.reset({
        index: 0,
        routes: [{name: 'CreateWallet'}],
      });
    }
  };

  useEffect(() => {
    checkIfAlreadyBackup();
  }, []);

  const imageStyle = {
    width: 70,
    height: 70,
    marginBottom: 5,
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Image
          source={require('../../../../assets/images/solace/google-drive.png')}
          style={imageStyle}
        />
        <Header
          heading="secure your wallet"
          subHeading="store your encrypted key in google drive so you can recover your wallet if you lose your device"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>

      <SolaceButton
        onPress={handleClick}
        loading={loading.value}
        disabled={loading.value}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          {loading.message}
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default GoogleDriveScreen;
