import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SolaceText from '../common/solaceui/SolaceText';
import globalStyles from '../../utils/global_styles';

export type Contact = {
  id: string;
  name: string;
  username: string;
  address: string;
};

export type Props = {
  contact: Contact;
};

const ContactItem: React.FC<Props> = ({contact}) => {
  const navigation: any = useNavigation();
  const imageText = contact.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toLowerCase();

  return (
    <View style={{marginVertical: 10}}>
      <TouchableOpacity
        style={globalStyles.rowCenter}
        onPress={() => navigation.navigate('Contact', {id: contact.id})}>
        <View style={globalStyles.avatar}>
          <SolaceText type="secondary" weight="bold">
            {imageText}
          </SolaceText>
        </View>
        <SolaceText size="sm" type="secondary" weight="bold" align="left">
          {contact.name}
        </SolaceText>
      </TouchableOpacity>
    </View>
  );
};

export default ContactItem;
