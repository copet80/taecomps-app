import React, { FormEvent, useEffect, useMemo, useState } from 'react';

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
import { object, string } from 'yup';

import './TournamentSwitcher.scss';

import { useValidation } from '../../hooks';
import {
  Tournament,
  SwitchTournamentFn,
  CreateTournamentFn,
} from '../../types';
import { formatTournamentDate } from '../../utils';

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
  tournaments,
  createCallback,
  switchCallback,
  onCreateSuccess,
  onSwitchSuccess,
  onCloseClick,
}: Props) {
  const { clearError, validate, validationProps } =
    useValidation(tournamentSchema);
  const [selectedTournament, setSelectedTournament] = useState<
    Tournament | undefined
  >(currentTournament);
  const [formState, setFormState] = useState<FormState | undefined>(undefined);
  const [createMode, setCreateMode] = useState(false);
  const [tournamentName, setTournamentName] = useState('');

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

  function clearFormState() {
    setFormState(undefined);
  }

  async function handleSwitch() {
    if (!selectedTournament) {
      return;
    }

    try {
      await switchCallback(selectedTournament);
      onSwitchSuccess(selectedTournament);
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
      console.log(newTournament);
      onCreateSuccess(newTournament);
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
            <Stack gap={3}>
              <AddIcon />
              <h4>Create new tournament</h4>
            </Stack>
          </div>
        </ClickableTile>
        {tournaments.map((tournament) => (
          <ClickableTile value="1" key={tournament.id}>
            <div className="tile">
              <Stack gap={3}>
                <h4>{tournament.name}</h4>
                <div className="tournamentDate">
                  {formatTournamentDate(
                    tournament.startDate,
                    tournament.endDate,
                  )}
                </div>
                <p>{tournament.description}</p>
              </Stack>
            </div>
          </ClickableTile>
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
            subtitle={
              <span>
                There is a problem switching tournament. Please contact{' '}
                <a href="mailto:taecomps@gmail.com">taecomps@gmail.com</a>
              </span>
            }
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
        <Form>
          <TextInput
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
            subtitle={
              <span>
                There is a problem creating tournament. Please contact{' '}
                <a href="mailto:taecomps@gmail.com">taecomps@gmail.com</a>
              </span>
            }
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
          <ContentSwitcher onChange={console.log}>
            <Switch name="recent" text="Recent" />
            <Switch name="all" text="All tournaments" />
          </ContentSwitcher>
        </div>
        {renderTiles()}
        {renderSwitchNotifications()}
      </Stack>
    );
  }

  return (
    <Modal
      className="TournamentSwitcher"
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
