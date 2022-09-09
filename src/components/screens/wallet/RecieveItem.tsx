/* eslint-disable react-hooks/exhaustive-deps */
import {View, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';
import {PublicKey} from 'solace-sdk';
import QRCode from 'react-native-qrcode-svg';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {setAccountStatus} from '../../../state/actions/global';

export type Props = {
  navigation: any;
  route: any;
};

export type Account = {
  amount: number;
  tokenAddress: string;
};

const RecieveItem: React.FC<Props> = ({route, navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  const spltoken = route.params.token;
  const [address, setAddress] = useState(state.sdk?.wallet!?.toString());
  const [addressToken, setAddressToken] = useState('');
  const [loading, setLoading] = useState(false);

  const getTokenAccount = async () => {
    setLoading(true);
    try {
      const splTokenAddress = new PublicKey(spltoken);
      const tokenAccount = await state.sdk?.getTokenAccount(splTokenAddress);
      console.log(setAddressToken);
      setAddressToken(tokenAccount!.toString());
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
              <QRCode
                value={addressToken ? addressToken : 'no-address'}
                size={300}
              />
            </View>
          </View>
          <View style={[globalStyles.fullWidth, {flex: 0.5, paddingTop: 12}]}>
            <SolaceText mt={10} mb={10} type="secondary" weight="bold">
              token address
            </SolaceText>
            <SolaceCustomInput
              placeholder="username or address"
              iconName="content-copy"
              handleIconPress={() => handleCopy(address)}
              value={addressToken}
              iconType="mci"
            />
            <SolaceText mt={20} mb={10} type="secondary" weight="bold">
              wallet address
            </SolaceText>
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
