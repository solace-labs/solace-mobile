import {StyleSheet} from 'react-native';
import {Colors} from './colors';

const globalStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
  },
  fullWidth: {
    width: '100%',
  },
  fullCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
    backgroundColor: Colors.background.lightorange,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

export default globalStyles;
