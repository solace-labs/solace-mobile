import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useContext} from 'react';

import {GlobalContext} from '../../../state/contexts/GlobalContext';
import ContactItem from '../../wallet/ContactItem';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import TopNavbar from '../../common/TopNavbar';
import SolaceCustomInput from '../../common/solaceui/SolaceCustomInput';
import SolaceText from '../../common/solaceui/SolaceText';
import SolaceIcon from '../../common/solaceui/SolaceIcon';
import globalStyles from '../../../utils/global_styles';
import {PublicKey} from 'solace-sdk';
import {getFeePayer, confirmTransaction} from '../../../utils/apis';
import {LAMPORTS_PER_SOL} from '../../../utils/constants';
import {relayTransaction} from '../../../utils/relayer';

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

  const send = async () => {
    const sdk = state.sdk!;
    const feePayer = await getFeePayer();
    console.log({feePayer});
    if (!sdk) {
      return;
    }
    const splTokenAddress = new PublicKey(
      'DB6BcxUpHDSxEFpqDRjm98HTvX2JZapbBNN8RcR4K11z',
    );
    const reciever = new PublicKey(
      'GNgMfSSJ4NjSuu1EdHj94P6TzQS24KH38y1si2CMrUsF',
    );
    const recieverTokenAccount = await sdk.getAnyAssociatedTokenAccount(
      splTokenAddress,
      reciever,
    );
    const tx = await sdk.requestSplTransfer(
      {
        amount: 5 * LAMPORTS_PER_SOL,
        mint: splTokenAddress,
        reciever,
        recieverTokenAccount,
      },
      feePayer,
    );
    const response = await relayTransaction(tx);
    console.log(response);
    await confirmTransaction(response);

    const data = await sdk.fetchWalletData();
    console.log({data});
    console.log(data.ongoingTransfer.approvals);
  };

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
        <TouchableOpacity style={[globalStyles.rowCenter, {marginTop: 8}]}>
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
      )}
    </SolaceContainer>
  );
};

export default SendScreen;
