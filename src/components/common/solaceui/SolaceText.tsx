import React, {FC, ReactNode, RefObject} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {Colors} from '../../../utils/colors';
import {Styles} from '../../../utils/styles';

type PrimaryWeight = keyof typeof Styles.fontFamily.primary;
type SecondaryWeight = keyof typeof Styles.fontFamily.secondary;
type Color = keyof typeof Colors.text;

type PrimaryTextProps = {
  type?: 'primary';
  weight?: PrimaryWeight;
};

type SecondaryTextProps = {
  type?: 'secondary';
  weight?: SecondaryWeight;
};

export type SolaceTextProps = {
  style?: StyleProp<TextStyle>;
  color?: Color;
  fullWidth?: boolean;
  children?: ReactNode;
  italic?: boolean;
  forwardRef?: RefObject<Text>;
  align?: 'right' | 'left' | 'center';
  size?: keyof typeof Styles.fontSize;
  mt?: number;
  mb?: number;
} & (SecondaryTextProps | PrimaryTextProps);

export type SolaceTextCompleteProps = SolaceTextProps & TextProps;

const SolaceText: FC<SolaceTextCompleteProps> = ({
  style,
  children,
  weight = 'regular',
  italic = false,
  forwardRef,
  type = 'primary',
  color: variant = 'white',
  align = 'center',
  size = 'md',
  mt = 0,
  mb = 0,
  ...textProps
}) => {
  const variantStyle = (): StyleProp<TextStyle> => {
    return {color: Colors.text[variant]};
  };

  const typeStyle = (): StyleProp<TextStyle> => {
    switch (type) {
      case 'secondary': {
        const secondary = Styles.fontFamily.secondary;
        const secondaryWeight = weight as SecondaryWeight;
        return {
          fontFamily: italic
            ? secondary[secondaryWeight].italic
            : secondary[secondaryWeight].normal,
        };
      }
      default: {
        const primary = Styles.fontFamily.primary;
        return {
          fontFamily: italic ? primary[weight].italic : primary[weight].normal,
        };
      }
    }
  };

  const defaultStyles = {textAlign: align, fontSize: Styles.fontSize[size]};
  const marginStyles = {marginBottom: mb, marginTop: mt};

  return (
    <Text
      ref={forwardRef}
      style={[typeStyle(), variantStyle(), marginStyles, defaultStyles, style]}
      {...textProps}>
      {children}
    </Text>
  );
};

export default SolaceText;
