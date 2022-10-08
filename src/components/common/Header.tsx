import React, {FC} from 'react';
import SolaceText from './solaceui/SolaceText';

type Props = {
  heading: string;
  subHeading: string;
};

const Header: FC<Props> = ({heading, subHeading}) => {
  return (
    <>
      <SolaceText weight="semibold" color="white" size="xl" align="left">
        {heading}
      </SolaceText>
      <SolaceText type="secondary" weight="bold" align="left" color="normal">
        {subHeading}
      </SolaceText>
    </>
  );
};

export default Header;
