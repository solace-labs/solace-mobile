import {View, Image} from 'react-native';
import React, {useContext} from 'react';
import {
  AccountStatus,
  AppState,
  GlobalContext,
} from '../../../state/contexts/GlobalContext';
import {setAccountStatus} from '../../../state/actions/global';
import SolaceButton from '../../common/solaceui/SolaceButton';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import {StorageGetItem} from '../../../utils/storage';

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
          create new vault
        </SolaceText>
      </SolaceButton>
      <SolaceButton
        mt={16}
        variant="dark"
        onPress={async () => {
          const appState = await StorageGetItem('appstate');
          if (appState === AppState.TESTING) {
            dispatch(setAccountStatus(AccountStatus.RECOVERY));
          } else {
            dispatch(setAccountStatus(AccountStatus.RETRIEVE));
          }
        }}>
        <SolaceText type="secondary" weight="bold">
          retrieve your vault
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};
export default HomeScreen;
