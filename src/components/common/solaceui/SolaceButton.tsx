import React, {FC, ReactNode} from 'react';
import {ActivityIndicator, TouchableWithoutFeedback, View} from 'react-native';
import type {StyleProp, TouchableOpacityProps, ViewStyle} from 'react-native';
import {Colors} from '../../../utils/colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import HapticFeedback from 'react-native-haptic-feedback';

type Variant = keyof typeof Colors.background;

interface ButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  background?: Variant;
  fullWidth?: boolean;
  children?: ReactNode;
  loading?: boolean;
  mt?: number;
  mb?: number;
}

const hapticFeedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const SolaceButton: FC<ButtonProps> = ({
  style,
  children,
  fullWidth = true,
  background = 'light',
  loading = false,
  mt = 0,
  mb = 0,
  ...touchableProps
}) => {
  const offset = useSharedValue(0);
  const width = useSharedValue(3);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: offset.value}, {translateX: offset.value}],
    };
  });

  const shadowStyles = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const bottomShadowStyles = useAnimatedStyle(() => {
    return {
      height: width.value,
    };
  });

  const fullWidthStyle = (): StyleProp<ViewStyle> => {
    return fullWidth ? {width: '100%'} : {};
  };

  const disabled = touchableProps.disabled as boolean;
  const disableColor = (disabled && '#8a8a8a') as string;

  const variantStyle = (): StyleProp<ViewStyle> => {
    return {
      backgroundColor: disabled ? disableColor : Colors.background[background],
    };
  };

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
    <View
      style={{
        width: '100%',
        position: 'relative',
        marginBottom: 12,
      }}>
      <TouchableWithoutFeedback
        onPressIn={() => {
          HapticFeedback.trigger('impactLight', hapticFeedbackOptions);
          offset.value = withSpring(3);
          width.value = withSpring(0);
        }}
        onPressOut={() => {
          offset.value = withSpring(0);
          width.value = withSpring(3);
        }}
        {...touchableProps}>
        <Animated.View
          style={[
            variantStyle(),
            fullWidthStyle(),
            marginStyles,
            defaultStyle,
            animatedStyles,
            style,
          ]}
          {...touchableProps}>
          {loading ? <ActivityIndicator size={24} color="black" /> : children}
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          {
            position: 'absolute',
            // width: 0,
            backgroundColor: '#E5C5FF',
            height: '100%',
            right: -1,
            transform: [{skewY: '45deg'}, {translateX: 2}],
          },
          shadowStyles,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: -3,
            width: '100%',
            backgroundColor: '#C072FF',
            // height: 4,
            transform: [{skewX: '45deg'}, {translateX: 2}],
          },
          bottomShadowStyles,
        ]}
      />
    </View>
  );
};

export default SolaceButton;
