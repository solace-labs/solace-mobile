import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import styles from './styles';
import {setGoogleApi, setUser} from '../../../../state/actions/global';
import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {SolaceSDK} from 'solace-sdk';
import {encryptKey} from '../../../../utils/aes_encryption';
import {GoogleApi} from '../../../../utils/google_apis';
import {showMessage} from 'react-native-flash-message';
import {StorageSetItem} from '../../../../utils/storage';
import {
  SOLACE_NAME_FILENAME,
  PRIVATE_KEY_FILENAME,
} from '../../../../utils/constants';

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
        dispatch(
          setUser({
            ...state.user,
            isWalletCreated: false,
            ownerPrivateKey: secretKey,
          }),
        );
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
          routes: [{name: 'Airdrop'}],
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

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} bounces={false}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Image
            source={require('../../../../../assets/images/solace/google-drive.png')}
            style={styles.image}
          />
          <Text style={styles.heading}>secure your wallet</Text>
          <Text style={styles.subHeading}>
            store your encrypted key in google drive so you can recover your
            wallet if you lose your device
          </Text>
        </View>

        {loading.value && <ActivityIndicator size="small" />}

        <TouchableOpacity
          disabled={loading.value}
          onPress={() => {
            handleClick();
          }}
          style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>{loading.message}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GoogleDriveScreen;
