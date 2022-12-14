import React, {FC, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import SolaceText from './SolaceText';

type Props = {
  text: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const SolaceLoader: FC<Props> = ({text, children, style, ...textProps}) => {
  return (
    <View
      style={[
        {flex: 1, justifyContent: 'center', alignItems: 'center'},
        style || {},
      ]}>
      <SolaceText color="light" type="secondary" {...textProps}>
        {text}
      </SolaceText>
      {children}
    </View>
  );
};

export default SolaceLoader;
