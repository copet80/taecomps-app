import React, { memo, useEffect, useMemo, useState } from 'react';

import { InlineNotification, Modal, Stack } from '@carbon/react';

import { Entry } from '../../types';
import { useApi } from '../../hooks';

enum FormState {
  Deleting,
  DeleteError,
}

type Props = {
  isVisible?: boolean;
  entry: Entry;
  onCancelClick: () => void;
  onDeleteSuccess: () => void;
};

function DeleteEntryDialog({
  isVisible,
  entry,
  onCancelClick,
  onDeleteSuccess: onDeleteSuccess,
}: Props) {
  const { deleteEntry } = useApi();
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
      await deleteEntry(entry);
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
            subtitle="There is a problem deleting this entry."
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
      <div className="DeleteEntryDialog">
        <Stack gap={6}>
          <header>
            <h2>Delete Entry</h2>
          </header>
          <main>
            <Stack gap={6}>
              <Stack gap={2}>
                <p>
                  You are about to delete the entry for the following
                  participant permanently:
                </p>
                <h4>{entry.name}</h4>
              </Stack>
              <p>
                Once deleted, the participant can no longer participate in the
                tournament. Are you sure?
              </p>
            </Stack>
          </main>
          {renderNotifications()}
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(DeleteEntryDialog);
