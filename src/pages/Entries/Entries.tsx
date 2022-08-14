import React, { useEffect, useState } from 'react';

import { DateTime } from 'luxon';

import {
  DeleteEntryDialog,
  EditEntryDialog,
  EmptyState,
  FullScreenContainer,
  FullScreenSpinner,
} from '../../components';
import { useApi, useStore } from '../../hooks';
import { Entry } from '../../types';
import { ENTRY_AGE_MIN, ENTRY_WEIGHT_MIN } from '../../utils';
import EntryTable from './EntryTable';

enum Mode {
  Loading,
  EditEntry,
  DeleteEntry,
}

function createNewEntry(tournamentId: string): Entry {
  return {
    id: '',
    tournamentId,
    name: '',
    age: ENTRY_AGE_MIN,
    gender: '',
    weight: ENTRY_WEIGHT_MIN,
    belt: '',
    club: '',
    createdAt: DateTime.now().toISO(),
  };
}

export default function Entries() {
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

  const [entryToAction, setEntryToAction] = useState<Entry>(
    createNewEntry(currentTournament.id),
  );

  async function fetchData() {
    if (currentTournament) {
      setMode(Mode.Loading);
      await listEntries(currentTournament.id);
      setMode(undefined);
    }
  }

  const entries = entriesByTournamentId[currentTournament.id];

  function handleCreateEntryClick() {
    if (currentTournament) {
      setEntryToAction(createNewEntry(currentTournament.id));
      setMode(Mode.EditEntry);
    }
  }

  function handleClearDialog() {
    setMode(undefined);
  }

  if (mode === Mode.Loading || !entries) {
    return <FullScreenSpinner />;
  }

  function handleEditEntryClick(entry: Entry) {
    setEntryToAction(entry);
    setMode(Mode.EditEntry);
  }

  function handleDeleteEntryClick(entry: Entry) {
    setEntryToAction(entry);
    setMode(Mode.DeleteEntry);
  }

  function renderEmptyState() {
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

  function renderTable() {
    return (
      <EntryTable
        entries={entries}
        onCreateClick={handleCreateEntryClick}
        onEditClick={handleEditEntryClick}
        onDeleteClick={handleDeleteEntryClick}
      />
    );
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer EntriesContainer">
        {entries.length === 0 ? renderEmptyState() : renderTable()}
        <EditEntryDialog
          isVisible={mode === Mode.EditEntry}
          tournament={currentTournament}
          entry={entryToAction}
          onCancelClick={handleClearDialog}
          onUpdateSuccess={handleClearDialog}
        />
        <DeleteEntryDialog
          isVisible={mode === Mode.DeleteEntry}
          entry={entryToAction}
          onCancelClick={handleClearDialog}
          onDeleteSuccess={handleClearDialog}
        />
      </div>
    </FullScreenContainer>
  );
}
