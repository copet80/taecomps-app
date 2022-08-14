import React, { memo, useEffect, useMemo, useState } from 'react';

import { InlineNotification, Modal, Stack } from '@carbon/react';

import { Tournament } from '../../types';
import { useApi } from '../../hooks';

enum FormState {
  Unarchiving,
  UnarchiveError,
}

type Props = {
  isVisible?: boolean;
  tournament: Tournament;
  onCancelClick: () => void;
  onUnarchiveSuccess: () => void;
};

function UnarchiveTournamentDialog({
  isVisible,
  tournament,
  onCancelClick,
  onUnarchiveSuccess,
}: Props) {
  const { unarchiveTournament } = useApi();
  const [formState, setFormState] = useState<FormState | undefined>(undefined);

  const isSubmitting = useMemo(
    () => formState === FormState.Unarchiving,
    [formState],
  );

  useEffect(() => {
    if (isVisible) {
      clearFormState();
    }
  }, [isVisible]);

  function clearFormState() {
    setFormState(undefined);
  }

  async function handleUnarchive() {
    setFormState(FormState.Unarchiving);

    try {
      await unarchiveTournament(tournament.id);
      onUnarchiveSuccess();
    } catch (error) {
      setFormState(FormState.UnarchiveError);
    }
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.UnarchiveError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem reopening this tournament."
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
      primaryButtonText="Reopen tournament"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isSubmitting}
      onRequestSubmit={handleUnarchive}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="UnarchiveTournamentDialog">
        <Stack gap={6}>
          <header>
            <h2>Reopen Tournament</h2>
          </header>
          <main>
            <Stack gap={6}>
              <Stack gap={2}>
                <p>You are about to reopen the following tournament:</p>
                <h4>{tournament.name}</h4>
              </Stack>
              <p>
                Once reopened, you'll be able to view and edit its entries and
                bracket. Are you sure?
              </p>
            </Stack>
          </main>
          {renderNotifications()}
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(UnarchiveTournamentDialog);
