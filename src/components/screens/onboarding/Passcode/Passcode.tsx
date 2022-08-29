import {View} from 'react-native';
import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {setUser} from '../../../../state/actions/global';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import PasscodeContainer, {
  PASSCODE_LENGTH,
} from '../../../common/PasscodeContainer/PasscodeContainer';

export type Props = {
  navigation: any;
};

const PasscodeScreen: React.FC<Props> = ({navigation}) => {
  const [code, setCode] = useState('');
  const {state, dispatch} = useContext(GlobalContext);

  const filled = code.length === PASSCODE_LENGTH;

  const checkPinReady = () => {
    if (filled) {
      dispatch(setUser({...state.user, pin: code}));
      navigation.navigate('ConfirmPasscode');
    }
  };

  return (
    <SolaceContainer>
      <View style={{flex: 1}}>
        <SolaceText variant="white" size="lg" weight="semibold" align="center">
          choose a passcode to protect your wallet on this device
        </SolaceText>
        <PasscodeContainer code={code} setCode={setCode} />
      </View>
      <SolaceButton
        disabled={!filled}
        onPress={() => {
          checkPinReady();
        }}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          next
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default PasscodeScreen;
