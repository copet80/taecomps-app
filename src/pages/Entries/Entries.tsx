import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import AppRoutes from '../../AppRoutes';

import {
  EmptyState,
  FullScreenContainer,
  FullScreenSpinner,
} from '../../components';
import { useApi, useStore } from '../../hooks';

enum Mode {
  Loading,
  CreateEntry,
  EditEntry,
  DeleteEntry,
}

export default function Entries() {
  const navigate = useNavigate();
  const { currentTournament } = useStore();
  const { entriesByTournamentId, listEntries } = useApi();

  const [mode, setMode] = useState<Mode | undefined>(Mode.Loading);

  useEffect(() => {
    fetchData();
  }, []);

  if (!currentTournament) {
    return (
      <EmptyState
        title="No tournament selected"
        subTitle="Please select a tournament from the menu to start managing it."
      />
    );
  }

  async function fetchData() {
    if (currentTournament) {
      setMode(Mode.Loading);
      await listEntries(currentTournament.id);
      setMode(undefined);
    }
  }

  const entries = entriesByTournamentId[currentTournament.id];

  function handleCreateEntryClick() {
    setMode(Mode.CreateEntry);
  }

  if (mode === Mode.Loading) {
    return <FullScreenSpinner />;
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        title="No entries yet"
        subTitle="This tournament has no entries yet. Let's start creating a new entry!"
        isCtaVisible
        ctaLabel="Create a new entry"
        onCtaClick={handleCreateEntryClick}
      />
    );
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer EntriesContainer"></div>
    </FullScreenContainer>
  );
}
