import {View, Image} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  setAccountStatus,
  setGoogleApi,
  setRetrieveData,
} from '../../../state/actions/global';
import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {GoogleApi} from '../../../utils/google_apis';
import {showMessage} from 'react-native-flash-message';
import {
  SOLACE_NAME_FILENAME,
  PRIVATE_KEY_FILENAME,
} from '../../../utils/constants';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RetrieveStackParamList} from '../../../navigation/Retrieve';
import {useNavigation} from '@react-navigation/native';

type RetrieveScreenProps = NativeStackScreenProps<
  RetrieveStackParamList,
  'GoogleDrive'
>;

const GoogleDriveScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<RetrieveScreenProps['navigation']>();
  const [loading, setLoading] = useState({
    value: false,
    message: 'retrieve now',
  });

  const retrieveFromGoogleDrive = async () => {
    try {
      const googleApi: GoogleApi = new GoogleApi();
      setLoading({
        value: true,
        message: 'retrieving...',
      });
      await googleApi.signIn();
      await googleApi.setDrive();
      dispatch(setGoogleApi(googleApi));
      const secretKeyExists = await googleApi.checkFileExists(
        PRIVATE_KEY_FILENAME,
      );
      const solaceNameExists = await googleApi.checkFileExists(
        SOLACE_NAME_FILENAME,
      );

      if (secretKeyExists && solaceNameExists) {
        const encryptedSecretKey = await googleApi.getFileData(
          PRIVATE_KEY_FILENAME,
        );
        const encryptedSolaceName = await googleApi.getFileData(
          SOLACE_NAME_FILENAME,
        );
        dispatch(
          setRetrieveData({
            ...state.retrieveData,
            encryptedSecretKey,
            encryptedSolaceName,
          }),
        );
        setLoading({
          value: false,
          message: 'retrieve now',
        });
        showMessage({
          message: 'successfully retrieved from google drive',
          type: 'success',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      } else {
        showMessage({
          message: 'There is no solace backup found in google drive',
          type: 'info',
        });
        setLoading({
          value: false,
          message: 'recover by guardians?',
        });
        return;
      }
    } catch (e: any) {
      console.log('ERRROR: ', e);
      if (!e.message.startsWith('RNGoogleSignInError')) {
        showMessage({
          message: e.message,
          type: 'danger',
        });
      }
      setLoading({
        value: false,
        message: 'enable now',
      });
    }
  };

  const recoverUsingGuardians = () => {
    dispatch(setAccountStatus(AccountStatus.RECOVERY));
  };

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
          heading="retrieve your vault"
          subHeading="retrieve your encrypted key from google drive so you can access your vault"
        />
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>

      <SolaceButton
        onPress={() => {
          loading.message === 'recover by guardians?'
            ? recoverUsingGuardians()
            : retrieveFromGoogleDrive();
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

export default GoogleDriveScreen;
