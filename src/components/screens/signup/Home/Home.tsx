import {View, Image} from 'react-native';
import React, {useContext} from 'react';
import styles from './styles';
import {
  AccountStatus,
  GlobalContext,
} from '../../../../state/contexts/GlobalContext';
import {setAccountStatus} from '../../../../state/actions/global';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';

export type Props = {
  navigation: any;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);
  return (
    <SolaceContainer>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} variant="white" size="xl" weight="semibold">
          solace
        </SolaceText>
      </View>
      <View style={styles.buttonContainer}>
        <SolaceButton onPress={() => navigation.navigate('Username')}>
          <SolaceText type="secondary" variant="dark" weight="bold">
            create new wallet
          </SolaceText>
        </SolaceButton>
        <SolaceButton
          mt={16}
          variant="dark"
          onPress={() => dispatch(setAccountStatus(AccountStatus.RETRIEVE))}>
          <SolaceText type="secondary" weight="bold">
            retrieve your wallet
          </SolaceText>
        </SolaceButton>
      </View>
    </SolaceContainer>
  );
};
export default HomeScreen;
