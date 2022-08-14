import React, { useState } from 'react';

import { Stack } from '@carbon/react';

import './Dashboard.scss';

import { EmptyState, FullScreenContainer } from '../../components';
import { useStore } from '../../hooks';

import TournamentTile from './TournamentTile';

type Props = {
  onEditCurrentTournamentClick: () => void;
  onDeleteCurrentTournamentClick: () => void;
};

export default function Dashboard({
  onEditCurrentTournamentClick,
  onDeleteCurrentTournamentClick,
}: Props) {
  const { currentTournament, setCurrentTournament } = useStore();

  if (!currentTournament) {
    return (
      <EmptyState
        title="No tournament selected"
        subTitle="Please select a tournament from the menu to start managing it."
      />
    );
  }

  function handleEditTournament() {
    onEditCurrentTournamentClick();
  }

  function handleDeleteTournament() {
    onDeleteCurrentTournamentClick();
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer DashboardContainer">
        <Stack gap={6}>
          <section className="primary">
            <TournamentTile
              tournament={currentTournament}
              onEditClick={handleEditTournament}
              onDeleteClick={handleDeleteTournament}
            />
          </section>
        </Stack>
      </div>
    </FullScreenContainer>
  );
}
