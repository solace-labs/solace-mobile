import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {Colors} from '../../../utils/colors';

type OtherWalletLogoType = {
  color: keyof typeof Colors.background;
};

function OtherWalletLogo({color}: OtherWalletLogoType) {
  return (
    <Svg width="22" height="22" fill="none" viewBox="0 0 22 22">
      <Path
        stroke={Colors.background[color]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.429 8.75L1.25 11l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L1.25 6.5 11 1.25l9.75 5.25-4.179 2.25m0 0L20.75 11l-4.179 2.25m0 0l4.179 2.25L11 20.75 1.25 15.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
      />
    </Svg>
  );
}

export default OtherWalletLogo;
