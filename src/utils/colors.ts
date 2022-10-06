import {Appearance} from 'react-native';
const colorScheme = Appearance.getColorScheme();

let theme = {
  background: {
    lightest: '#ffffff',
    light: '#9999A5',
    normal: '#3d3d3d',
    dark: '#151515',
    darker: '#101010',
    // darkest: '#0D0D0D',
    darkest: '#3d3d3d',
    transparent: 'transparent',
    purple: '#772CB3',
    lightgreen: '#C4FFE6',
    lightorange: '#FFCFC4',
    lightblue: '#C4E6FF',
    lightpink: '#F0C4FF',
  },
  text: {
    white: '#ffffff',
    light: '#d4d4d8',
    normal: '#9999A5',
    dark: '#27272a',
    black: '#000000',
    purple: '#772CB3',
    approved: '#00ac64',
    pending: '#d27d00',
    link: '#0066cc',
    awaiting: '#d27d00',
    green: '#14f195',
    lightgreen: '#C4FFE6',
    lightorange: '#FFCFC4',
    lightblue: '#C4E6FF',
    lightpink: '#F0C4FF',
  },
};
// if (colorScheme === 'dark') {
//   theme = {
//     black: '#353333',
//   };
// }

export const Colors = theme;
