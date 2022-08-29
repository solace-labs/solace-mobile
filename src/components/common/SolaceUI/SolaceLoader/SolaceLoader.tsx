import React, {FC, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import SolaceText, {SolaceTextProps} from '../SolaceText/SolaceText';

type Props = {
  text: string;
  children: ReactNode;
  style: StyleProp<ViewStyle>;
};

const SolaceLoader: FC<Props> = ({text, children, style, ...textProps}) => {
  return (
    <View
      style={[
        {flex: 1, justifyContent: 'center', alignItems: 'center'},
        style,
      ]}>
      <SolaceText variant="normal" type="secondary" {...textProps}>
        {text}
        {children}
      </SolaceText>
    </View>
  );
};

export default SolaceLoader;
