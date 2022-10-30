import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {SolaceSDK} from 'solace-sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useRoute} from '@react-navigation/native';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import TopNavbar from '../../../common/TopNavbar';
import SolaceCustomInput from '../../../common/solaceui/SolaceCustomInput';
import Toast from 'react-native-toast-message';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import {SolaceToast} from '../../../common/solaceui/SolaceToast';
import {setReciever} from '../../../../state/actions/global';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'EditReciever'
>;

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const EditRecieverScreen = () => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();

  const {state, dispatch} = useContext(GlobalContext);
  const [address, setAddress] = useState(state.send?.reciever ?? '');

  const handleAdd = async () => {
    dispatch(setReciever(address));
    handleGoBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="reciever"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 16}}>
        <SolaceCustomInput
          handleIconPress={() => {
            Toast.show({
              type: 'success',
              text1: 'scan coming soon...',
            });
          }}
          shiftIconUp="xs"
          iconName="line-scan"
          placeholder="address"
          iconType="mci"
          value={address}
          onChangeText={setAddress}
        />
      </View>
      <SolaceButton onPress={handleAdd} background="purple" disabled={!address}>
        <SolaceText type="secondary" weight="bold" color="white">
          confirm
        </SolaceText>
      </SolaceButton>
      <SolaceToast />
    </SolaceContainer>
  );
};

export default EditRecieverScreen;
