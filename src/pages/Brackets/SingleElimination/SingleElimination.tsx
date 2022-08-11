import React, { memo, useMemo } from 'react';

import { sampleData } from './sampleData';

import {
  SingleEliminationBracket,
  SVGViewer,
} from '@g-loot/react-tournament-brackets';

import './SingleElimination.scss';

import * as colors from '../../../styles/AppColors';
import { Entry, Tournament } from '../../../types';
import { useWindowSize } from '../../../hooks';

import MatchRenderer from './MatchRenderer';

type Props = {
  tournament: Tournament;
  entries: Entry[];
};

function SingleElimination({ tournament, entries }: Props) {
  const matches = useMemo(() => [], [entries]);
  const size = useWindowSize();

  return (
    <div className="SingleEliminationBracket">
      <SingleEliminationBracket
        matches={sampleData}
        matchComponent={MatchRenderer}
        onMatchClick={console.log}
        onPartyClick={console.log}
        options={{
          style: {
            roundHeader: {
              backgroundColor: '#AAA',
              height: 0,
              marginBottom: -20,
            },
            connectorColor: colors.gray40,
            connectorColorHighlight: colors.black,
            boxHeight: 130,
          },
        }}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer
            width={size.width}
            height={size.height}
            {...props}
            minScaleFactor={1}
            maxScaleFactor={1}
            scaleFactorOnWheel={0.1}
            disableDoubleClickZoomWithToolAuto
            miniatureProps={{ position: 'none' }}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
}

export default memo(SingleElimination);
