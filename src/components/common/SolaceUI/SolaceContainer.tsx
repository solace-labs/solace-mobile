import React, {FC, ReactNode} from 'react';
import {ScrollView, View, ViewProps, ViewStyle} from 'react-native';
import type {StyleProp} from 'react-native';
import {Colors} from '../../../utils/colors';

export interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  mt?: number;
  mb?: number;
}

const SolaceContainer: FC<Props> = ({
  style,
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
    backgroundColor: Colors.background.dark,
    paddingTop: 50,
    flex: 1,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'pink',
  };

  const container: StyleProp<ViewStyle> = {
    flex: 1,
    width: '90%',
    paddingVertical: 24,
    // borderWidth: 1,
    // borderColor: 'white',
  };

  return (
    <ScrollView
      contentContainerStyle={[defaultStyle, style]}
      bounces={false}
      {...scrollViewProps}>
      <View style={[marginStyles, container]}>{children}</View>
    </ScrollView>
  );
};

export default SolaceContainer;
