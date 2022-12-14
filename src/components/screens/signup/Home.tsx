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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SignUpStackParamList} from '../../../navigation/SignUp';
import {useNavigation} from '@react-navigation/native';

type SignUpScreenProps = NativeStackScreenProps<SignUpStackParamList, 'Home'>;

const HomeScreen = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const navigation = useNavigation<SignUpScreenProps['navigation']>();

  return (
    <SolaceContainer>
      <View style={globalStyles.fullCenter}>
        <Image
          source={require('../../../../assets/images/solace/solace-icon.png')}
        />
        <SolaceText mt={16} color="white" size="xl" weight="semibold">
          solace
        </SolaceText>
      </View>
      <SolaceButton
        background="purple"
        onPress={() => navigation.navigate('Email')}>
        <SolaceText type="secondary" color="white" weight="bold">
          create new vault
        </SolaceText>
      </SolaceButton>
      <SolaceButton
        background="light"
        onPress={async () => {
          const appState = await StorageGetItem('appstate');
          if (appState === AppState.TESTING) {
            dispatch(setAccountStatus(AccountStatus.RECOVERY));
          } else {
            dispatch(setAccountStatus(AccountStatus.RETRIEVE));
          }
        }}>
        <SolaceText type="secondary" weight="bold" color="dark">
          retrieve your vault
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};
export default HomeScreen;
