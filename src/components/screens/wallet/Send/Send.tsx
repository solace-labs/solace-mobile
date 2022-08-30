import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import ContactItem from '../../../wallet/ContactItem/ContactItem';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar/TopNavbar';
import SolaceCustomInput from '../../../common/SolaceUI/SolaceCustomInput/SolaceCustomInput';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import SolaceIcon from '../../../common/SolaceUI/SolaceIcon/SolaceIcon';

export type Props = {
  navigation: any;
};

const SendScreen: React.FC<Props> = ({navigation}) => {
  const {state} = useContext(GlobalContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddContact');
  };

  const contacts = state.contacts!;
  const showContacts = contacts.length > 0;

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        endIcon="plus"
        text="send"
        startClick={handleGoBack}
        endClick={handleAdd}
      />
      <View style={{marginTop: 8}}>
        <SolaceCustomInput
          placeholder="username or address"
          iconName="search1"
        />
        <TouchableOpacity style={styles.sendGiftContainer}>
          <SolaceIcon name="gift" type="dark" />
          <SolaceText type="secondary" weight="bold" variant="normal">
            send a gift
          </SolaceText>
        </TouchableOpacity>
      </View>
      {showContacts ? (
        <ScrollView bounces={true} style={{margin: 8}}>
          {contacts.map(contact => {
            return <ContactItem contact={contact} key={contact.username} />;
          })}
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <Image
            source={require('../../../../../assets/images/solace/send-money.png')}
            style={{
              width: '100%',
              height: 240,
              resizeMode: 'contain',
            }}
          />
          <SolaceText type="secondary" size="sm">
            <SolaceText
              onPress={handleAdd}
              type="secondary"
              size="sm"
              variant="white"
              style={{textDecorationLine: 'underline'}}
              weight="bold">
              add a contact
            </SolaceText>{' '}
            to send to solace or solana addresses
          </SolaceText>
        </View>
      )}
    </SolaceContainer>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  sendGiftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
