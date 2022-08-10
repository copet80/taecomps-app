import React, { memo } from 'react';

import { IconButton, Stack, Tile } from '@carbon/react';
import { Edit as EditIcon } from '@carbon/icons-react';

import './TournamentTile.scss';

import { Tournament } from '../../../types';
import { formatDateTime, formatTournamentDate } from '../../../utils';

type Props = {
  tournament: Tournament;
  onEditClick: (tournament: Tournament) => void;
};

function TournamentTile({ tournament, onEditClick }: Props) {
  const { name, createdAt, description, modifiedAt, startDate, endDate } =
    tournament;

  function handleEditClick() {
    onEditClick(tournament);
  }

  return (
    <Tile>
      <div className="TournamentTile">
        <div className="tile__mainInfo">
          <div className="tile__action">
            <IconButton
              label="Edit tournament details"
              onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </div>
          <Stack gap={6}>
            <Stack gap={1}>
              <h5>{name}</h5>
              <div className="tournamentDate">
                {formatTournamentDate(startDate, endDate) ?? <em>Date TBC</em>}
              </div>
            </Stack>

            <p>{description || <em>No description.</em>}</p>
          </Stack>
        </div>
        <div className="tile__secondaryInfo">
          <p>Last modified at {formatDateTime(modifiedAt || createdAt)}</p>
        </div>
      </div>
    </Tile>
  );
}

export default memo(TournamentTile);
