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
    white: '#ffffff',
    light: '#d4d4d8',
    normal: '#9999A5',
    dark: '#27272a',
    black: '#000000',
  },
};
// if (colorScheme === 'dark') {
//   theme = {
//     black: '#353333',
//   };
// }

export const Colors = theme;
