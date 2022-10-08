/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Clipboard from '@react-native-community/clipboard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AccountStatus,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceText from '../../../common/solaceui/SolaceText';
import SolacePaper from '../../../common/solaceui/SolacePaper';
import SolaceIcon from '../../../common/solaceui/SolaceIcon';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import TopNavbar from '../../../common/TopNavbar';
import globalStyles from '../../../../utils/global_styles';
import {setAccountStatus} from '../../../../state/actions/global';
import {minifyAddress} from '../../../../utils/helpers';
import {Colors} from '../../../../utils/colors';
import {Styles} from '../../../../utils/styles';
import {SwapStackParamList} from '../../../../navigation/Home/Swap';
import SolaceCustomInput from '../../../common/solaceui/SolaceCustomInput';
import AccountItem from '../../../wallet/AccountItem';
import AssetItem from '../../../wallet/AssetItem';

const assets = [
  {
    name: 'solana',
    symbol: 'sol',
    amount: 20,
    amountInDollars: 20.3,
    changeInPrice: -10,
  },
  {
    name: 'usdc',
    symbol: 'usdc',
    amount: 120,
    amountInDollars: 120,
    changeInPrice: -1,
  },
  {
    name: 'serum',
    symbol: 'srm',
    amount: 0,
    amountInDollars: 0,
    changeInPrice: -0.01,
  },
  {
    name: 'raydium',
    symbol: 'ray',
    amount: 56.67,
    amountInDollars: 34.03,
    changeInPrice: 4.02,
  },
];

type TokenListScreenProps = NativeStackScreenProps<
  SwapStackParamList,
  'TokenListScreen'
>;

const TokenListScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<TokenListScreenProps['navigation']>();
  const [searchValue, setSearchValue] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    showMessage({
      message: 'address copied',
    });
  };

  const address = state.sdk?.wallet!?.toString();
  // const address = false;
  const headerTitle = address ? `${minifyAddress(address, 5)}` : '-';

  const goToLogin = () => {
    dispatch(setAccountStatus(AccountStatus.EXISITING));
  };

  // if (isLoading) {
  //   return (
  //     <SolaceContainer>
  //       <SolaceLoader text="loading">
  //         <ActivityIndicator size="small" />
  //       </SolaceLoader>
  //     </SolaceContainer>
  //   );
  // }

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        endIcon="infocirlceo"
        // text="swap tokens"
        startClick={handleGoBack}>
        <SolaceText size="lg" weight="semibold">
          {/* swap tokens */}
          token list
        </SolaceText>
      </TopNavbar>
      {address ? (
        <View style={globalStyles.fullCenter}>
          <View style={globalStyles.fullWidth}>
            <SolaceCustomInput
              value={searchValue}
              onChangeText={setSearchValue}
              iconName="search1"
              placeholder="search"
              style={{padding: 10}}
              shiftIconUp="xs"
            />
          </View>
          <ScrollView bounces={true} style={{width: '100%'}}>
            {assets.map((asset, index) => {
              return <AssetItem asset={asset} key={index} />;
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={globalStyles.fullCenter}>
          <View style={globalStyles.fullCenter}>
            <SolaceText>there was an error. please login again</SolaceText>
          </View>
          <SolaceButton onPress={goToLogin}>
            <SolaceText type="secondary" color="black" weight="bold">
              login
            </SolaceText>
          </SolaceButton>
        </View>
      )}
    </SolaceContainer>
  );
};

export default TokenListScreen;

const SwapCard = () => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (amt: string) => {
    if (amt.match(/^\d*\.?\d*$/)) {
      setAmount(amt);
    }
  };

  return (
    <View style={[globalStyles.rowSpaceBetween, globalStyles.fullWidth]}>
      <View style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <SolaceText size="xs" color="normal" type="secondary" mb={4}>
          you pay
        </SolaceText>
        <TouchableOpacity
          onPress={() => console.log('handle press')}
          style={globalStyles.rowCenter}>
          <Image
            source={require('../../../../../assets/images/solace/solana-icon.png')}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
              marginRight: 12,
            }}
          />
          <SolaceText weight="semibold">SOL</SolaceText>
          <AntDesign
            name="right"
            color={Colors.text.normal}
            style={{marginLeft: 12}}
          />
        </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
        {/* <SolaceText type="secondary" size="md">
          20.5
        </SolaceText> */}
        <TextInput
          value={amount}
          placeholder="0"
          keyboardType="decimal-pad"
          returnKeyType="done"
          placeholderTextColor={Colors.text.normal}
          style={{
            fontSize: Styles.fontSize.lg,
            color: Colors.text.white,
            fontFamily: Styles.fontFamily.secondary.bold.normal,
          }}
          onChangeText={text => handleAmountChange(text)}
        />
        <SolaceText type="secondary" size="sm" color="normal">
          $702.40
        </SolaceText>
      </View>
    </View>
  );
};
