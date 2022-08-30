import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import SolaceText from '../../common/SolaceUI/SolaceText/SolaceText';
import {DATA} from '../../screens/wallet/WalletHome/WalletHome';
import Transaction from '../Transaction/Transaction';

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
    <View style={styles.container}>
      <View style={styles.header}>
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
        source={require('../../../../assets/images/solace/contact-screen.png')}
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});