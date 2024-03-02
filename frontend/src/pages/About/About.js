import React from 'react';
import { InfoSection } from '../../components';
import { homeObjOne } from './Data';

function About() {
  return (
    <>
      <InfoSection {...homeObjOne} />
    </>
  );
}

export default About;