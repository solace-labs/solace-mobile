import {View} from 'react-native';
import React, {FC, ReactNode, useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';

import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import SolaceLoader from '../../../common/solaceui/SolaceLoader';
import TopNavbar from '../../../common/TopNavbar';
import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {relayTransaction} from '../../../../utils/relayer';
import {confirmTransaction, getFeePayer} from '../../../../utils/apis';
import SolaceStatus from '../../../common/solaceui/SolaceStatus';
import globalStyles from '../../../../utils/global_styles';
import {WalletStackParamList} from '../../../../navigation/Wallet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useRoute} from '@react-navigation/native';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'Incubation'
>;

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const Incubation = () => {
  const initialLoading = {message: '', value: false};
  const [loading, setLoading] = useState(initialLoading);
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const {
    params: {show},
  } = useRoute<WalletScreenProps['route']>();

  const handleIncubationEnd = async () => {
    try {
      setLoading({
        message: 'ending incubation...',
        value: true,
      });
      const sdk = state.sdk!;
      const feePayer = await getFeePayer();
      const tx = await sdk.endIncubation(feePayer!);
      const transactionId = await relayTransaction(tx);
      setLoading({
        message: 'finalizing...',
        value: true,
      });
      await confirmTransaction(transactionId);
      setLoading(initialLoading);
      handleGoBack();
    } catch (e: any) {
      console.log(e);
      setLoading(initialLoading);
      showMessage({
        message: 'some error ending',
        type: 'danger',
      });
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
        text="incubation"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 16}}>
        <SolaceText align="left" weight="bold" type="secondary" color="light">
          during incubation mode
        </SolaceText>
        <View style={{flexDirection: 'column', marginTop: 12}}>
          <View style={globalStyles.rowCenter}>
            <SolaceStatus type={'success'} style={{marginRight: 12}} />
            <SolaceText
              align="left"
              weight="bold"
              type="secondary"
              color="light">
              add guardians without delay
            </SolaceText>
          </View>
          <View style={[globalStyles.rowCenter, {marginTop: 12}]}>
            <SolaceStatus type={'success'} style={{marginRight: 12}} />
            <SolaceText
              align="left"
              weight="bold"
              type="secondary"
              color="light">
              add trusted contacts without any history with them
            </SolaceText>
          </View>
        </View>
        <SolaceText
          align="left"
          weight="bold"
          type="secondary"
          color="light"
          mt={12}
          size="sm">
          it begins when your vault is created and ends after 12 hours of it and
          can be ended prematurely by you anytime within that 12 hour window.
        </SolaceText>
        {show === 'yes' && (
          <>
            <SolaceText
              align="left"
              weight="bold"
              type="secondary"
              mt={16}
              color="light">
              your vault is in{' '}
              <SolaceText
                align="left"
                weight="bold"
                color="green"
                type="secondary">
                incubation mode
              </SolaceText>{' '}
              you can choose to end it now.
            </SolaceText>
            <SolaceText
              align="left"
              weight="bold"
              type="secondary"
              mt={16}
              color="awaiting">
              are you sure you want to end incubation?
            </SolaceText>
          </>
        )}
        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      {show === 'yes' && (
        <SolaceButton onPress={handleIncubationEnd} loading={loading.value}>
          <SolaceText type="secondary" weight="bold" color="dark">
            end incubation
          </SolaceText>
        </SolaceButton>
      )}
    </SolaceContainer>
  );
};

export default Incubation;
