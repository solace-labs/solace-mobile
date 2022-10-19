/* eslint-disable react-hooks/exhaustive-deps */
import {TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {FC, useContext} from 'react';

import {GlobalContext} from '../../../../state/contexts/GlobalContext';
import {PublicKey} from 'solace-sdk';
import SolaceContainer from '../../../common/solaceui/SolaceContainer';
import SolaceText from '../../../common/solaceui/SolaceText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import TopNavbar from '../../../common/TopNavbar';
import {SecurityStackParamList} from '../../../../navigation/Home/Security';
import {IconType} from '../../../common/solaceui/SolaceIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwecome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwecome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {Colors} from '../../../../utils/colors';
import globalStyles from '../../../../utils/global_styles';

type SecurityScreenProps = NativeStackScreenProps<
  SecurityStackParamList,
  'Guardian'
>;

export type PublicKeyType = InstanceType<typeof PublicKey>;

export type OptionItemType = {
  iconType: IconType;
  icon: string;
  heading: string;
  subHeading?: string;
  handlePress: () => void;
};

const getIcon = (name: string, variant: string, iconStyle: TextStyle) => {
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

const SecurityScreen = () => {
  const {state} = useContext(GlobalContext);
  const navigation = useNavigation<SecurityScreenProps['navigation']>();

  const items: OptionItemType[] = [
    {
      iconType: 'ionicons',
      icon: 'shield-checkmark-outline',
      heading: 'manage guardians',
      subHeading: 'manage your guardians, change threshold for approval',
      handlePress: () => {
        navigateTo('Guardian');
      },
    },
    {
      iconType: 'mi',
      icon: 'person-add-alt',
      heading: 'trusted addresses',
      subHeading:
        'make transaction without guardians with addresses you cant trust',
      handlePress: () => {
        navigateTo('TrustedAddresses');
      },
    },
    {
      iconType: 'mci',
      icon: 'check-decagram-outline',
      heading: 'trusted lists',
      subHeading: 'interact with popular defi apps which you can trust',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'ios-time-outline',
      heading: 'trusted sessions',
      subHeading: 'manage your payment methods',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'ios-mic-outline',
      heading: 'support',
      handlePress: () => {},
    },
    {
      iconType: 'ionicons',
      icon: 'information-circle-outline',
      heading: 'about',
      handlePress: () => {
        navigateTo('About');
      },
    },
  ];

  const navigateTo = (screen: keyof SecurityStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <SolaceContainer fullWidth={true}>
      <TopNavbar
        startIcon="md-shield-outline"
        startIconType="ionicons"
        text="security"
      />
      <View style={globalStyles.fullWidth}>
        {items.map((item, index) => {
          return <OptionsItem key={item.heading} item={item} index={index} />;
        })}
      </View>
    </SolaceContainer>
  );
};

export default SecurityScreen;

export type OptionsItemProps = {
  item: OptionItemType;
  index: number;
};

export const OptionsItem: FC<OptionsItemProps> = ({item, index}) => {
  const iconStyle: TextStyle = {
    padding: 4,
    borderRadius: 4,
    overflow: 'hidden',
    color: Colors.text.normal,
    backgroundColor: Colors.background.dark,
    borderWidth: 1,
    borderColor: Colors.text.dark,
    fontSize: 20,
    marginRight: 20,
  };

  const itemStyle: ViewStyle = {
    borderTopColor: Colors.text.dark,
    borderBottomColor: Colors.text.dark,
    borderTopWidth: index === 0 ? 1 : 0,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  };

  return (
    <TouchableOpacity onPress={item.handlePress} style={itemStyle}>
      <View>{getIcon(item.icon, item.iconType, iconStyle)}</View>
      <View style={{flex: 1}}>
        <SolaceText align="left">{item.heading}</SolaceText>
        {item.subHeading && (
          <SolaceText align="left" size="xs" color="normal">
            {item.subHeading}
          </SolaceText>
        )}
      </View>
      <View style={{marginLeft: 20}}>
        <MaterialIcons
          name="arrow-right-alt"
          color={Colors.text.normal}
          size={24}
        />
      </View>
    </TouchableOpacity>
  );
};
