import React, {FC} from 'react';
import {StyleSheet, TextInputProps, TouchableOpacity, View} from 'react-native';
import SolaceInput, {SolaceInputProps} from './SolaceInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../utils/colors';
import {Styles} from '../../../utils/styles';

type Props = {
  iconName: string;
  iconType?: 'antdesign' | 'mci';
  iconColor?: keyof typeof Colors.text;
  handleIconPress?: () => void;
  shiftIconUp?: keyof typeof Styles.fontSize;
  style?: TextInputProps;
} & SolaceInputProps;

const SolaceCustomInput: FC<Props> = ({
  iconName,
  iconType = 'antdesign',
  iconColor = 'normal',
  handleIconPress,
  shiftIconUp = 'md',
  style: styleProp,
  ...props
}) => {
  const getIcon = () => {
    const style = {
      fontSize: 20,
      color: Colors.text[iconColor || 'light'],
    };
    switch (iconType) {
      case 'antdesign': {
        return (
          <AntDesign
            color={Colors.text[iconColor || 'light']}
            name={iconName!}
            style={style}
          />
        );
      }
      case 'mci': {
        return <MaterialCommunityIcons name={iconName!} style={style} />;
      }
      default:
        return <AntDesign name="questioncircleo" style={style} />;
    }
  };

  return (
    <View>
      <View style={styles.inputWrap}>
        <TouchableOpacity
          style={[
            styles.iconPosition,
            {
              transform: [{translateY: -Styles.fontSize[shiftIconUp]}],
            },
          ]}
          onPress={handleIconPress}>
          {getIcon()}
        </TouchableOpacity>
        <SolaceInput {...props} style={[styles.inputStyle, styleProp]} />
      </View>
    </View>
  );
};

export default SolaceCustomInput;

const styles = StyleSheet.create({
  inputWrap: {
    width: '100%',
    position: 'relative',
  },
  iconPosition: {
    position: 'absolute',
    right: 16,
    top: '50%',
    zIndex: 10,
  },
  inputStyle: {
    paddingRight: 40,
    backgroundColor: Colors.background.darkest,
  },
});
