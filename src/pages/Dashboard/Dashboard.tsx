import React, { useState } from 'react';

import { Stack } from '@carbon/react';

import './Dashboard.scss';

import { FullScreenContainer } from '../../components';
import { useStore } from '../../hooks';

import TournamentTile from './TournamentTile';
import EditTournamentDetailsDialog from './EditTournamentDetailsDialog';

enum Mode {
  EditTournamentDetails,
}

export default function Dashboard() {
  const { currentTournament } = useStore();

  const [mode, setMode] = useState<Mode | undefined>(undefined);

  if (!currentTournament) {
    return null;
  }

  function handleEditTournamentDetails() {
    setMode(Mode.EditTournamentDetails);
  }

  function handleCancelEditTournamentDetails() {
    setMode(undefined);
  }

  function handleEditTournamentDetailsSuccess() {
    setMode(undefined);
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer DashboardContainer">
        <Stack gap={6}>
          <h2>Dashboard</h2>
          <section className="primary">
            <TournamentTile
              tournament={currentTournament}
              onEditClick={handleEditTournamentDetails}
            />
          </section>
        </Stack>
      </div>
      <EditTournamentDetailsDialog
        isVisible={mode === Mode.EditTournamentDetails}
        tournament={currentTournament}
        onCancelClick={handleCancelEditTournamentDetails}
        onUpdateSuccess={handleEditTournamentDetailsSuccess}
      />
    </FullScreenContainer>
  );
}
