/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  GlobalContext,
  Tokens,
} from '../../../state/contexts/GlobalContext';
import ContactItem from '../../wallet/ContactItem';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {PublicKey} from 'solace-sdk';
import {confirmTransaction, getFeePayer} from '../../../utils/apis';
import {StorageGetItem} from '../../../utils/storage';
import {relayTransaction} from '../../../utils/relayer';
import {LAMPORTS_PER_SOL, SPL_TOKEN} from '../../../utils/constants';
import AccountItem from '../../wallet/AccountItem';
import QRCode from 'react-native-qrcode-svg';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {setAccountStatus} from '../../../state/actions/global';

export type Props = {
  navigation: any;
};

export type Account = {
  amount: number;
  tokenAddress: string;
};

const RecieveItem: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  const [address, setAddress] = useState('no-address');
  const [loading, setLoading] = useState(false);

  const getTokenAccount = async () => {
    setLoading(true);
    try {
      const splTokenAddress = new PublicKey(SPL_TOKEN);
      const tokenAccount = await state.sdk?.getTokenAccount(splTokenAddress);
      console.log(tokenAccount);
      setAddress(tokenAccount!.toString());
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      showMessage({
        message: 'some error try again.',
        type: 'danger',
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    showMessage({
      message: 'address copied',
    });
  };

  useEffect(() => {
    getTokenAccount();
  }, []);

  const headerTitle = address
    ? `${address.slice(0, 5)}...${address.slice(-5)}`
    : '-';

  const goToLogin = () => {
    dispatch(setAccountStatus(AccountStatus.EXISITING));
  };

  if (loading) {
    return (
      <SolaceContainer>
        <SolaceLoader text="loading">
          <ActivityIndicator size="small" />
        </SolaceLoader>
      </SolaceContainer>
    );
  }

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        text={`recieve ${headerTitle}`}
        startClick={handleGoBack}
      />
      {address ? (
        <View style={globalStyles.fullCenter}>
          <View style={[globalStyles.rowCenter, {flex: 0.5}]}>
            <View style={{borderColor: 'white', borderWidth: 5}}>
              <QRCode value={address ?? 'no-address'} size={300} />
            </View>
          </View>
          <View style={[globalStyles.fullWidth, {flex: 0.5, paddingTop: 12}]}>
            <SolaceCustomInput
              placeholder="username or address"
              iconName="content-copy"
              handleIconPress={() => handleCopy(address)}
              value={address}
              iconType="mci"
            />
          </View>
        </View>
      ) : (
        <View style={globalStyles.fullCenter}>
          <View style={globalStyles.fullCenter}>
            <SolaceText>there was an error. please login again</SolaceText>
          </View>
          <SolaceButton onPress={goToLogin}>
            <SolaceText type="secondary" variant="black" weight="bold">
              Login
            </SolaceText>
          </SolaceButton>
        </View>
      )}
    </SolaceContainer>
  );
};

export default RecieveItem;
