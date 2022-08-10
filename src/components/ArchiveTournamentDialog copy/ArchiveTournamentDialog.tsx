import React, { FormEvent, memo, useEffect, useMemo, useState } from 'react';

import { InlineNotification, Modal, Stack } from '@carbon/react';

import { Tournament } from '../../types';
import { useApi } from '../../hooks';

enum FormState {
  Archiving,
  ArchiveError,
}

type Props = {
  isVisible?: boolean;
  tournament: Tournament;
  onCancelClick: () => void;
  onArchiveSuccess: () => void;
};

function ArchiveTournamentDialog({
  isVisible,
  tournament,
  onCancelClick,
  onArchiveSuccess,
}: Props) {
  const { archiveTournament } = useApi();
  const [formState, setFormState] = useState<FormState | undefined>(undefined);

  const isSubmitting = useMemo(
    () => formState === FormState.Archiving,
    [formState],
  );

  async function handleArchive() {
    setFormState(FormState.Archiving);

    try {
      await archiveTournament(tournament.id);
      onArchiveSuccess();
    } catch (error) {
      setFormState(FormState.ArchiveError);
    }
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.ArchiveError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem archiving this tournament."
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
      danger
      primaryButtonText="Archive tournament"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isSubmitting}
      onRequestSubmit={handleArchive}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="ArchiveTournamentDialog">
        <Stack gap={6}>
          <header>
            <h2>Archive Tourmanent</h2>
          </header>
          <main>
            <Stack gap={6}>
              <Stack gap={2}>
                <p>You are about to archive the following tournament:</p>
                <h4>{tournament.name}</h4>
              </Stack>
              <p>
                Once archived, you'll still be able to view its entries and
                bracket, but you can no longer edit them. Are you sure?
              </p>
            </Stack>
          </main>
          {renderNotifications()}
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(ArchiveTournamentDialog);
