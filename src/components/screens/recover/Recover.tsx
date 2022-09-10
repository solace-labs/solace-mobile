import {View, Image, StyleProp, ImageStyle} from 'react-native';
import React, {useContext, useEffect} from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import Header from '../../common/Header';
import SolaceText from '../../common/solaceui/SolaceText';
import {StorageGetItem} from '../../../utils/storage';
import {
  AccountStatus,
  GlobalContext,
  User,
} from '../../../state/contexts/GlobalContext';
import {KeyPair, SolaceSDK} from 'solace-sdk';
import {NETWORK, PROGRAM_ADDRESS} from '../../../utils/constants';
import {setAccountStatus} from '../../../state/actions/global';
export type Props = {
  navigation: any;
};

const RecoverScreen: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  const imageStyle: StyleProp<ImageStyle> = {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  };

  const checkWalletRecovered = async () => {
    const storedUser: User = await StorageGetItem('user');
    const privateKey = storedUser.ownerPrivateKey! as string;
    const solaceName = storedUser.solaceName!;
    const keypair = KeyPair.fromSecretKey(
      Uint8Array.from(privateKey.split(',').map(e => +e)),
    );
    const sdk = await SolaceSDK.retrieveFromName(solaceName, {
      network: NETWORK,
      owner: keypair,
      programAddress: PROGRAM_ADDRESS,
    });
    const res = await sdk.fetchWalletData();
    if (
      res.owner.toString() === keypair.publicKey.toString() &&
      !res.recoveryMode
    ) {
      dispatch(setAccountStatus(AccountStatus.SIGNED_UP));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkWalletRecovered();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <Header
          heading="recovering your vault"
          subHeading="please request your guardians to approve your solace vault recovery. in the mean time, your funds will be protected by the"
        />
        <SolaceText type="secondary" weight="bold" align="left">
          safe mode
        </SolaceText>
        <Image
          source={require('../../../../assets/images/solace/secrurity.png')}
          style={imageStyle}
        />
      </View>
    </SolaceContainer>
  );
};

export default RecoverScreen;
