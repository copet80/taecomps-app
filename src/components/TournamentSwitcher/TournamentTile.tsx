import React, { memo } from 'react';

import { ClickableTile } from '@carbon/react';
import { CheckmarkFilled } from '@carbon/icons-react';
import cx from 'classnames';

import './TournamentSwitcher.scss';

import { Tournament } from '../../types';
import { formatDateTime, formatTournamentDate } from '../../utils';

type Props = {
  tournament: Tournament;
  selected?: boolean | undefined;
  onClick: (tournament: Tournament) => void;
};

function TournamentTile({ tournament, selected, onClick }: Props) {
  const { name, createdAt, modifiedAt, startDate, endDate } = tournament;

  function handleClick() {
    onClick(tournament);
  }

  return (
    <ClickableTile className={cx({ selected })} value="1" onClick={handleClick}>
      <div className="tile">
        <div className="tile__mainInfo">
          <div className="tile__selected--indicator">
            <CheckmarkFilled />
          </div>
          <h5>{name}</h5>
          <div className="tournamentDate">
            {formatTournamentDate(startDate, endDate) ?? <em>Date TBC</em>}
          </div>
        </div>
        <div className="tile__secondaryInfo">
          <p>
            <strong>Tap to manage</strong>
          </p>
          <p>Last modified at {formatDateTime(modifiedAt || createdAt)}</p>
        </div>
      </div>
    </ClickableTile>
  );
}

export default memo(TournamentTile);
