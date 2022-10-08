import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';
import {PublicKeyType} from '../screens/wallet/security/Guardian';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {minifyAddress} from '../../utils/helpers';
import {WalletStackParamList} from '../../navigation/Home/Home';

export type Contact = {
  id: string;
  name: string;
  username: string;
  address: string;
};

export type Props = {
  contact: PublicKeyType;
  asset: string;
};

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'Contact'
>;

const ContactItem: React.FC<Props> = ({contact, asset}) => {
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const imageText = contact.toString()[0];
  const address = minifyAddress(contact, 5);

  return (
    <View style={{marginVertical: 10}}>
      <TouchableOpacity
        style={globalStyles.rowCenter}
        onPress={() =>
          navigation.navigate('Send', {
            asset: asset.toString(),
            contact: contact.toString(),
          })
        }>
        <View style={globalStyles.avatar}>
          <SolaceText type="secondary" weight="bold">
            {imageText}
          </SolaceText>
        </View>
        <SolaceText size="sm" type="secondary" weight="bold" align="left">
          {address}
        </SolaceText>
      </TouchableOpacity>
    </View>
  );
};

export default ContactItem;
