import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import SolaceContainer from '../../../common/SolaceUI/SolaceContainer/SolaceContainer';
import SolaceButton from '../../../common/SolaceUI/SolaceButton/SolaceButton';
import SolaceText from '../../../common/SolaceUI/SolaceText/SolaceText';
import TopNavbar from '../../../common/TopNavbar/TopNavbar';

export type Props = {
  navigation: any;
};

const AssetScreen: React.FC<Props> = ({navigation}) => {
  const [amount, setAmount] = useState('0');
  const {dispatch} = useContext(GlobalContext);
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SolaceContainer>
      <TopNavbar
        startIcon="back"
        text="select an asset"
        startClick={handleGoBack}
      />
      <View style={{flex: 1}}>
        <View style={styles.row}>
          <SolaceText size="3xl" weight="semibold">
            SOL
          </SolaceText>
          <TextInput
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            value={amount}
            keyboardType="decimal-pad"
            onChangeText={setAmount}
            style={styles.assetAmount}
            placeholderTextColor="#9999a5"
            placeholder="0"
          />
        </View>
        <View style={[styles.row, {marginTop: 10}]}>
          <SolaceText type="secondary" variant="normal" weight="bold">
            30.2 SOL available
          </SolaceText>
          <SolaceText type="secondary" variant="normal" weight="bold">
            $600.2
          </SolaceText>
        </View>
        <View style={[styles.row, {marginTop: 10, justifyContent: 'flex-end'}]}>
          <TouchableOpacity>
            <SolaceText type="secondary">use max</SolaceText>
          </TouchableOpacity>
        </View>
      </View>
      <SolaceButton
        // onPress={addGuardian}
        // loading={}
        disabled={!amount}>
        <SolaceText type="secondary" weight="bold" variant="dark">
          send
        </SolaceText>
      </SolaceButton>
    </SolaceContainer>
  );
};

export default AssetScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetAmount: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
  },
});
