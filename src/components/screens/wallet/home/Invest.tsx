import {View} from 'react-native';
import React from 'react';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {WalletStackParamList} from '../../../../navigation/Home/Home';
import InvestCard from '../../../wallet/InvestCard';

type InvestScreenProps = NativeStackScreenProps<WalletStackParamList, 'Invest'>;

const Invest = () => {
  const navigation = useNavigation<InvestScreenProps['navigation']>();

  const cards = [
    {
      id: 0,
      heading: 'solend',
      subHeading: 'decentralized protocol for lending and borrowing',
      image: require('../../../../../assets/images/solace/solend.png'),
      url: 'https://solend.fi/dashboard',
    },
    {
      id: 1,
      heading: 'raydium',
      subHeading: 'shared liquidity and new features for earning yield',
      image: require('../../../../../assets/images/solace/raydium.png'),
      url: 'https://raydium.io/farms/',
    },
    {
      id: 2,
      heading: 'jet protocol',
      subHeading: 'decentralized lending and borrowing',
      image: require('../../../../../assets/images/solace/jet_protocol.png'),
      url: 'https://app.jetprotocol.io/',
    },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        text="invest"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 8}}>
        {cards.map(card => {
          return <InvestCard key={card.heading} data={card} />;
        })}
      </View>
    </SolaceContainer>
  );
};

export default Invest;
