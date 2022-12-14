/* eslint-disable react-hooks/exhaustive-deps */
import {View, Image, TouchableOpacity, TextInput} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

type SwapScreenProps = NativeStackScreenProps<SwapStackParamList, 'SwapScreen'>;

const SwapScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<SwapScreenProps['navigation']>();

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
        // startIcon="ios-return-up-back"
        // startIconType="ionicons"
        endIcon="infocirlceo"
        // text="swap tokens"
        // startClick={handleGoBack}
      >
        <SolaceText size="lg" weight="semibold">
          swap tokens
        </SolaceText>
      </TopNavbar>
      {address ? (
        <View style={globalStyles.fullCenter}>
          <View
            style={[
              globalStyles.fullWidth,
              globalStyles.rowCenter,
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: 24,
              },
            ]}>
            <View
              style={[
                globalStyles.fullWidth,
                {
                  height: 150,
                  position: 'relative',
                },
              ]}>
              <SolacePaper
                style={{
                  height: 75,
                  borderBottomEndRadius: 0,
                  borderBottomStartRadius: 0,
                  zIndex: 10,
                }}>
                <SwapCard />
              </SolacePaper>
              <SolacePaper
                style={{
                  height: 75,
                  borderTopEndRadius: 0,
                  borderTopStartRadius: 0,
                  borderTopWidth: 1,
                  borderTopColor: Colors.background.dark,
                  width: '100%',
                  zIndex: 10,
                }}>
                <SwapCard />
              </SolacePaper>
              <View
                style={{
                  zIndex: 30,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: [{translateX: -20}, {translateY: -20}],
                }}>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.background.lightpink,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      width: 40,
                      height: 40,
                    }}>
                    <MaterialIcons
                      name="swap-vert"
                      style={{
                        color: Colors.text.purple,
                        fontSize: 24,
                        padding: 2,
                        overflow: 'hidden',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={[globalStyles.rowSpaceBetween, {marginTop: 12}]}>
                <View style={globalStyles.rowCenter}>
                  <Entypo
                    name="wallet"
                    size={20}
                    color={Colors.text.normal}
                    style={{marginRight: 10}}
                  />
                  <SolaceText type="secondary" color="normal" weight="bold">
                    balance
                  </SolaceText>
                  <SolaceText
                    type="secondary"
                    color="white"
                    weight="bold"
                    style={{marginLeft: 10}}>
                    123
                  </SolaceText>
                </View>
                <TouchableOpacity>
                  <SolaceText type="secondary" color="lightpink" weight="bold">
                    use max
                  </SolaceText>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
          <SolaceButton
            background="purple"
            // mb={12}
            onPress={() => navigation.navigate('SwapPreviewScreen')}>
            <SolaceText weight="bold" type="secondary">
              preview swap
            </SolaceText>
          </SolaceButton>
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

export default SwapScreen;

const SwapCard = () => {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation<SwapScreenProps['navigation']>();

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
          onPress={() => navigation.navigate('TokenListScreen')}
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
