import {View, Image, ActivityIndicator} from 'react-native';
import React, {useContext} from 'react';
import SolaceContainer from '../../common/solaceui/SolaceContainer';
import SolaceText from '../../common/solaceui/SolaceText';
import globalStyles from '../../../utils/global_styles';
import {GlobalContext, StatusEnum} from '../../../state/contexts/GlobalContext';

const Loading = () => {
  const {state} = useContext(GlobalContext);

  const {progress, status} = state.updateStatus!;

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
      <View style={{flex: 1, alignItems: 'center'}}>
        <SolaceText>{status.split('_').join(' ').toLowerCase()}...</SolaceText>
        {status === StatusEnum.DOWNLOADING_PACKAGE && (
          <SolaceText mt={2} mb={2}>
            {progress}
          </SolaceText>
        )}
        <ActivityIndicator size="small" style={{marginTop: 10}} />
      </View>
    </SolaceContainer>
  );
};
export default Loading;
