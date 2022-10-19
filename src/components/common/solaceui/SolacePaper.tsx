import React, {FC, ReactNode} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {Colors} from '../../../utils/colors';
import {Styles} from '../../../utils/styles';

type Variant = keyof typeof Colors.background;

interface PaperProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  background?: Variant;
  fullWidth?: boolean;
  children?: ReactNode;
  loading?: boolean;
  size?: keyof typeof Styles.fontSize;
  mt?: number;
  mb?: number;
}

const SolacePaper: FC<PaperProps> = ({
  style,
  children,
  fullWidth = true,
  background = 'card',
  loading = false,
  size = 'md',
  mt = 0,
  mb = 0,
  ...touchableProps
}) => {
  const variantStyle = (): StyleProp<ViewStyle> => {
    return {backgroundColor: Colors.background[background]};
  };

  const fullWidthStyle = (): StyleProp<ViewStyle> => {
    return fullWidth ? {width: '100%'} : {};
  };

  // const disabled = touchableProps.disabled as boolean;
  // const disableColor = (disabled && '#8a8a8a') as string;

  const defaultStyle: StyleProp<ViewStyle> = {
    padding: Styles.fontSize[size] * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.background.dark,
    borderRadius: 12,
  };

  const marginStyles = {
    marginTop: mt,
    marginBottom: mb,
  };

  return (
    <View
      style={[
        variantStyle(),
        fullWidthStyle(),
        marginStyles,
        defaultStyle,
        // touchableProps.disabled ? {backgroundColor: disableColor} : {},
        style,
      ]}
      {...touchableProps}>
      {loading ? <ActivityIndicator size={24} color="black" /> : children}
    </View>
  );
};

export default SolacePaper;
