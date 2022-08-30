import {View, TouchableOpacity, Image} from 'react-native';
import React, {useContext, useEffect} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import {getContact} from '../../../state/actions/global';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import WalletActivity from '../../wallet/WalletActivity';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import globalStyles from '../../../utils/global_styles';

export type Props = {
  navigation: any;
  route: any;
};

const ContactScreen: React.FC<Props> = ({route, navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  useEffect(() => {
    const id = route?.params?.id;
    dispatch(getContact(id));
  }, [dispatch, route?.params?.id]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar startIcon="back" text="" startClick={handleGoBack} />
      <View style={{flex: 1}}>
        <View style={[globalStyles.rowSpaceBetween, {marginTop: 20}]}>
          <SolaceText size="lg" weight="semibold">
            {state.contact ? state.contact?.name : 'john doe'}
          </SolaceText>
          <SolaceText type="secondary" variant="normal" weight="bold">
            edit
          </SolaceText>
        </View>
        <SolaceText align="left" mt={16}>
          select address
        </SolaceText>
        <View style={{marginTop: 20}}>
          <TouchableOpacity
            style={globalStyles.rowCenter}
            onPress={() => navigation.navigate('Asset')}>
            <View style={globalStyles.avatar}>
              <Image
                source={require('../../../../assets/images/solace/solana-icon.png')}
                style={{
                  width: 40,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <SolaceText
              size="md"
              type="secondary"
              weight="bold"
              variant="light">
              {state.contact ? state.contact.username : 'john.solace.money'}
            </SolaceText>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            // onPress={() => navigation.navigate('Contact', {id: contact.id})}>
          >
            <SolaceIcon name="plus" type="dark" />
            <SolaceText type="secondary" variant="normal" weight="bold">
              add address
            </SolaceText>
          </TouchableOpacity>
        </View>
      </View>
      <WalletActivity data={[]} />
    </SolaceContainer>
  );
};

export default ContactScreen;
