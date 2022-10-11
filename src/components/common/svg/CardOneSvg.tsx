import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {Colors} from '../../../utils/colors';

type CardOneSvgType = {
  color: keyof typeof Colors.background;
};

function CardOneSvg({color}: CardOneSvgType) {
  return (
    <Svg width="97" height="95" viewBox="0 0 97 95" fill="none">
      <Path
        d="M99.0047 10.3466L117 16.0598L105.806 31.2393L117 53.8913L94.729 65.2664L94.846 84.1141L76.923 78.1788L59 94L41.077 78.1788L23.154 84.1141L23.271 65.2664L1 53.8913L12.194 31.2393L1 16.0598L18.9953 10.3466L23.154 -14.6957L47.9953 -10.6833L59 -26L70.0047 -10.6833L94.612 -15.6739L99.0047 10.3466Z"
        // fill="#181818"
      />
      <Path
        d="M59 -26L70.0047 -10.6833M59 -26L47.9953 -10.6833M59 -26L72.6919 16.0598M59 -26L45.3081 16.0598M81.0094 4.63343L94.612 -15.6739M81.0094 4.63343L99.0047 10.3466M81.0094 4.63343L70.0047 -10.6833M81.0094 4.63343L72.6919 16.0598M117 16.0598L99.0047 10.3466M117 16.0598L105.806 31.2393M117 16.0598L70.077 50.087L23.154 84.1141M117 16.0598H72.6919M94.612 46.4187L59 34.8696M94.612 46.4187L117 53.8913M94.612 46.4187L105.806 31.2393M94.612 46.4187L94.729 65.2664M94.846 84.1141L1 16.0598M94.846 84.1141L76.923 78.1788M94.846 84.1141L94.729 65.2664M94.846 84.1141L72.6919 16.0598M59 72.2435V34.8696M59 72.2435V94M59 72.2435L76.923 78.1788M59 72.2435L41.077 78.1788M23.154 84.1141L23.271 65.2664M23.154 84.1141L41.077 78.1788M23.154 84.1141L45.3081 16.0598M23.388 46.4187L59 34.8696M23.388 46.4187L1 53.8913M23.388 46.4187L12.194 31.2393M23.388 46.4187L23.271 65.2664M1 16.0598L18.9953 10.3466M1 16.0598L12.194 31.2393M1 16.0598H45.3081M36.9906 4.63343L23.154 -14.6957M36.9906 4.63343L47.9953 -10.6833M36.9906 4.63343L18.9953 10.3466M36.9906 4.63343L45.3081 16.0598M59 34.8696L72.6919 16.0598M59 34.8696L45.3081 16.0598M23.154 -14.6957L47.9953 -10.6833M23.154 -14.6957L18.9953 10.3466M1 53.8913L12.194 31.2393M1 53.8913L23.271 65.2664M59 94L76.923 78.1788M59 94L41.077 78.1788M117 53.8913L105.806 31.2393M117 53.8913L94.729 65.2664M94.612 -15.6739L99.0047 10.3466M94.612 -15.6739L70.0047 -10.6833M72.6919 16.0598H59H45.3081"
        stroke={Colors.background[color]}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default CardOneSvg;
