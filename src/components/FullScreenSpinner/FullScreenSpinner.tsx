import React from 'react';
import { Loading } from '@carbon/react';

import './FullScreenSpinner.scss';

import FullScreenContainer from '../FullScreenContainer';

type Props = {
  overlay?: boolean;
}

export default function FullPageSpinner({ overlay = false }: Props) {
  return (
    <FullScreenContainer center>
      <Loading withOverlay={overlay} />
    </FullScreenContainer>
  );
}
