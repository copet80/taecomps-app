import React, { FormEvent, memo, useEffect, useMemo, useState } from 'react';

import {
  Dropdown,
  Form,
  InlineNotification,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from '@carbon/react';
import { object, string } from 'yup';

import { Entry, Tournament } from '../../types';
import { useApi, useValidation } from '../../hooks';
import {
  formAction,
  ENTRY_NAME_MAX_LENGTH,
  ENTRY_AGE_MIN,
  ENTRY_AGE_MAX,
  ENTRY_WEIGHT_MIN,
  ENTRY_WEIGHT_MAX,
  normalizeDropdownChange,
} from '../../utils';
import { number } from 'yup';

enum FormState {
  Updating,
  UpdateError,
}

enum DateMode {
  None,
  StartEnd,
  StartOnly,
  EndOnly,
}

type FormValues = {
  name: string;
  age: number;
  belt: string;
  club: string;
  weight: number;
};

type Props = {
  isVisible?: boolean;
  tournament: Tournament;
  entry: Entry;
  onCancelClick: () => void;
  onUpdateSuccess: (entry: Entry) => void;
};

function convertToFormValues(entry: Entry): FormValues {
  const { name, age, belt, club, weight } = entry;
  return { name, age, belt, club, weight };
}

function EditEntryDialog({
  isVisible,
  tournament,
  entry,
  onCancelClick,
  onUpdateSuccess,
}: Props) {
  const { createEntry, updateEntry } = useApi();
  const [formState, setFormState] = useState<FormState | undefined>(undefined);
  const [formValues, setFormValues] = useState<FormValues>(
    convertToFormValues(entry),
  );

  const isSubmitting = useMemo(
    () => formState === FormState.Updating,
    [formState],
  );

  const { clubs, belts } = tournament;
  const arClubs = useMemo(
    () => (clubs || '').split(',').map((c) => c.trim()),
    [clubs],
  );
  const arBelts = useMemo(
    () => (belts || '').split(',').map((b) => b.trim()),
    [belts],
  );

  const clubOptions = useMemo(
    () => arClubs.map((c) => ({ label: c, value: c })),
    [arClubs],
  );
  const beltOptions = useMemo(
    () => arBelts.map((b) => ({ label: b, value: b })),
    [arBelts],
  );

  const updateSchema = useMemo(() => {
    return object({
      name: string()
        .required(() => ({
          field: 'name',
          key: 'required',
          message: `Please enter the participant's full name`,
        }))
        .max(ENTRY_NAME_MAX_LENGTH, () => ({
          field: 'name',
          key: 'max',
          message: `Please enter a maximum of ${ENTRY_NAME_MAX_LENGTH} characters`,
        })),
      age: number()
        .min(ENTRY_AGE_MIN, () => ({
          field: 'age',
          key: 'min',
          message: `Please enter between ${ENTRY_AGE_MIN} and ${ENTRY_AGE_MAX}`,
        }))
        .max(ENTRY_AGE_MAX, () => ({
          field: 'age',
          key: 'max',
          message: `Please enter between ${ENTRY_AGE_MIN} and ${ENTRY_AGE_MAX}`,
        })),
      weight: number()
        .min(ENTRY_WEIGHT_MIN, () => ({
          field: 'weight',
          key: 'min',
          message: `Please enter between ${ENTRY_WEIGHT_MIN} and ${ENTRY_WEIGHT_MAX}`,
        }))
        .max(ENTRY_WEIGHT_MAX, () => ({
          field: 'weight',
          key: 'max',
          message: `Please enter between ${ENTRY_WEIGHT_MIN} and ${ENTRY_WEIGHT_MAX}`,
        })),
      belt: string().oneOf(arBelts, () => ({
        field: 'belt',
        key: 'oneOf',
        message: `Please select a belt`,
      })),
      club: string().oneOf(arClubs, () => ({
        field: 'club',
        key: 'oneOf',
        message: `Please select a club`,
      })),
    });
  }, [arClubs, arBelts]);

  const { clearError, clearAllErrors, setSchema, validate, validationProps } =
    useValidation(updateSchema);

  useEffect(() => {
    setSchema(updateSchema);
  }, [updateSchema]);

  useEffect(() => {
    if (isVisible) {
      setFormValues(convertToFormValues(entry));
      clearFormState();
      clearAllErrors();
    }
  }, [isVisible]);

  function clearFormState() {
    setFormState(undefined);
  }

  function updateFormValue(field: string, value: any) {
    setFormValues({
      ...formValues,
      [field]: value,
    });
    clearError(field);
    clearFormState();
  }

  async function handleSave() {
    const isValid = await validate(formValues);

    if (!isValid) {
      return;
    }

    setFormState(FormState.Updating);

    try {
      const entryToSave = {
        ...entry,
        name: formValues.name,
        age: formValues.age,
        weight: formValues.weight,
        belt: formValues.belt,
        club: formValues.club,
      };
      if (entryToSave.id) {
        await updateEntry(entryToSave);
      } else {
        await createEntry(tournament.id, entryToSave);
      }
      onUpdateSuccess(entryToSave);
    } catch (error) {
      console.log(error);
      setFormState(FormState.UpdateError);
    }
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.UpdateError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem saving this entry."
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
      className="hasDropdown"
      open={isVisible}
      primaryButtonText="Save changes"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isSubmitting}
      onRequestSubmit={handleSave}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="EditEntryDialog">
        <Stack gap={6}>
          <header>
            <h2>Entry Details</h2>
          </header>
          <main>
            <Form onSubmit={formAction(handleSave)}>
              <Stack gap={6}>
                <TextInput
                  data-modal-primary-focus
                  required
                  maxLength={ENTRY_NAME_MAX_LENGTH}
                  id="name"
                  type="text"
                  labelText="Participant name"
                  value={formValues.name}
                  disabled={isSubmitting}
                  {...validationProps('name')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    updateFormValue('name', event.currentTarget.value);
                  }}
                />
                <Dropdown
                  id="club"
                  titleText="Participant's club"
                  label="Select a club"
                  items={clubOptions}
                  selectedItem={formValues.club}
                  disabled={isSubmitting}
                  {...validationProps('club')}
                  onChange={({
                    selectedItem,
                  }: {
                    selectedItem: { value: string };
                  }) => {
                    updateFormValue('club', selectedItem.value);
                  }}
                />
                <Dropdown
                  id="belt"
                  titleText="Belt color"
                  label="Select a belt color"
                  items={beltOptions}
                  selectedItem={formValues.belt}
                  disabled={isSubmitting}
                  {...validationProps('belt')}
                  onChange={({
                    selectedItem,
                  }: {
                    selectedItem: { value: string };
                  }) => {
                    updateFormValue('belt', selectedItem.value);
                  }}
                />
                <Stack gap={6} orientation="horizontal">
                  <NumberInput
                    id="age"
                    min={ENTRY_AGE_MIN}
                    max={ENTRY_AGE_MAX}
                    label="Age"
                    value={formValues.age}
                    disabled={isSubmitting}
                    iconDescription=""
                    invalidText={`Please enter between ${ENTRY_AGE_MIN} and ${ENTRY_AGE_MAX}`}
                    onChange={normalizeDropdownChange((value: any) => {
                      updateFormValue('age', +value);
                    })}
                  />
                  <NumberInput
                    id="weight"
                    min={ENTRY_WEIGHT_MIN}
                    max={ENTRY_WEIGHT_MAX}
                    label="Weight (in kg)"
                    value={formValues.weight}
                    disabled={isSubmitting}
                    iconDescription=""
                    invalidText={`Please enter between ${ENTRY_WEIGHT_MIN} and ${ENTRY_WEIGHT_MAX}`}
                    onChange={normalizeDropdownChange((value: any) => {
                      updateFormValue('weight', +value);
                    })}
                  />
                </Stack>
                {renderNotifications()}
              </Stack>
            </Form>
          </main>
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(EditEntryDialog);
