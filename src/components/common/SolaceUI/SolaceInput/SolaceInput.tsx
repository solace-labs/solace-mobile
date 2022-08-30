import React, {FC, ReactNode, RefObject, useState} from 'react';
import {TextInput, TextInputProps, TextStyle} from 'react-native';
import type {StyleProp} from 'react-native';
import {Colors} from '../../../../utils/colors';
import {Styles} from '../../../../utils/styles';

export interface SolaceInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  variant?: 'dark' | 'normal' | 'light';
  fullWidth?: boolean;
  hidden?: boolean;
  mt?: number;
  forwardRef?: RefObject<TextInput>;
  mb?: number;
}

const SolaceInput: FC<SolaceInputProps> = ({
  style,
  fullWidth = true,
  variant = 'light',
  hidden = false,
  mt = 0,
  mb = 0,
  forwardRef,
  ...inputProps
}) => {
  const [focusStyle, setFocusStyle] = useState<StyleProp<TextStyle>>({});

  const variantStyle = (): StyleProp<TextStyle> => {
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

  const fullWidthStyle = (): StyleProp<TextStyle> => {
    return fullWidth ? {width: '100%'} : {};
  };

  const marginStyles = {
    marginTop: mt,
    marginBottom: mb,
  };

  const defaultStyle: StyleProp<TextStyle> = {
    padding: 16,
    fontFamily: Styles.fontFamily.secondary.bold.normal,
    color: Colors.text.white,
    backgroundColor: Colors.background.dark,
    borderWidth: 1,
    fontSize: Styles.fontSize.md,
    borderColor: Colors.background.normal,
  };

  return (
    <TextInput
      ref={forwardRef}
      placeholderTextColor={Colors.text.normal}
      autoCorrect={false}
      autoCapitalize={'none'}
      style={[
        variantStyle(),
        fullWidthStyle(),
        marginStyles,
        defaultStyle,
        focusStyle,
        style,
        hidden ? {display: 'none'} : {},
      ]}
      {...inputProps}
      onBlur={e => {
        setFocusStyle({});
        if (inputProps.onBlur) {
          inputProps.onBlur(e);
        }
      }}
      onFocus={e => {
        setFocusStyle({
          backgroundColor: Colors.background.darkest,
        });
        if (inputProps.onFocus) {
          inputProps.onFocus(e);
        }
      }}
    />
  );
};

export default SolaceInput;
