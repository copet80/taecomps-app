import React, { memo, useEffect, useMemo, useState } from 'react';

import { InlineNotification, Modal, Stack } from '@carbon/react';

import { Tournament } from '../../types';
import { useApi } from '../../hooks';

enum FormState {
  Deleting,
  DeleteError,
}

type Props = {
  isVisible?: boolean;
  tournament: Tournament;
  onCancelClick: () => void;
  onDeleteSuccess: () => void;
};

function DeleteTournamentDialog({
  isVisible,
  tournament,
  onCancelClick,
  onDeleteSuccess: onDeleteSuccess,
}: Props) {
  const { deleteTournament } = useApi();
  const [formState, setFormState] = useState<FormState | undefined>(undefined);

  const isSubmitting = useMemo(
    () => formState === FormState.Deleting,
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

  async function handleDelete() {
    setFormState(FormState.Deleting);

    try {
      await deleteTournament(tournament.id);
      onDeleteSuccess();
    } catch (error) {
      setFormState(FormState.DeleteError);
    }
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.DeleteError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem deleting this tournament."
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
      primaryButtonText="Delete permanently"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isSubmitting}
      onRequestSubmit={handleDelete}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="DeleteTournamentDialog">
        <Stack gap={6}>
          <header>
            <h2>Delete Tournament</h2>
          </header>
          <main>
            <Stack gap={6}>
              <Stack gap={2}>
                <p>
                  You are about to delete the following tournament permanently:
                </p>
                <h4>{tournament.name}</h4>
              </Stack>
              <p>
                Once deleted, you won't be able to view its entries and bracket.
                Are you sure?
              </p>
            </Stack>
          </main>
          {renderNotifications()}
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(DeleteTournamentDialog);
