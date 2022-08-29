import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import {showMessage} from 'react-native-flash-message';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import PasscodeContainer, {
  PASSCODE_LENGTH,
} from '../../../common/PasscodeContainer/PasscodeContainer';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';

export type Props = {
  navigation: any;
};

const ConfirmPasscodeScreen: React.FC<Props> = ({navigation}) => {
  const [code, setCode] = useState('');
  const {state} = useContext(GlobalContext);

  const filled = code.length === PASSCODE_LENGTH;

  const confirmPin = () => {
    if (filled && state.user && state.user.pin === code) {
      navigation.navigate('Login');
    } else {
      showMessage({
        message: 'Passcode did not match',
        type: 'danger',
      });
    }
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <SolaceText variant="white" size="lg" weight="semibold" align="center">
          re-enter the same passcode
        </SolaceText>
        <PasscodeContainer code={code} setCode={setCode} />
      </View>
      <SolaceButton
        disabled={!filled}
        onPress={() => {
          confirmPin();
        }}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          next
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default ConfirmPasscodeScreen;
