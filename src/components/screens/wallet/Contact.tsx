/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import {PublicKeyType} from './Guardian';
import ContactItem from '../../wallet/ContactItem';
import WalletActivity from '../../wallet/WalletActivity';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {Colors} from '../../../utils/colors';
import {useNavigation} from '@react-navigation/native';

export type Props = {
  route: any;
};

const ContactScreen: React.FC<Props> = () => {
  const navigation: any = useNavigation();
  const initialState = {message: '', value: false};
  const {state} = useContext(GlobalContext);
  const [contacts, setContacts] = useState<PublicKeyType[]>([]);
  const [loading, setLoading] = useState(initialState);
  const navState = navigation.getState();
  const params = navState.routes.find((route: any) => route.name === 'Contact')
    ?.params as any;
  const asset = params.asset;

  // useEffect(() => {
  //   const id = route?.params?.id;
  //   dispatch(getContact(id));
  // }, [dispatch, route?.params?.id]);

  const getContacts = async () => {
    setLoading({message: 'getting trusted contacts...', value: true});
    try {
      const walletData = await state.sdk?.fetchWalletData();
      console.log('Trusted Wallet: ', walletData!.trustedPubkeys);
      // setContacts(walletData!.trustedPubkeys);
      setContacts(walletData?.trustedPubkeys!);
      setLoading(initialState);
    } catch (e: any) {
      setLoading(initialState);
      console.log('Error: ', e);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddContact');
  };

  const handleRefresh = async () => {
    await getContacts();
  };

  const sendToUntrusted = () => {
    navigation.navigate('Asset', {asset: asset.toString()});
  };

  if (loading.value) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="back"
          endIcon="plus"
          text="trusted contacts"
          startClick={handleGoBack}
          endClick={handleAdd}
        />
        <SolaceLoader text={loading.message}>
          <ActivityIndicator size="small" />
        </SolaceLoader>
        {/* <WalletActivity data={[]} /> */}
      </SolaceContainer>
    );
  }

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        text="trusted contacts"
        endIcon="plus"
        endClick={handleAdd}
        startClick={handleGoBack}
      />
      <View style={globalStyles.fullCenter}>
        {contacts && contacts.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading.value}
                onRefresh={handleRefresh}
              />
            }
            bounces={true}
            style={{marginTop: -50, width: '100%'}}>
            <View
              style={[
                globalStyles.rowCenter,
                {justifyContent: 'center', marginBottom: 20},
              ]}>
              <SolaceText size="sm" weight="extralight">
                pull to refresh
              </SolaceText>
              <SolaceIcon type="dark" name="down" />
            </View>
            <TouchableOpacity onPress={sendToUntrusted}>
              <SolaceText
                size="sm"
                type="secondary"
                variant="normal"
                weight="bold"
                mb={8}
                style={{
                  textDecorationLine: 'underline',
                  textDecorationColor: Colors.background.light,
                  textDecorationStyle: 'solid',
                }}>
                send to untrusted wallet?
              </SolaceText>
            </TouchableOpacity>
            {contacts.map((contact, index) => {
              return (
                <ContactItem contact={contact} key={index} asset={asset} />
              );
            })}
          </ScrollView>
        ) : (
          <View style={{flex: 1, width: '100%'}}>
            <Image
              source={require('../../../../assets/images/solace/send-money.png')}
              style={globalStyles.image}
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
              to send
            </SolaceText>
          </View>
        )}
      </View>
      {/* <WalletActivity data={[]} /> */}
    </SolaceContainer>
  );
};

export default ContactScreen;
