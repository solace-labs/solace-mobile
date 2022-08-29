import React, {FC} from 'react';
import {View} from 'react-native';
import SolaceText from '../SolaceText/SolaceText';

type Props = {
  text: string;
};

const SolaceLoader: FC<Props> = ({text}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <SolaceText variant="normal" type="secondary">
        {text}
      </SolaceText>
    </View>
  );
};

export default SolaceLoader;
