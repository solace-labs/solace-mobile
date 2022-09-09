/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values';
import 'fastestsmallesttextencoderdecoder-encodeinto';
import {Buffer} from '@craftzdog/react-native-buffer';
import BigInt from 'big-integer';

global.Buffer = Buffer;
if (Platform.OS === 'android') {
  global.BigInt = BigInt;
}

AppRegistry.registerComponent(appName, () => App);
