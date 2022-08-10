import React, { FormEvent, memo, useEffect, useMemo, useState } from 'react';

import {
  ContentSwitcher,
  DatePicker,
  DatePickerInput,
  Form,
  FormLabel,
  InlineNotification,
  Modal,
  Stack,
  Switch,
  TextArea,
  TextInput,
} from '@carbon/react';
import { DateTime } from 'luxon';
import { date, DateSchema, object, string } from 'yup';

import { Tournament } from '../../../types';
import { useApi, useValidation } from '../../../hooks';
import {
  TOURNAMENT_DESCRIPTION_MAX_LENGTH,
  TOURNAMENT_NAME_MAX_LENGTH,
  getLocale,
} from '../../../utils';

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
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  dateMode: DateMode;
};

type Props = {
  isVisible?: boolean;
  tournament: Tournament;
  onCancelClick: () => void;
  onUpdateSuccess: (tournament: Tournament) => void;
};

function getDateMode(tournament: Tournament): DateMode {
  const { startDate, endDate } = tournament;
  if (startDate && endDate) return DateMode.StartEnd;
  if (startDate) return DateMode.StartOnly;
  if (endDate) return DateMode.EndOnly;
  return DateMode.None;
}

function convertToFormValues(tournament: Tournament): FormValues {
  return {
    name: tournament.name,
    description: tournament.description || '',
    startDate: tournament.startDate
      ? DateTime.fromISO(tournament.startDate).toJSDate()
      : null,
    endDate: tournament.endDate
      ? DateTime.fromISO(tournament.endDate).toJSDate()
      : null,
    dateMode: getDateMode(tournament),
  };
}

function TournamentDetailsEdit({
  isVisible,
  tournament,
  onCancelClick,
  onUpdateSuccess,
}: Props) {
  const { updateTournament } = useApi();
  const [formState, setFormState] = useState<FormState | undefined>(undefined);
  const [formValues, setFormValues] = useState<FormValues>(
    convertToFormValues(tournament),
  );
  const { dateMode } = formValues;
  const locale = getLocale().toLowerCase();

  const isSubmitting = useMemo(
    () => formState === FormState.Updating,
    [formState],
  );

  const useStartDate = useMemo(
    () => [DateMode.StartEnd, DateMode.StartOnly].includes(dateMode),
    [dateMode],
  );
  const useEndDate = useMemo(
    () => [DateMode.StartEnd, DateMode.EndOnly].includes(dateMode),
    [dateMode],
  );

  const updateSchema = useMemo(() => {
    const dateSchema: { endDate?: DateSchema } = {};
    if (useEndDate) {
      if (useStartDate && formValues.startDate) {
        dateSchema.endDate = date().min(formValues.startDate, () => ({
          field: 'endDate',
          key: 'min',
          message: 'Tournament end date cannot be before its start date',
        }));
      }
    }

    return object({
      name: string()
        .required(() => ({
          field: 'name',
          key: 'required',
          message: 'Please enter a name for the tournament',
        }))
        .max(TOURNAMENT_NAME_MAX_LENGTH, () => ({
          field: 'name',
          key: 'max',
          message: `Please enter a maximum of ${TOURNAMENT_NAME_MAX_LENGTH} characters`,
        })),
      description: string().max(TOURNAMENT_DESCRIPTION_MAX_LENGTH, () => ({
        field: 'description',
        key: 'max',
        message: `Please enter a maximum of ${TOURNAMENT_DESCRIPTION_MAX_LENGTH} characters`,
      })),
      // ...dateSchema,
    });
  }, [formValues]);

  const { clearError, clearAllErrors, setSchema, validate, validationProps } =
    useValidation(updateSchema);

  useEffect(() => {
    setSchema(updateSchema);
  }, [updateSchema]);

  useEffect(() => {
    if (isVisible) {
      setFormValues(convertToFormValues(tournament));
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

  function handleDateModeChange({ name }: { name: DateMode }) {
    setFormValues({ ...formValues, dateMode: name });
    clearError('startDate');
    clearError('endDate');
    clearFormState();
  }

  async function handleUpdate() {
    const isValid = await validate(formValues);

    if (!isValid) {
      return;
    }

    setFormState(FormState.Updating);

    try {
      const updatedTournament = {
        ...tournament,
        name: formValues.name,
        description: formValues.description,
        startDate:
          useStartDate && formValues.startDate
            ? DateTime.fromJSDate(formValues.startDate).toISODate()
            : '',
        endDate:
          useEndDate && formValues.endDate
            ? DateTime.fromJSDate(formValues.endDate).toISODate()
            : '',
      };
      await updateTournament(updatedTournament);
      onUpdateSuccess(updatedTournament);
    } catch (error) {
      setFormState(FormState.UpdateError);
    }
  }

  function renderNotifications() {
    switch (formState) {
      case FormState.UpdateError:
        return (
          <InlineNotification
            kind="error"
            subtitle="There is a problem updating this tournament."
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
      primaryButtonText="Save changes"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={isSubmitting}
      onRequestSubmit={handleUpdate}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="TournamentDetailsContainer">
        <Stack gap={6}>
          <header>
            <h2>Tournament Details</h2>
          </header>
          <main>
            <Form>
              <Stack gap={6}>
                <TextInput
                  data-modal-primary-focus
                  required
                  maxLength={TOURNAMENT_NAME_MAX_LENGTH}
                  id="name"
                  type="text"
                  labelText="Tournament name"
                  value={formValues.name}
                  disabled={isSubmitting}
                  {...validationProps('name')}
                  onChange={(event: FormEvent<HTMLInputElement>) => {
                    updateFormValue('name', event.currentTarget.value);
                  }}
                />
                <TextArea
                  maxLength={TOURNAMENT_DESCRIPTION_MAX_LENGTH}
                  id="description"
                  labelText="Description / notes"
                  value={formValues.description}
                  disabled={isSubmitting}
                  {...validationProps('description')}
                  onChange={(event: FormEvent<HTMLTextAreaElement>) => {
                    updateFormValue('description', event.currentTarget.value);
                  }}
                />
                <Stack gap={3}>
                  <FormLabel>Tournament dates</FormLabel>
                  <ContentSwitcher
                    selectedIndex={dateMode}
                    disabled={isSubmitting}
                    onChange={({ name }: { name: DateMode }) => {
                      updateFormValue('dateMode', name);
                    }}>
                    <Switch name={DateMode.None}>None</Switch>
                    <Switch name={DateMode.StartEnd}>
                      Start &amp; end dates
                    </Switch>
                    <Switch name={DateMode.StartOnly}>Only start date</Switch>
                    <Switch name={DateMode.EndOnly}>Only end date</Switch>
                  </ContentSwitcher>
                </Stack>
                {dateMode !== DateMode.None && (
                  <Stack gap={6} orientation="horizontal">
                    {useStartDate && (
                      <DatePicker
                        locale={locale}
                        dateFormat="d/m/Y"
                        datePickerType="single"
                        value={formValues.startDate}
                        {...validationProps('startDate')}
                        onChange={([value]: Date[]) => {
                          updateFormValue('startDate', value);
                        }}>
                        <DatePickerInput
                          id="startDate"
                          labelText="Start date"
                          placeholder="dd/mm/yyyy"
                          disabled={isSubmitting}
                        />
                      </DatePicker>
                    )}
                    {useEndDate && (
                      <DatePicker
                        locale={locale}
                        dateFormat="d/m/Y"
                        datePickerType="single"
                        value={formValues.endDate}
                        {...validationProps('endDate')}
                        onChange={([value]: Date[]) => {
                          updateFormValue('endDate', value);
                        }}>
                        <DatePickerInput
                          id="endDate"
                          labelText="End date"
                          placeholder="dd/mm/yyyy"
                          disabled={isSubmitting}
                        />
                      </DatePicker>
                    )}
                  </Stack>
                )}
                {renderNotifications()}
              </Stack>
            </Form>
          </main>
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(TournamentDetailsEdit);
