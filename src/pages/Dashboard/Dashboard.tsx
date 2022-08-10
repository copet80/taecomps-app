import React, { useState } from 'react';

import { Stack } from '@carbon/react';

import './Dashboard.scss';

import { EmptyState, FullScreenContainer } from '../../components';
import { useStore } from '../../hooks';

import TournamentTile from './TournamentTile';
import EditTournamentDialog from './EditTournamentDialog';
import DeleteTournamentDialog from './DeleteTournamentDialog';

enum Mode {
  EditTournament,
  DeleteTournament,
}

export default function Dashboard() {
  const { currentTournament, setCurrentTournament } = useStore();

  const [mode, setMode] = useState<Mode | undefined>(undefined);

  if (!currentTournament) {
    return (
      <EmptyState
        title=""
        subTitle="Please select a tournament from the menu to start managing it."
      />
    );
  }

  function handleEditTournament() {
    setMode(Mode.EditTournament);
  }

  function handleCancelEditTournament() {
    setMode(undefined);
  }

  function handleEditTournamentSuccess() {
    setMode(undefined);
  }

  function handleDeleteTournament() {
    setMode(Mode.DeleteTournament);
  }

  function handleCancelDeleteTournament() {
    setMode(undefined);
  }

  function handleDeleteTournamentSuccess() {
    setMode(undefined);
    setCurrentTournament(undefined);
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer DashboardContainer">
        <Stack gap={6}>
          <h2>Dashboard</h2>
          <section className="primary">
            <TournamentTile
              tournament={currentTournament}
              onEditClick={handleEditTournament}
              onDeleteClick={handleDeleteTournament}
            />
          </section>
        </Stack>
      </div>
      <EditTournamentDialog
        isVisible={mode === Mode.EditTournament}
        tournament={currentTournament}
        onCancelClick={handleCancelEditTournament}
        onUpdateSuccess={handleEditTournamentSuccess}
      />
      <DeleteTournamentDialog
        isVisible={mode === Mode.DeleteTournament}
        tournament={currentTournament}
        onCancelClick={handleCancelDeleteTournament}
        onDeleteSuccess={handleDeleteTournamentSuccess}
      />
    </FullScreenContainer>
  );
}
