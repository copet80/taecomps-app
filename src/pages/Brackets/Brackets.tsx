import React, { useEffect, useMemo, useState } from 'react';

import { Accordion, AccordionItem, Stack } from '@carbon/react';
import { useNavigate } from 'react-router-dom';

import './Brackets.scss';

import AppRoutes from '../../AppRoutes';
import {
  EditDivisionDialog,
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
  filterDivisions,
} from './Brackets.utils';
import DivisionTitle from './DivisionTitle';
import { MatchData } from './types';
import BracketFilters from './BracketFilters';
import { FilterCriteria } from './BracketFilters/BracketFilters';
import { getUniquePropertyValues } from '../../utils/array';

enum Mode {
  Loading,
  EditDivision,
}

export default function Brackets() {
  const navigate = useNavigate();
  const { currentTournament } = useStore();
  const { entriesByTournamentId, listEntries } = useApi();

  const [mode, setMode] = useState<Mode | undefined>(Mode.Loading);
  const [filterCriteria, setFilterCriteria] = useState<
    FilterCriteria | undefined
  >(undefined);
  const [divisionToAction, setDivisionToAction] = useState<
    Division | undefined
  >(undefined);

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

  const availableBelts: string[] = useMemo(
    () => getUniquePropertyValues(entries, 'belt'),
    [entries],
  );
  const availableClubs: string[] = useMemo(
    () => getUniquePropertyValues(entries, 'club'),
    [entries],
  );

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

  const filteredDivisions: Division[] = useMemo(
    () => filterDivisions(divisions, matchesByDivisionId, filterCriteria),
    [divisions, filterCriteria],
  );

  if (mode === Mode.Loading || !entries) {
    return <FullScreenSpinner />;
  }

  function handleEmptyStateCtaClick() {
    navigate(AppRoutes.Entries);
  }

  function handleEditDivisionClick(division: Division) {
    setDivisionToAction(division);
    setMode(Mode.EditDivision);
  }

  function handleFilterChange(criteria: FilterCriteria) {
    setFilterCriteria(criteria);
  }

  function handleCancelEditDivision() {
    setMode(undefined);
    setDivisionToAction(undefined);
  }

  function handleSaveDivision(division: Division) {
    setMode(undefined);
    setDivisionToAction(undefined);
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
      <Stack gap={0}>
        <BracketFilters
          belts={availableBelts}
          clubs={availableClubs}
          onChange={handleFilterChange}
        />
        <Accordion>
          {filteredDivisions.map((division) => {
            return (
              <AccordionItem
                key={division.id}
                open
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
      </Stack>
    );
  }

  return (
    <FullScreenContainer>
      <div className="PageContainer BracketsContainer">
        <section>
          {entries.length === 0 ? renderEmptyState() : renderBracket()}
        </section>
      </div>
      <EditDivisionDialog
        isVisible={mode === Mode.EditDivision}
        division={divisionToAction}
        belts={currentTournament.belts || ''}
        onCancelClick={handleCancelEditDivision}
        onSaveClick={handleSaveDivision}
      />
    </FullScreenContainer>
  );
}
