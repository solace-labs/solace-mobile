import React, {FC, ReactNode} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import type {StyleProp, TouchableOpacityProps, ViewStyle} from 'react-native';
import {Colors} from '../../../utils/colors';

type Variant = keyof typeof Colors.background;

interface ButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
  fullWidth?: boolean;
  children?: ReactNode;
  loading?: boolean;
  mt?: number;
  mb?: number;
}

const SolaceButton: FC<ButtonProps> = ({
  style,
  children,
  fullWidth = true,
  variant = 'light',
  loading = false,
  mt = 0,
  mb = 0,
  ...touchableProps
}) => {
  const variantStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'dark': {
        return {backgroundColor: Colors.background.normal};
      }
      case 'normal': {
        return {backgroundColor: Colors.background.light};
      }
      default: {
        return {backgroundColor: Colors.background.lightest};
      }
    }
  };

  const fullWidthStyle = (): StyleProp<ViewStyle> => {
    return fullWidth ? {width: '100%'} : {};
  };

  const disabled = touchableProps.disabled as boolean;
  const disableColor = (disabled && '#fffa') as string;

  const defaultStyle: StyleProp<ViewStyle> = {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const marginStyles = {
    marginTop: mt,
    marginBottom: mb,
  };

  return (
    <TouchableOpacity
      style={[
        variantStyle(),
        fullWidthStyle(),
        marginStyles,
        defaultStyle,
        touchableProps.disabled ? {backgroundColor: disableColor} : {},
        style,
      ]}
      {...touchableProps}>
      {loading ? <ActivityIndicator size={24} color="black" /> : children}
    </TouchableOpacity>
  );
};

export default SolaceButton;
