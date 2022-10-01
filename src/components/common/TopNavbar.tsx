import React, {FC} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from '../../utils/colors';
import globalStyles from '../../utils/global_styles';
import SolaceIcon, {IconType} from './solaceui/SolaceIcon';
import SolaceText from './solaceui/SolaceText';

type Props = {
  startIcon?: string;
  startIconType?: IconType;
  text?: string;
  endIcon?: string;
  endIconType?: IconType;
  startClick?: () => void;
  endClick?: () => void;
  fetching?: boolean;
};

const TopNavbar: FC<Props> = ({
  startIcon,
  startIconType,
  startClick,
  text,
  endIcon,
  endIconType,
  endClick,
  fetching = false,
}) => {
  return (
    <View
      style={[
        globalStyles.rowSpaceBetween,
        {backgroundColor: Colors.background.darkest, zIndex: 50},
      ]}>
      <View style={[globalStyles.rowCenter, {paddingLeft: startIcon ? 0 : 20}]}>
        {startIcon && (
          <SolaceIcon
            name={startIcon || 'questioncircleo'}
            background="darkest"
            color="white"
            variant={startIconType || 'antdesign'}
            onPress={startClick}
          />
        )}
        <SolaceText size="lg" weight="semibold" style={{marginHorizontal: 8}}>
          {text}
        </SolaceText>
        {/* {fetching && <ActivityIndicator size="small" />} */}
      </View>
      {endIcon && (
        <SolaceIcon
          name={endIcon ?? 'questioncircleo'}
          background="darkest"
          color="white"
          onPress={endClick}
          variant={endIconType || 'antdesign'}
        />
      )}
    </View>
  );
};

export default TopNavbar;
