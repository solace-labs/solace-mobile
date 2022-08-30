import React, {FC} from 'react';
import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import globalStyles from '../../utils/global_styles';
import SolaceText from '../common/solaceui/SolaceText/SolaceText';
import {DATA} from '../screens/wallet/WalletHome';
import Transaction from './Transaction';

type Props = {
  data: typeof DATA;
};

const WalletActivity: FC<Props> = ({data}) => {
  if (data.length > 0) {
    return (
      <ScrollView>
        {data.map((item: any) => {
          return <Transaction key={item.id} item={item} />;
        })}
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={globalStyles.rowSpaceBetween}>
        <SolaceText weight="semibold" size="lg">
          wallet activity
        </SolaceText>
        <TouchableOpacity>
          {/* see more */}
          <SolaceText
            type="secondary"
            variant="normal"
            style={{fontSize: 14}}
            weight="bold">
            unavailable
          </SolaceText>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../../assets/images/solace/contact-screen.png')}
        style={{
          width: '100%',
          height: 220,
          resizeMode: 'contain',
        }}
      />
      <SolaceText type="secondary" size="sm" mb={16}>
        visit{' '}
        <SolaceText
          type="secondary"
          size="sm"
          variant="white"
          style={{textDecorationLine: 'underline'}}
          weight="bold">
          solscan
        </SolaceText>{' '}
        to view your transaction history
      </SolaceText>
    </View>
  );
};

export default WalletActivity;
