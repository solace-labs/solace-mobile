import React, {FC} from 'react';
import SolaceText from './solaceui/SolaceText/SolaceText';

type Props = {
  heading: string;
  subHeading: string;
};

const Header: FC<Props> = ({heading, subHeading}) => {
  return (
    <>
      <SolaceText weight="semibold" variant="white" size="xl" align="left">
        {heading}
      </SolaceText>
      <SolaceText type="secondary" weight="bold" align="left" variant="normal">
        {subHeading}
      </SolaceText>
    </>
  );
};

export default Header;
