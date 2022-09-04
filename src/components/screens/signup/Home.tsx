import {View, Image} from 'react-native';
import React, {useContext} from 'react';
import {
  AccountStatus,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {setAccountStatus} from '../../../state/actions/global';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';

export type Props = {
  navigation: any;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {state, dispatch} = useContext(GlobalContext);

  return (
    <SolaceContainer>
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} variant="white" size="xl" weight="semibold">
          solace
        </SolaceText>
      </View>
      <SolaceButton onPress={() => navigation.navigate('Email')}>
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
    </SolaceContainer>
  );
};
export default HomeScreen;
