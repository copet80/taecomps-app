import React, { useMemo, useState } from 'react';

import { ContentSwitcher, InlineNotification, Modal, Stack, Switch } from '@carbon/react';
import { Tournament, SwitchTournamentFn } from '../../types';

enum FormState {
  Switching,
  SwitchError,
}

type Props = {
  isVisible?: boolean;
  currentTournament: Tournament;
  tournaments: Tournament[];
  switchCallback: SwitchTournamentFn;
  onSwitchSuccess: (tournament: Tournament) => void;
  onCancelClick: () => void;
};

export default function TournamentSwitcher({
  isVisible,
  currentTournament,
  tournaments,
  switchCallback,
  onSwitchSuccess,
  onCancelClick,
}: Props) {
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament>(currentTournament);
  const [formState, setFormState] = useState<FormState | null>(null);

  const isSwitching = useMemo(
    () => formState === FormState.Switching,
    [formState],
  );

  async function handleSwitch() {
    try {
      await switchCallback(selectedTournament);
      onSwitchSuccess(selectedTournament);
    } catch (error) {
      setFormState(FormState.SwitchError);
    }
  }

  function clearFormState() {
    setFormState(null);
  }

  function renderNotifications() {
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

  return (
    <Modal
      open={isVisible}
      modalLabel="Switch to another tournament"
      primaryButtonText="Switch"
      secondaryButtonText="Cancel"
      preventCloseOnClickOutside
      primaryButtonDisabled={isSwitching}
      onRequestSubmit={handleSwitch}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <Stack gap={6}>
        <ContentSwitcher onChange={console.log}>
          <Switch name={'first'} text="First section" />
          <Switch name={'second'} text="Second section" />
          <Switch name={'third'} text="Third section" />
        </ContentSwitcher>
      </Stack>
    </Modal>
  );
}
