import React, { useEffect, useMemo, useState } from 'react';

import { Accordion, AccordionItem } from '@carbon/react';
import { useNavigate } from 'react-router-dom';

import './Brackets.scss';

import AppRoutes from '../../AppRoutes';
import {
  EmptyState,
  FullScreenContainer,
  FullScreenSpinner,
} from '../../components';
import { useApi, useStore } from '../../hooks';
import { Division } from '../../types';

import SingleElimination from './SingleElimination';
import {
  assignMatchesTimesAndOrder,
  createDivisionMatches,
  createDivisionsFromEntries,
} from './Brackets.utils';
import DivisionTitle from './DivisionTitle';
import { MatchData } from './types';

enum Mode {
  Loading,
  EditBracket,
  DeleteBracket,
}

export default function Brackets() {
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

  const divisions: Division[] = useMemo(
    () => createDivisionsFromEntries(entries),
    [entries],
  );

  const matchesByDivisionId: Record<string, MatchData[]> = useMemo(
    () =>
      assignMatchesTimesAndOrder(
        currentTournament,
        divisions,
        Object.fromEntries(
          divisions.map((d) => [d.id, createDivisionMatches(d)]),
        ),
      ),
    [divisions],
  );

  if (mode === Mode.Loading || !entries) {
    return <FullScreenSpinner />;
  }

  function handleEmptyStateCtaClick() {
    navigate(AppRoutes.Entries);
  }

  function handleEditDivisionClick(division: Division) {}

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
      <Accordion>
        {divisions.map((division) => {
          return (
            <AccordionItem
              key={division.id}
              title={
                <DivisionTitle
                  division={division}
                  onEditClick={handleEditDivisionClick}
                />
              }>
              <SingleElimination matches={matchesByDivisionId[division.id]} />
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer BracketsContainer">
        <section>
          {entries.length === 0 ? renderEmptyState() : renderBracket()}
        </section>
      </div>
    </FullScreenContainer>
  );
}
