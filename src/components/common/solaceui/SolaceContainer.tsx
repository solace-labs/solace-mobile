import React, {FC, ReactNode} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import type {StyleProp} from 'react-native';
import {Colors} from '../../../utils/colors';

export interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  fullWidth?: boolean;
  mt?: number;
  mb?: number;
}

const SolaceContainer: FC<Props> = ({
  style,
  fullWidth = false,
  mt = 0,
  mb = 0,
  children,
  ...scrollViewProps
}) => {
  const marginStyles = {
    marginTop: mt,
    marginBottom: mb,
  };

  const defaultStyle: StyleProp<ViewStyle> = {
    backgroundColor: Colors.background.darkest,
    flex: 1,
    alignItems: 'center',
  };

  const container: StyleProp<ViewStyle> = {
    flex: 1,
    width: '100%',
    paddingHorizontal: fullWidth ? 0 : 16,
  };

  return (
    <SafeAreaView style={[defaultStyle, style]} {...scrollViewProps}>
      <StatusBar barStyle={'light-content'} />
      <View style={[marginStyles, container]}>{children}</View>
    </SafeAreaView>
  );
};

export default SolaceContainer;
