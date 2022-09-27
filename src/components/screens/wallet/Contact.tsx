/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useContext} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import ContactItem from '../../wallet/ContactItem';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import SolaceLoader from '../../common/solaceui/SolaceLoader';
import {Colors} from '../../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRefreshOnFocus} from '../../../hooks/useRefreshOnFocus';
import {getContacts} from '../../../apis/sdk';
import {WalletStackParamList} from '../../../navigation/Wallet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type WalletScreenProps = NativeStackScreenProps<
  WalletStackParamList,
  'Contact'
>;
const ContactScreen = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<WalletScreenProps['navigation']>();
  const {
    params: {asset},
  } = useRoute<WalletScreenProps['route']>();

  const {
    data: contacts,
    isLoading,
    isFetching,
  } = useQuery(['contacts'], () => getContacts(state?.sdk!), {
    enabled: !!state?.sdk,
  });

  const queryClient = useQueryClient();
  const refresh = async () => {
    isLoading &&
      isFetching &&
      (await queryClient.invalidateQueries(['contacts']));
  };

  useRefreshOnFocus(refresh);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddContact');
  };

  const sendToUntrusted = () => {
    navigation.navigate('Asset', {asset: asset.toString(), contact: ''});
  };

  if (isLoading) {
    return (
      <SolaceContainer>
        <TopNavbar
          startIcon="ios-return-up-back"
          startIconType="ionicons"
          endIcon="plus"
          text="trusted contacts"
          startClick={handleGoBack}
          endClick={handleAdd}
        />
        <SolaceLoader text="getting trusted contacts...">
          <ActivityIndicator size="small" />
        </SolaceLoader>
        {/* <WalletActivity data={[]} /> */}
      </SolaceContainer>
    );
  }

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="ios-return-up-back"
        startIconType="ionicons"
        fetching={isFetching}
        text="trusted contacts"
        endIcon="plus"
        endClick={handleAdd}
        startClick={handleGoBack}
      />
      <View style={globalStyles.fullCenter}>
        {contacts && contacts.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refresh} />
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
            <TouchableOpacity onPress={sendToUntrusted} style={{marginTop: 20}}>
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
          </View>
        )}
      </View>
      {/* <WalletActivity data={[]} /> */}
    </SolaceContainer>
  );
};

export default ContactScreen;
