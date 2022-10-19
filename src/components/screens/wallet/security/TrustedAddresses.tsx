import {View} from 'react-native';
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

type TrustedAddressesScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'TrustedAddresses'
>;

const TrustedAddresses = () => {
  const navigation = useNavigation<TrustedAddressesScreenProps['navigation']>();

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

  const goToContactList = () => {
    navigation.navigate('ContactList');
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="trusted addresses"
        startClick={handleGoBack}
        endIcon="infocirlceo"
        endClick={() => {
          navigation.navigate('GuardianInfo');
        }}
      />
      <View style={{flex: 1, marginTop: 8}}>
        {cards.map((card, index) => {
          return (
            <GuardianCard
              onPress={() => setActive(index)}
              key={card.heading}
              data={card}
              active={index === active}
            />
          );
        })}
      </View>
      <View>
        <SolaceButton
          onPress={goToContactList}
          background="purple"
          disabled={active === 2}>
          <SolaceText type="secondary" weight="bold" color="white">
            add a trusted address
          </SolaceText>
        </SolaceButton>
      </View>
    </SolaceContainer>
  );
};

export default TrustedAddresses;
