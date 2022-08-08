import React from 'react';
import { Loading } from '@carbon/react';

import './FullScreenSpinner.scss';

import FullScreenContainer from '../FullScreenContainer';

export default function FullPageSpinner() {
  return (
    <FullScreenContainer center>
      <Loading />
    </FullScreenContainer>
  );
}
