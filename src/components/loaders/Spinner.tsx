import React from 'react';

import { IconBaseProps } from 'react-icons';
import { ImSpinner8 } from 'react-icons/im';
import { PiDogFill } from 'react-icons/pi';

interface Props extends IconBaseProps {
  dog?: boolean;
}

export const Spinner = ({ dog, ...props }: Props) => {
  return dog ? (
    <PiDogFill size={25} {...props} className={`loading-icon m-auto text-vino-500 ${props.className}`} />
  ) : (
    <ImSpinner8 size={25} {...props} className={`loading-icon m-auto text-vino-500 ${props.className}`} />
  );
};
