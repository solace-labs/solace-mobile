import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {Colors} from '../../../utils/colors';

type SolaceLogoProps = {
  color: keyof typeof Colors.background;
};

function SolaceLogo({color}: SolaceLogoProps) {
  return (
    <Svg width="16" height="20" fill="none" viewBox="0 0 16 20">
      <Path
        fill={Colors.background[color]}
        d="M16 .5H4.267C1.91.5 0 2.34 0 4.608c0 2.46 1.503 4.688 3.837 5.689l11.889 5.095H16c0-2.497-1.532-4.758-3.905-5.764L.26 4.608H16V.5zM0 15.392h16c0 2.269-1.91 4.108-4.267 4.108H0v-4.108z"
      />
    </Svg>
  );
}

export default SolaceLogo;
