import React, {FC, ReactNode} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../../utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwecome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwecome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {Styles} from '../../../utils/styles';
import SolaceText from './SolaceText';

export type IconType =
  | 'antdesign'
  | 'entypo'
  | 'evilicons'
  | 'feather'
  | 'fa'
  | 'fa5'
  | 'fa5pro'
  | 'fontisto'
  | 'foundation'
  | 'ionicons'
  | 'mci'
  | 'mi'
  | 'octicons'
  | 'sli'
  | 'zocial';

export type SolaceIconProps = {
  children?: ReactNode;
  type?: 'light' | 'dark' | 'normal';
  size?: keyof typeof Styles.fontSize;
  variant?: IconType;
  name?: string;
  subText?: string;
} & TouchableOpacityProps;

const SolaceIcon: FC<SolaceIconProps> = ({
  children,
  type = 'light',
  variant = 'antdesign',
  size = 'md',
  name,
  subText,
  ...props
}) => {
  const iconBackgroundStyle: StyleProp<ViewStyle> = {
    backgroundColor:
      type === 'light'
        ? Colors.background.lightest
        : type === 'dark'
        ? Colors.background.dark
        : Colors.background.normal,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 50,
  };

  const iconStyle: StyleProp<TextStyle> = {
    color: type === 'light' ? Colors.text.dark : Colors.text.white,
    fontSize: Styles.fontSize[size] * 1.3,
    padding: 10,
    overflow: 'hidden',
  };

  const getIcon = () => {
    switch (variant) {
      case 'antdesign': {
        return <AntDesign name={name!} style={iconStyle} />;
      }
      case 'entypo': {
        return <Entypo name={name!} style={iconStyle} />;
      }
      case 'evilicons': {
        return <EvilIcons name={name!} style={iconStyle} />;
      }
      case 'fa': {
        return <FontAwesome name={name!} style={iconStyle} />;
      }
      case 'fa5': {
        return <FontAwecome5 name={name!} style={iconStyle} />;
      }
      case 'fa5pro': {
        return <FontAwecome5Pro name={name!} style={iconStyle} />;
      }
      case 'feather': {
        return <Feather name={name!} style={iconStyle} />;
      }
      case 'fontisto': {
        return <Fontisto name={name!} style={iconStyle} />;
      }
      case 'ionicons': {
        return <Ionicons name={name!} style={iconStyle} />;
      }
      case 'mci': {
        return <MaterialCommunityIcons name={name!} style={iconStyle} />;
      }
      case 'mi': {
        return <MaterialIcons name={name!} style={iconStyle} />;
      }
      case 'octicons': {
        return <Octicons name={name!} style={iconStyle} />;
      }
      case 'sli': {
        return <SimpleLineIcons name={name!} style={iconStyle} />;
      }
      case 'zocial': {
        return <Zocial name={name!} style={iconStyle} />;
      }
      default:
        <></>;
    }
  };

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity style={[iconBackgroundStyle, props.style]} {...props}>
        {getIcon()}
        {children}
      </TouchableOpacity>
      {subText && (
        <SolaceText type="secondary" mt={10} style={{fontSize: 14}}>
          {subText}
        </SolaceText>
      )}
    </View>
  );
};

export default SolaceIcon;
