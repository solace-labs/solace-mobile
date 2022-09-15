import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {SolaceSDK} from 'solace-sdk';

import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import TopNavbar from '../../common/TopNavbar';
import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {relayTransaction} from '../../../utils/relayer';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';

export type Props = {
  navigation: any;
  route: any;
};

export type WalletDataType = Awaited<
  ReturnType<typeof SolaceSDK.fetchDataForWallet>
>;

const Incubation: React.FC<Props> = ({navigation, route}) => {
  const initialLoading = {message: '', value: false};
  const [loading, setLoading] = useState(initialLoading);
  const {state} = useContext(GlobalContext);
  console.log({params: route.params});
  const show = route.params.show;

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
      <TopNavbar startIcon="back" text="incubation" startClick={handleGoBack} />
      <View style={{flex: 1, marginTop: 16}}>
        <SolaceText align="left" weight="bold" type="secondary" variant="light">
          incubation mode is a state of your vault where you can add guardians
          without delay and trusted contacts without any history with them. it
          begins when your vault is created and ends after 12 hours of it. it
          can be ended prematurely by you anytime within that 12 hour window.
        </SolaceText>
        {show === 'yes' && (
          <>
            <SolaceText
              align="left"
              weight="bold"
              type="secondary"
              mt={16}
              variant="light">
              your vault is in{' '}
              <SolaceText
                align="left"
                weight="bold"
                variant="solana-green"
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
              variant="awaiting">
              are you sure you want to end incubation?
            </SolaceText>
          </>
        )}

        {loading.value && <SolaceLoader text={loading.message} />}
      </View>
      {show === 'yes' && (
        <SolaceButton onPress={handleIncubationEnd} loading={loading.value}>
          <SolaceText type="secondary" weight="bold" variant="dark">
            end incubation
          </SolaceText>
        </SolaceButton>
      )}
    </SolaceContainer>
  );
};

export default Incubation;
