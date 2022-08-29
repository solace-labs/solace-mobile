import React, {FC} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Colors} from '../../../utils/colors';

type Props = {
  isFilled: boolean;
};

const PasscodeDot: FC<Props> = ({isFilled}) => {
  const passcodeStyle: StyleProp<ViewStyle> = {
    width: 14,
    height: 14,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isFilled
      ? Colors.background.lightest
      : Colors.background.light,
  };

  return <View style={[passcodeStyle]} />;
};

export default PasscodeDot;
