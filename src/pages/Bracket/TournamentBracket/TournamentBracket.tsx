import React, { memo, useMemo } from 'react';

import { sampleData } from './sampleData';

import {
  SingleEliminationBracket,
  Match,
  SVGViewer,
} from '@g-loot/react-tournament-brackets';
import { Entry, Tournament } from '../../../types';
import { useWindowSize } from '../../../hooks';

type Props = {
  tournament: Tournament;
  entries: Entry[];
};

function TournamentBracket({ tournament, entries }: Props) {
  const matches = useMemo(() => [], [entries]);
  const size = useWindowSize();

  return (
    <SingleEliminationBracket
      /* @ts-ignore */
      matches={sampleData}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={size.width} height={size.height} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );
}

export default memo(TournamentBracket);
