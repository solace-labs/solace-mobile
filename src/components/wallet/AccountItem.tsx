import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {Account} from '../screens/wallet/Recieve';
import SolaceButton from '../common/solaceui/SolaceButton';
import {Colors} from '../../utils/colors';
import Modal from 'react-native-modal';

export type Props = {
  account: Account;
  type: 'send' | 'recieve';
};

const AccountItem: React.FC<Props> = ({
  account: {tokenAddress, amount},
  type,
}) => {
  const navigation: any = useNavigation();
  // const [modalVisible, setModalVisible] = useState(false);

  const accountAddress =
    tokenAddress.slice(0, 5) + '...' + tokenAddress.slice(-5);
  const currentBalance = amount.toFixed(2);

  const redirectToAsset = () => {
    if (type === 'send') {
      // setModalVisible(true);
      navigation.navigate('Contact', {asset: tokenAddress.toString()});
    } else if (type === 'recieve') {
      navigation.navigate('RecieveItem');
    }
  };

  return (
    <View
      style={{
        marginVertical: 10,
      }}>
      {/* <Modal
        style={{borderColor: 'white', borderWidth: 1, marginTop: 200}}
        hasBackdrop={false}
        swipeDirection="down"
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        isVisible={modalVisible}>
        <View
          style={[
            globalStyles.fullCenter,
            {
              marginTop: 100,
              padding: 20,
              backgroundColor: Colors.background.darkest,
            },
          ]}>
          <View style={{flex: 1}}>
            <SolaceText>Hellw World</SolaceText>
          </View>
          <SolaceButton
            variant="dark"
            onPress={() => setModalVisible(!modalVisible)}>
            <SolaceText variant="white">Hide</SolaceText>
          </SolaceButton>
        </View>
      </Modal> */}
      <TouchableOpacity
        style={[globalStyles.rowSpaceBetween]}
        onPress={redirectToAsset}>
        <View style={globalStyles.rowCenter}>
          <View style={globalStyles.avatar}>
            <SolaceText type="secondary" weight="bold">
              {tokenAddress[0]}
            </SolaceText>
          </View>
          <View>
            <SolaceText weight="bold" align="left">
              unknown token
            </SolaceText>
            <SolaceText
              size="sm"
              mt={8}
              type="secondary"
              weight="bold"
              align="left">
              {currentBalance} {accountAddress}
            </SolaceText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // / backgroundColor: 'red',
    borderRadius: 40,
    backgroundColor: Colors.background.darkest,
    marginTop: 80,
  },
  modalView: {
    flex: 0.5,
    backgroundColor: Colors.background.normal,
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AccountItem;
