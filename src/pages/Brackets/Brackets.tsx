import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../../AppRoutes';

import {
  EmptyState,
  FullScreenContainer,
  FullScreenSpinner,
} from '../../components';
import { useApi, useStore } from '../../hooks';
import TournamentBracket from './SingleEliminationBracket/SingleEliminationBracket';

enum Mode {
  Loading,
  EditBracket,
  DeleteBracket,
}

export default function Bracket() {
  const navigate = useNavigate();
  const { currentTournament } = useStore();
  const { entriesByTournamentId, listEntries } = useApi();

  const [mode, setMode] = useState<Mode | undefined>(Mode.Loading);

  useEffect(() => {
    fetchData();
  }, [currentTournament]);

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

  if (mode === Mode.Loading || !entries) {
    return <FullScreenSpinner />;
  }

  function handleEmptyStateCtaClick() {
    navigate(AppRoutes.Entries);
  }

  function renderEmptyState() {
    return (
      <EmptyState
        title="No entries yet"
        subTitle="This tournament has no entries yet. Let's start creating a new entry!"
        isCtaVisible
        ctaLabel="Go to Entries"
        onCtaClick={handleEmptyStateCtaClick}
      />
    );
  }

  function renderBracket() {
    if (!currentTournament) {
      return null;
    }

    return (
      <TournamentBracket tournament={currentTournament} entries={entries} />
    );
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer BracketContainer">
        {entries.length === 0 ? renderEmptyState() : renderBracket()}
      </div>
    </FullScreenContainer>
  );
}
