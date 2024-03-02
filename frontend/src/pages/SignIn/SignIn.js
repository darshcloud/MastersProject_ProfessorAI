import React from 'react';
import { InfoSection } from '../../components';
import { homeObjOne } from './Data';

function SignIn() {
  return (
    <>
      <InfoSection {...homeObjOne} />
    </>
  );
}

export default SignIn;