import {Appearance} from 'react-native';
const colorScheme = Appearance.getColorScheme();

console.log({colorScheme});

let theme = {
  background: {
    lightest: '#ffffff',
    light: '#9999A5',
    normal: '#3d3d3d',
    dark: '#131313',
    darkest: '#000000',
  },
  text: {
    lightest: '#ffffff',
    light: '#fff6',
    normal: '#9999A5',
    dark: '#fff3',
    darkest: '#000000',
  },
  fontFamily: {
    main: {
      extraLight: {
        normal: 'Poppins-ExtraLight',
        italic: 'Poppins-ExtraLightItalic',
      },
      light: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      thin: {
        normal: 'Poppins-Thin',
        italic: 'Poppins-ThinItalic',
      },
      medium: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
      regular: {
        normal: 'Poppins-Regular',
        italic: 'Poppins-RegularItalic',
      },
      semiBold: {
        normal: 'Poppins-SemiBold',
        italic: 'Poppins-SemiBoldItalic',
      },
      bold: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
      extraBold: {
        normal: 'Poppins-ExtraBold',
        italic: 'Poppins-ExtraBoldItalic',
      },
      black: {
        normal: 'Poppins-Black',
        italic: 'PoppinsBlackItalic',
      },
    },
    secondary: {
      regular: {
        normal: 'SpaceMono-Regular',
        italic: 'SpaceMono-Italic',
      },
      bold: {
        normal: 'SpaceMono-Bold',
        italic: 'SpaceMono-BoldItalic',
      },
    },
    fontSize: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 28,
    },
  },
};
// if (colorScheme === 'dark') {
//   theme = {
//     black: '#353333',
//   };
// }

export const Colors = theme;
