import React, { memo, useMemo } from 'react';

import { sampleData } from './sampleData';

import {
  SingleEliminationBracket,
  SVGViewer,
} from '@g-loot/react-tournament-brackets';

import './SingleElimination.scss';

import * as colors from '../../../styles/AppColors';
import { MatchData } from '../types';

import MatchRenderer from './MatchRenderer';

type Props = {
  matches: MatchData[];
};

function SingleElimination({ matches }: Props) {
  return (
    <div className="SingleEliminationBracket">
      <SingleEliminationBracket
        matches={matches}
        matchComponent={MatchRenderer}
        onMatchClick={console.log}
        onPartyClick={console.log}
        options={{
          style: {
            canvasPadding: 0,
            roundHeader: {
              isShown: false,
            },
            connectorColor: colors.gray40,
            connectorColorHighlight: colors.black,
            boxHeight: 140,
          },
        }}
        svgWrapper={({ children, ...props }) => (
          <SVGViewer
            width={5000}
            height={5000}
            {...props}
            detectWheel={false}
            detectAutoPan={false}
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
