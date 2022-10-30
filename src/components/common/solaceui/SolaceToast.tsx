import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-svg';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfigParams,
  ToastProps,
} from 'react-native-toast-message';
import {Colors} from '../../../utils/colors';
import SolaceText from './SolaceText';

type SolaceToastProps = ToastProps;

export function SolaceToast(props: SolaceToastProps) {
  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (prop: any) => (
      <BaseToast
        {...prop}
        style={{borderLeftColor: Colors.text.green, marginTop: props.topOffset}}
        contentContainerStyle={{
          paddingHorizontal: 15,
          backgroundColor: Colors.background.darker,
          borderWidth: 1,
          borderColor: Colors.background.dark,
        }}
        text1Style={{
          color: Colors.text.light,
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
    /*
      Overwrite 'info' type,
      by modifying the existing `BaseToast` component
    */
    info: (prop: any) => (
      <BaseToast
        {...prop}
        style={{
          borderLeftColor: Colors.text.normal,
          marginTop: props.topOffset,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          backgroundColor: Colors.background.darker,
          borderWidth: 1,
          borderColor: Colors.background.dark,
        }}
        text1Style={{
          color: Colors.text.light,
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (prop: any) => (
      <ErrorToast
        {...prop}
        style={{
          borderLeftColor: Colors.text.error,
          marginTop: props.topOffset,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          backgroundColor: Colors.background.darker,
          borderWidth: 1,
          borderColor: Colors.background.dark,
        }}
        text1Style={{
          color: Colors.text.light,
          fontSize: 15,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({text1, text2, ...prop}: ToastConfigParams<any>) => {
      console.log({text1, props: prop});
      return (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 8,
            height: 200,
            width: '100%',
          }}>
          <View
            style={{
              // height: 60,
              width: '100%',
              backgroundColor: Colors.background.darker,
              borderRadius: 12,
              borderColor: Colors.background.dark,
              borderWidth: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              padding: 4,
              // marginHorizontal: 8,
            }}>
            <SolaceText>{text1}</SolaceText>
            <SolaceText>{text2}</SolaceText>
          </View>
        </View>
      );
    },
  };
  return <Toast topOffset={50} config={toastConfig} />;
}
