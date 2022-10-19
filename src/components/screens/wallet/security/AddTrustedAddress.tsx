import {Alert, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  AppState,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import {PublicKey} from 'solace-sdk';
import {relayTransaction, requestGuardian} from '../../../../utils/relayer';
import {showMessage} from 'react-native-flash-message';
import {confirmTransaction, getFeePayer} from '../../../../utils/apis';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import SolaceLoader from '../../../common/solaceui/SolaceLoader';
import TopNavbar from '../../../common/TopNavbar';
import SolaceCustomInput from '../../../common/solaceui/SolaceCustomInput';
import {StorageGetItem} from '../../../../utils/storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';
import SolaceInput from '../../../common/solaceui/SolaceInput';
import SolacePaper from '../../../common/solaceui/SolacePaper';
import {guardianStyles as styles} from '../../../wallet/GuardianSecondTab';
import globalStyles from '../../../../utils/global_styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../../../utils/colors';

type EAddTrustedAddressScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'AddTrustedAddress'
>;

const AddTrustedAddress = () => {
  const [address, setAddress] = useState(
    // 'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
    '',
  );
  const {state} = useContext(GlobalContext);
  const navigation =
    useNavigation<EAddTrustedAddressScreenProps['navigation']>();
  const [loading, setLoading] = useState({
    value: false,
    message: 'edit guardian',
  });

  const addGuardian = async () => {
    setLoading({
      message: 'saving...',
      value: true,
    });
    const appstate = await StorageGetItem('appstate');
    const sdk = state.sdk!;
    const walletName = state.user?.solaceName!;
    const solaceWalletAddress = sdk.wallet.toString();
    try {
      const feePayer = await getFeePayer();
      const guardianPublicKey = new PublicKey(address);
      const tx = await sdk.addGuardian(guardianPublicKey, feePayer!);
      const transactionId = await relayTransaction(tx);
      setLoading({
        message: 'finalizing...',
        value: true,
      });
      await confirmTransaction(transactionId);
      await requestGuardian({
        guardianAddress: guardianPublicKey.toString(),
        solaceWalletAddress,
        walletName,
      });
      setLoading({
        message: '',
        value: false,
      });
      showMessage({
        message: 'guardian edited successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (e) {
      console.log('MAIN ERROR:', JSON.stringify(e));
      setLoading({
        message: '',
        value: false,
      });
      if (!(appstate === AppState.TESTING)) {
        showMessage({
          message: 'service unavilable. try again later',
          type: 'warning',
        });
      } else {
        showMessage({
          message: 'do a transaction first',
          type: 'info',
        });
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="trust address"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 8}}>
        {/* <SolaceCustomInput
          iconName="line-scan"
          iconType="mci"
          handleIconPress={() => {
            showMessage({
              message: 'scan coming soon...',
              type: 'info',
            });
          }}
          shiftIconUp="xxs"
          value={address}
          placeholder="wallet address of guardian"
          onChangeText={setAddress}
        /> */}
        <View style={styles.item}>
          <View style={styles.leftSide}>
            <View style={globalStyles.avatar}>
              <SolaceText weight="bold" size="sm" color="awaiting">
                {/* {firstCharacter(guardian)} */}
                as
              </SolaceText>
            </View>
            <View>
              <SolaceText align="left" type="secondary" weight="bold" size="sm">
                {/* {minifyAddress(guardian, 5)} */}
                ankit sethi
              </SolaceText>
              <SolaceText
                type="secondary"
                size="sm"
                weight="bold"
                align="left"
                color={'normal'}>
                {/* {type === 'approved' ? 'approved' : 'pending'} */}
                {'24 hours before removal'}
              </SolaceText>
            </View>
          </View>
          <View style={styles.rightSide}>
            <TouchableOpacity
              onPress={() => {
                // handleCopy(guardian.toString());
                Alert.alert('are you sure you want to delete?', '', [
                  {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: async () => {},
                  },
                ]);
              }}>
              {/* <SolaceText type="secondary" weight="bold" size="sm" color="link">
                copy
              </SolaceText> */}
              <Entypo name="trash" color={Colors.text.lightorange} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <SolaceInput
          mt={20}
          placeholder="ankit sethi"
          value={address}
          onChangeText={setAddress}
        />
        <SolacePaper mt={20}>
          <SolaceText size="xs" type="secondary" align="left" color="normal">
            note: there is a 36 hour buffer period before this guardian gets
            activated.
          </SolaceText>
        </SolacePaper>
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      {/* <View style={styles.subTextContainer}>
        <AntDesign name="checkcircleo" style={styles.subIcon} />
        <Text style={styles.subText}>address found</Text>
      </View>
      <View style={[styles.subTextContainer, {marginTop: 0}]}>
        <Text style={styles.buttonText}>0x8zo881ixpzAdiZ2802hz00zc</Text>
      </View> */}

      {/* <View style={styles.networkContainer}>
        <Text style={styles.secondText}>network</Text>
        <Text style={styles.solanaText}>solana</Text>
      </View> */}
      <View>
        <SolaceButton
          onPress={addGuardian}
          background="purple"
          loading={loading.value}
          disabled={!address || loading.value}>
          <SolaceText type="secondary" weight="bold" color="white">
            {/* {loading.message} */}
            add a trusted addressa
          </SolaceText>
        </SolaceButton>
      </View>
    </SolaceContainer>
  );
};

export default AddTrustedAddress;
