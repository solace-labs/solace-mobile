import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceButton from '../../../common/solaceui/SolaceButton';
import SolaceText from '../../../common/solaceui/SolaceText';
import TopNavbar from '../../../common/TopNavbar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';
import GuardianCard from '../../../wallet/GuardianCard';
import SolaceLogo from '../../../common/svg/SolaceLogo';
import OtherWalletLogo from '../../../common/svg/OtherWalletLogo';
import CardOneSvg from '../../../common/svg/CardOneSvg';
import CardTwoSvg from '../../../common/svg/CardTwoSvg';
import {guardianStyles as styles} from '../../../wallet/GuardianSecondTab';
import Fontisto from 'react-native-vector-icons/Fontisto';
import globalStyles from '../../../../utils/global_styles';
import {Colors} from '../../../../utils/colors';

type ContactListScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'ContactList'
>;

const ContactList = () => {
  const navigation = useNavigation<ContactListScreenProps['navigation']>();

  const [active, setActive] = useState(2);

  const cards = [
    {
      id: 0,
      icon: <SolaceLogo color={active === 0 ? 'lightorange' : 'light'} />,
      backgroundIcon: (
        <CardOneSvg color={active === 0 ? 'lightorange' : 'normal'} />
      ),
      heading: 'other wallets',
      subHeading:
        'could be your other wallets like phantom, solflare etc aka multisig',
    },
    {
      id: 1,
      icon: <OtherWalletLogo color={active === 1 ? 'lightblue' : 'light'} />,
      backgroundIcon: (
        <CardTwoSvg color={active === 1 ? 'lightblue' : 'normal'} />
      ),
      heading: 'solace guardians',
      subHeading:
        'these can be people you trust with your funds. (solace users)',
    },
  ];

  const handleGoBack = () => {
    setActive(2);
    navigation.goBack();
  };

  const addToTrustedAddress = () => {
    navigation.navigate('AddTrustedAddress');
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="select a contact"
        startClick={handleGoBack}
        endIcon="infocirlceo"
        endClick={() => {
          navigation.navigate('GuardianInfo');
        }}
      />
      <View style={{marginTop: 20}}>
        <SolaceText type="secondary" color="normal" align="left" size="sm">
          trusted addresses do not require guardian approvals for transfers
        </SolaceText>
      </View>
      <View style={{marginTop: 20}}>
        <SolaceText
          color="lightorange"
          align="left"
          size="sm"
          weight="semibold">
          all contacts
        </SolaceText>
      </View>
      <ScrollView bounces={true}>
        <View style={{marginTop: 8}}>
          <TouchableOpacity style={styles.item} onPress={addToTrustedAddress}>
            <View style={styles.leftSide}>
              <View
                style={[
                  globalStyles.avatar,
                  {backgroundColor: Colors.background.lightblue},
                ]}>
                <SolaceText weight="bold" size="sm" color="dark">
                  as
                </SolaceText>
              </View>
              <View>
                <SolaceText
                  align="left"
                  type="secondary"
                  weight="bold"
                  size="sm">
                  ankit sethi
                </SolaceText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SolaceContainer>
  );
};

export default ContactList;
