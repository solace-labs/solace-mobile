import React, {FC} from 'react';
import {View, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import SolaceIcon from '../SolaceUI/SolaceIcon/SolaceIcon';
import SolaceText from '../SolaceUI/SolaceText/SolaceText';

type Props = {
  startIcon?: string;
  startIconType?: 'antdesign' | 'mci';
  text?: string;
  endIcon?: string;
  endIconType?: 'antdesign' | 'mci';
  startClick: () => void;
  endClick?: () => void;
};

const TopNavbar: FC<Props> = ({
  startIcon,
  startIconType,
  startClick,
  text,
  endIcon,
  endIconType,
  endClick,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftHeader}>
        <SolaceIcon
          name={startIcon || 'questioncircleo'}
          type="dark"
          variant={startIconType || 'antdesign'}
          onPress={startClick}
        />
        <SolaceText size="xl" weight="semibold" style={{marginLeft: 8}}>
          {text}
        </SolaceText>
      </View>
      {endIcon && (
        <SolaceIcon
          name={endIcon ?? 'questioncircleo'}
          type="dark"
          onPress={endClick}
          variant={endIconType || 'antdesign'}
        />
      )}
    </View>
  );
};

export default TopNavbar;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftHeader: {flexDirection: 'row', alignItems: 'center'},
});
