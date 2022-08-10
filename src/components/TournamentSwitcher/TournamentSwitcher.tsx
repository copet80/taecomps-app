import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import {
  ClickableTile,
  ContentSwitcher,
  Form,
  InlineNotification,
  Modal,
  Stack,
  Switch,
  TextInput,
} from '@carbon/react';
import { Add as AddIcon } from '@carbon/icons-react';
import cx from 'classnames';
import { object, string } from 'yup';

import './TournamentSwitcher.scss';

import { useApi, useValidation } from '../../hooks';
import {
  Tournament,
  SwitchTournamentFn,
  CreateTournamentFn,
} from '../../types';
import { formAction, sortTournamentByName } from '../../utils';

import TournamentTile from './TournamentTile';

enum Filter {
  Recent,
  All,
}

enum FormState {
  Switching,
  SwitchError,
  Creating,
  CreateError,
}

type Props = {
  isVisible?: boolean;
  currentTournament?: Tournament | undefined;
  tournaments: Tournament[];
  createCallback: CreateTournamentFn;
  switchCallback: SwitchTournamentFn;
  onCreateSuccess: (tournament: Tournament) => void;
  onSwitchSuccess: (tournament: Tournament) => void;
  onCloseClick: () => void;
};

const tournamentSchema = object({
  tournamentName: string().required(() => ({
    field: 'tournamentName',
    key: 'required',
    message: 'Please enter a name for the tournament',
  })),
});

export default function TournamentSwitcher({
  isVisible,
  currentTournament,
  tournaments: rawTournaments,
  createCallback,
  switchCallback,
  onCreateSuccess,
  onSwitchSuccess,
  onCloseClick,
}: Props) {
  const { clearError, validate, validationProps } =
    useValidation(tournamentSchema);
  const { listRecentTournaments } = useApi();
  const tournamentNameInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<FormState | undefined>(undefined);
  const [createMode, setCreateMode] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.Recent);

  const tournaments = useMemo(() => {
    if (filter === Filter.Recent) {
      return listRecentTournaments();
    }
    return rawTournaments.sort(sortTournamentByName);
  }, [rawTournaments, filter, listRecentTournaments]);

  const isCreating = useMemo(
    () => formState === FormState.Creating,
    [formState],
  );

  const isSwitching = useMemo(
    () => formState === FormState.Switching,
    [formState],
  );

  useEffect(() => {
    if (isVisible) {
      setCreateMode(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (createMode) {
      tournamentNameInputRef.current?.focus();
    }
  }, [createMode]);

  function clearFormState() {
    setFormState(undefined);
  }

  async function handleSwitch(tournament: Tournament) {
    setFormState(FormState.Switching);

    try {
      await switchCallback(tournament);
      onSwitchSuccess(tournament);
      clearFormState();
    } catch (error) {
      setFormState(FormState.SwitchError);
    }
  }

  async function handleCreate() {
    const isValid = await validate({ tournamentName });

    if (!isValid) {
      return;
    }

    setFormState(FormState.Creating);

    try {
      const newTournament = await createCallback(tournamentName);
      onCreateSuccess(newTournament);
      clearFormState();
    } catch (error) {
      setFormState(FormState.CreateError);
    }
  }

  function handleNewTournamentClick() {
    setTournamentName('');
    setCreateMode(true);
  }

  function handleCloseClick() {
    onCloseClick();
  }

  function handleCancelClick() {
    setCreateMode(false);
  }

  function renderTiles() {
    return (
      <div className="tilesContainer">
        <ClickableTile value="new" onClick={handleNewTournamentClick}>
          <div className="tile tile__new">
            <AddIcon size={48} />
            <h5>Create new tournament</h5>
          </div>
        </ClickableTile>
        {tournaments.map((tournament) => (
          <TournamentTile
            key={tournament.id}
            selected={currentTournament?.id === tournament.id}
            tournament={tournament}
            onClick={handleSwitch}
          />
        ))}
      </div>
    );
  }

  function renderSwitchNotifications() {
    switch (formState) {
      case FormState.SwitchError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem switching tournament."
            hideCloseButton
            lowContrast={false}
          />
        );
      default:
        return null;
    }
  }

  function renderCreateForm() {
    return (
      <Stack gap={6}>
        <Form onSubmit={formAction(handleCreate)}>
          <TextInput
            ref={tournamentNameInputRef}
            required
            id="tournamentName"
            type="text"
            labelText="Tournament name"
            value={tournamentName}
            disabled={isCreating}
            {...validationProps('tournamentName')}
            onChange={(event: FormEvent<HTMLInputElement>) => {
              setTournamentName(event.currentTarget.value);
              clearError('tournamentName');
              clearFormState();
            }}
          />
          {renderCreateNotifications()}
        </Form>
      </Stack>
    );
  }

  function renderCreateNotifications() {
    switch (formState) {
      case FormState.CreateError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem creating tournament."
            hideCloseButton
            lowContrast={false}
          />
        );
      default:
        return null;
    }
  }

  function renderList() {
    return (
      <Stack gap={6}>
        <div className="contentSwitcherContainer">
          <ContentSwitcher
            selectedIndex={filter}
            onChange={({ name }: { name: Filter }) => {
              setFilter(name);
            }}>
            <Switch name={Filter.Recent} text="Recent" />
            <Switch name={Filter.All} text="All tournaments" />
          </ContentSwitcher>
        </div>
        {renderTiles()}
        {renderSwitchNotifications()}
        {filter === Filter.Recent && (
          <p>
            Showing recent {tournaments.length} of all {rawTournaments.length}{' '}
            tournaments.{' '}
            <a onClick={() => setFilter(Filter.All)}>Show all tournaments</a>
          </p>
        )}
      </Stack>
    );
  }

  return (
    <Modal
      className={cx('TournamentSwitcher', { createMode })}
      open={isVisible}
      modalHeading={createMode ? 'Create new tournament' : 'Manage tournaments'}
      passiveModal={!createMode}
      primaryButtonText="Create"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isCreating}
      onRequestSubmit={handleCreate}
      onRequestClose={handleCloseClick}
      onSecondarySubmit={handleCancelClick}>
      {createMode ? renderCreateForm() : renderList()}
    </Modal>
  );
}
