import React, { memo } from 'react';

import {
  ExpandableTile,
  FormLabel,
  IconButton,
  Stack,
  Tag,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from '@carbon/react';
import {
  Edit as EditIcon,
  TrashCan as TrashCanIcon,
} from '@carbon/icons-react';

import './TournamentTile.scss';

import { Tournament } from '../../../types';
import { formatDateTime, formatTournamentDate } from '../../../utils';

type Props = {
  tournament: Tournament;
  onEditClick: (tournament: Tournament) => void;
  onDeleteClick: (tournament: Tournament) => void;
};

function TournamentTile({ tournament, onEditClick, onDeleteClick }: Props) {
  const {
    name,
    createdAt,
    description,
    belts,
    clubs,
    modifiedAt,
    startDate,
    endDate,
    isArchived,
  } = tournament;

  function handleEditClick() {
    onEditClick(tournament);
  }
  function handleDeleteClick() {
    onDeleteClick(tournament);
  }

  return (
    <ExpandableTile
      tileCollapsedIconText="Expand tile"
      tileExpandedIconText="Collapse tile">
      <TileAboveTheFoldContent>
        <div className="TournamentTile__AboveFold">
          <div className="tile__mainInfo">
            <div className="tile__action">
              <IconButton
                kind="ghost"
                label="Delete tournament"
                onClick={handleDeleteClick}>
                <TrashCanIcon />
              </IconButton>
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
                  {formatTournamentDate(startDate, endDate) ?? (
                    <em>Date TBC</em>
                  )}
                </div>
              </Stack>
              {isArchived && (
                <span className="closedTag">
                  <Tag type="red">Closed</Tag>
                </span>
              )}
              <p>{description || <em>No description.</em>}</p>
            </Stack>
          </div>
          <div className="tile__secondaryInfo">
            <p>Last modified at {formatDateTime(modifiedAt || createdAt)}</p>
          </div>
        </div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div className="TournamentTile__BelowFold">
          <Stack gap={6}>
            <Stack gap={3}>
              <FormLabel>Participating clubs</FormLabel>
              <p>{clubs}</p>
            </Stack>
            <Stack gap={3}>
              <FormLabel>Belts</FormLabel>
              <p>{belts}</p>
            </Stack>
          </Stack>
        </div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
}

export default memo(TournamentTile);
