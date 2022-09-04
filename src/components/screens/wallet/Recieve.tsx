/* eslint-disable react-hooks/exhaustive-deps */
import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import ContactItem from '../../wallet/ContactItem';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import globalStyles from '../../../utils/global_styles';
import Clipboard from '@react-native-community/clipboard';
import {showMessage} from 'react-native-flash-message';

export type Props = {
  navigation: any;
};

const RecieveScreen: React.FC<Props> = ({navigation}) => {
  const [address, setAddress] = useState('');

  const {state} = useContext(GlobalContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddContact');
  };

  const handleCopy = () => {
    Clipboard.setString(address);
    showMessage({
      message: 'address copied',
    });
  };

  const getAccounts = async () => {
    const sdk = state.sdk;
    // const data = sdk?.getTokenAccount();
    console.log({sdk});
    // constsdk?.getTokenAccountInfo();
  };

  useEffect(() => {
    getAccounts();
  }, []);

  // const contacts = state.contacts!;
  const contacts: any[] = [];
  const showContacts = contacts.length > 0;

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        // endIcon="plus"
        text="recieve"
        startClick={handleGoBack}
        // endClick={handleAdd}
      />
      <View style={globalStyles.fullCenter}>
        <View style={globalStyles.fullWidth}>
          <SolaceCustomInput
            placeholder="username or address"
            iconName="content-copy"
            handleIconPress={() => handleCopy()}
            value={address}
            iconType="mci"
          />
        </View>
        {/* <TouchableOpacity style={[globalStyles.rowCenter, {marginTop: 8}]}>
          <SolaceIcon name="gift" type="dark" />
          <SolaceText type="secondary" weight="bold" variant="normal">
            send a gift
          </SolaceText>
        </TouchableOpacity> */}
      </View>
      {/* {showContacts ? (
        <ScrollView bounces={true} style={{margin: 8}}>
          {contacts.map(contact => {
            return <ContactItem contact={contact} key={contact.username} />;
          })}
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <Image
            source={require('../../../../assets/images/solace/send-money.png')}
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
      )} */}
    </SolaceContainer>
  );
};

export default RecieveScreen;
