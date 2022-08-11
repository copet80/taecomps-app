import React from 'react';

import * as colors from '../../../styles/AppColors';
import { MatchState } from '../../../utils';

import Medal from './Medal';

export default function MatchRenderer(renderProps: any) {
  const {
    match,
    onMatchClick,
    onPartyClick,
    onMouseEnter,
    onMouseLeave,
    topParty,
    bottomParty,
    topWon,
    bottomWon,
    topHovered,
    bottomHovered,
    topText,
    bottomText,
    connectorColor,
    computedStyles,
    resultFallback,
  } = renderProps;

  let topColor = colors.white;
  let bottomColor = colors.white;
  if (topWon && !bottomWon) {
    topColor = colors.blue60;
  } else if (!topWon && bottomWon) {
    bottomColor = colors.blue60;
  }

  return (
    <div
      className="participant"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: colors.gray90,
        width: '100%',
        height: '100%',
        fontSize: '0.9rem',
      }}>
      {topText && (
        <div
          className="date"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            height: '25px',
            fontSize: '0.8rem',
          }}>
          {topText}*
        </div>
      )}
      {!(match.state === MatchState.WalkOver && bottomWon) && (
        <div
          className="topParticipant"
          onMouseEnter={() => onMouseEnter(topParty.id)}
          onMouseLeave={() => onMouseLeave(topParty.id)}
          onClick={() => onPartyClick(topParty)}
          style={{
            transition: 'opacity 0.3s',
            opacity: topHovered ? 1 : 0.8,
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            gap: '4px',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: topColor,
            color: topWon ? colors.white : 'inherit',
            border: `1px solid ${topWon ? topColor : colors.gray40}`,
            padding: '8px',
            height: '45px',
          }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: topWon ? 'bold' : 'inherit',
            }}>
            {topParty.name}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            {topParty.club}
          </div>
          {!match.nextMatchId && <Medal color={topWon ? 'gold' : 'silver'} />}
        </div>
      )}
      {!(match.state === MatchState.WalkOver && topWon) && (
        <div
          className="bottomParticipant"
          onMouseEnter={() => onMouseEnter(bottomParty.id)}
          onMouseLeave={() => onMouseLeave(bottomParty.id)}
          onClick={() => onPartyClick(bottomParty)}
          style={{
            transition: 'opacity 0.3s',
            opacity: bottomHovered ? 1 : 0.8,
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            gap: '4px',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: bottomColor,
            color: bottomWon ? colors.white : 'inherit',
            border: `1px solid ${bottomWon ? bottomColor : colors.gray40}`,
            borderTop: 0,
            padding: '8px',
            height: '45px',
          }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: bottomWon ? 'bold' : 'inherit',
            }}>
            {bottomParty.name}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            {bottomParty.club}
          </div>
          {!match.nextMatchId && (
            <Medal color={bottomWon ? 'gold' : 'silver'} />
          )}
        </div>
      )}
      {bottomText && (
        <div
          className="footnote"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            height: '25px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}>
          {bottomText}
        </div>
      )}
    </div>
  );
}
