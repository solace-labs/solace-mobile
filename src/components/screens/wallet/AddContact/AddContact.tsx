import {View} from 'react-native';
import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {addNewContact} from '../../../../state/actions/global';
import {showMessage} from 'react-native-flash-message';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import TopNavbar from '../../../common/TopNavbar/TopNavbar';
import SolaceInput from '../../../common/SolaceUI/SolaceInput/SolaceInput';
import SolaceCustomInput from '../../../common/SolaceUI/SolaceCustomInput/SolaceCustomInput';

export type Props = {
  navigation: any;
};

const AddContactScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const {dispatch} = useContext(GlobalContext);

  const addContact = () => {
    if (name && address) {
      const newContact = {
        id: new Date().getTime().toString() + Math.random().toString(),
        name,
        address,
        username: `${name.split(' ')[0]}.solace.money`,
      };
      dispatch(addNewContact(newContact));
      navigation.navigate('Send');
    } else {
      showMessage({
        message: 'Please enter all the details',
        type: 'info',
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        text="save contact"
        startClick={handleGoBack}
      />
      <View style={{flex: 1, marginTop: 16}}>
        <SolaceInput
          mb={16}
          value={name}
          onChangeText={setName}
          placeholder="name"
        />
        <SolaceCustomInput
          iconName="line-scan"
          placeholder="address"
          iconType="mci"
          value={address}
          onChangeText={setAddress}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <SolaceText type="secondary" weight="bold" variant="normal">
            network
          </SolaceText>
          <SolaceText type="secondary" weight="bold" variant="solana-green">
            solana
          </SolaceText>
        </View>
      </View>
      <SolaceButton
        onPress={addContact}
        // loading={loading.value}
        disabled={!address || !name}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          save contact
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AddContactScreen;
