import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {getContact} from '../../../../state/actions/global';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import TopNavbar from '../../../common/TopNavbar/TopNavbar';
import WalletActivity from '../../../wallet/WalletActivity/WalletActivity';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import SolaceIcon from '../../../common/SolaceUI/SolaceIcon/SolaceIcon';
import globalStyles from '../../../../utils/global_styles';

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
        <View style={styles.subHeadingContainer}>
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
        <View style={styles.container}>
          <TouchableOpacity
            style={globalStyles.rowCenter}
            onPress={() => navigation.navigate('Asset')}>
            <View style={globalStyles.avatar}>
              <Image
                source={require('../../../../../assets/images/solace/solana-icon.png')}
                style={styles.image}
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
        <View style={[styles.container, {marginTop: 10}]}>
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

const styles = StyleSheet.create({
  subHeadingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    marginTop: 20,
  },
  image: {
    width: 40,
    resizeMode: 'contain',
  },
});
