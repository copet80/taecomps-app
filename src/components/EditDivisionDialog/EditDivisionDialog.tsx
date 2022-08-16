import React, { memo, useEffect, useMemo, useState } from 'react';

import { Dropdown, Form, Modal, NumberInput, Stack } from '@carbon/react';
import { v4 as uuid } from 'uuid';
import { number, object, string } from 'yup';

import { Division, Gender } from '../../types';
import { useValidation } from '../../hooks';
import {
  formAction,
  DIVISION_AGE_MIN,
  DIVISION_AGE_MAX,
  DIVISION_WEIGHT_MAX,
  DIVISION_WEIGHT_MIN,
  DIVISION_NUM_ROUNDS_MIN,
  DIVISION_NUM_ROUNDS_MAX,
  DIVISION_DURATION_MIN,
  DIVISION_DURATION_MAX,
  normalizeNumberInputChange,
} from '../../utils';
import { DateTime } from 'luxon';

enum DateMode {
  None,
  StartEnd,
  StartOnly,
  EndOnly,
}

type FormValues = {
  belt: string;
  minAge: number;
  maxAge: number;
  minWeight: number;
  maxWeight: number;
  gender: Gender;
  numRounds: number;
  duration: number;
};

type Props = {
  isVisible?: boolean;
  division?: Division | undefined;
  belts: string;
  onCancelClick: () => void;
  onSaveClick: (division: Division) => void;
};

function createBlankDivision(): Division {
  return {
    id: uuid(),
    belt: '',
    gender: '',
    minAge: DIVISION_AGE_MIN,
    maxAge: DIVISION_AGE_MAX,
    minWeight: DIVISION_WEIGHT_MIN,
    maxWeight: DIVISION_WEIGHT_MAX,
    numRounds: DIVISION_NUM_ROUNDS_MIN,
    duration: DIVISION_DURATION_MIN,
    createdAt: DateTime.now().toISO(),
    entryIds: [],
  };
}

function convertToFormValues(division: Division): FormValues {
  return {
    belt: division.belt,
    gender: division.gender,
    minAge: division.minAge,
    maxAge: division.maxAge,
    minWeight: division.minWeight,
    maxWeight: division.maxWeight,
    numRounds: division.numRounds,
    duration: division.duration,
  };
}

function EditDivisionDialog({
  isVisible,
  division,
  belts,
  onCancelClick,
  onSaveClick,
}: Props) {
  const [formValues, setFormValues] = useState<FormValues>(
    convertToFormValues(division || createBlankDivision()),
  );

  const arBelts = useMemo(
    () => (belts || '').split(',').map((b) => b.trim()),
    [belts],
  );
  const beltOptions = useMemo(
    () => arBelts.map((b) => ({ label: b, value: b })),
    [arBelts],
  );
  const genderOptions = useMemo(
    () => ['Male', 'Female'].map((g) => ({ label: g, value: g })),
    [],
  );

  const updateSchema = useMemo(() => {
    return object({
      belt: string().oneOf(arBelts, () => ({
        field: 'belt',
        key: 'oneOf',
        message: `Please select a belt color`,
      })),
      gender: string().required(() => ({
        field: 'gender',
        key: 'required',
        message: `Please select a gender`,
      })),
      minAge: number()
        .min(DIVISION_AGE_MIN, () => ({
          field: 'minAge',
          key: 'min',
          message: `Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`,
        }))
        .max(DIVISION_AGE_MAX, () => ({
          field: 'minAge',
          key: 'max',
          message: `Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`,
        })),
      maxAge: number()
        .min(DIVISION_AGE_MIN, () => ({
          field: 'maxAge',
          key: 'min',
          message: `Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`,
        }))
        .max(DIVISION_AGE_MAX, () => ({
          field: 'maxAge',
          key: 'max',
          message: `Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`,
        })),
      minWeight: number()
        .min(DIVISION_WEIGHT_MIN, () => ({
          field: 'minWeight',
          key: 'min',
          message: `Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`,
        }))
        .max(DIVISION_WEIGHT_MAX, () => ({
          field: 'minWeight',
          key: 'max',
          message: `Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`,
        })),
      maxWeight: number()
        .min(DIVISION_WEIGHT_MIN, () => ({
          field: 'maxWeight',
          key: 'min',
          message: `Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`,
        }))
        .max(DIVISION_WEIGHT_MAX, () => ({
          field: 'maxWeight',
          key: 'max',
          message: `Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`,
        })),
      numRounds: number()
        .min(DIVISION_NUM_ROUNDS_MIN, () => ({
          field: 'numRounds',
          key: 'min',
          message: `Please enter between ${DIVISION_NUM_ROUNDS_MIN} and ${DIVISION_NUM_ROUNDS_MAX}`,
        }))
        .max(DIVISION_NUM_ROUNDS_MAX, () => ({
          field: 'numRounds',
          key: 'max',
          message: `Please enter between ${DIVISION_NUM_ROUNDS_MIN} and ${DIVISION_NUM_ROUNDS_MAX}`,
        })),
      duration: number()
        .min(DIVISION_DURATION_MIN, () => ({
          field: 'duration',
          key: 'min',
          message: `Please enter between ${DIVISION_DURATION_MIN} and ${DIVISION_DURATION_MAX}`,
        }))
        .max(DIVISION_DURATION_MAX, () => ({
          field: 'duration',
          key: 'max',
          message: `Please enter between ${DIVISION_DURATION_MIN} and ${DIVISION_DURATION_MAX}`,
        })),
    });
  }, []);

  const { clearError, clearAllErrors, setSchema, validate, validationProps } =
    useValidation(updateSchema);

  useEffect(() => {
    setSchema(updateSchema);
  }, [updateSchema]);

  useEffect(() => {
    if (isVisible && division) {
      setFormValues(convertToFormValues(division));
      clearAllErrors();
    }
  }, [division, isVisible]);

  function updateFormValue(field: string, value: any) {
    setFormValues({
      ...formValues,
      [field]: value,
    });
    clearError(field);
  }

  async function handleSaveClick() {
    const isValid = await validate({
      ...formValues,
    });

    if (!isValid) {
      return;
    }

    const updatedDivision: Division = {
      ...createBlankDivision(),
      ...(division || {}),
      ...formValues,
    };

    onSaveClick(updatedDivision);
  }

  return (
    <Modal
      open={isVisible}
      primaryButtonText="Save changes"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleSaveClick}
      onRequestClose={onCancelClick}
      onSecondarySubmit={onCancelClick}>
      <div className="EditDivisionDialog">
        <Stack gap={6}>
          <header>
            <h2>Edit Division</h2>
          </header>
          <main>
            <Form onSubmit={formAction(handleSaveClick)}>
              <Stack gap={6}>
                <div className="TwoColumnsDesktop">
                  <Dropdown
                    id="gender"
                    titleText="Gender"
                    label="Select a gender"
                    items={genderOptions}
                    selectedItem={formValues.gender}
                    {...validationProps('gender')}
                    onChange={({
                      selectedItem,
                    }: {
                      selectedItem: { value: string };
                    }) => {
                      updateFormValue('gender', selectedItem.value);
                    }}
                  />
                  <Dropdown
                    id="belt"
                    titleText="Belt color"
                    label="Select a belt color"
                    items={beltOptions}
                    selectedItem={formValues.belt}
                    {...validationProps('belt')}
                    onChange={({
                      selectedItem,
                    }: {
                      selectedItem: { value: string };
                    }) => {
                      updateFormValue('belt', selectedItem.value);
                    }}
                  />
                </div>
                <div className="TwoColumnsDesktop">
                  <NumberInput
                    id="minAge"
                    min={DIVISION_AGE_MIN}
                    max={DIVISION_AGE_MAX}
                    label="Min age"
                    value={isNaN(formValues.minAge) ? '' : formValues.minAge}
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('minAge', +value);
                    })}
                  />
                  <NumberInput
                    id="maxAge"
                    min={DIVISION_AGE_MIN}
                    max={DIVISION_AGE_MAX}
                    label="Max age"
                    value={isNaN(formValues.maxAge) ? '' : formValues.maxAge}
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_AGE_MIN} and ${DIVISION_AGE_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('maxAge', +value);
                    })}
                  />
                </div>
                <div className="TwoColumnsDesktop">
                  <NumberInput
                    id="minWeight"
                    min={DIVISION_WEIGHT_MIN}
                    max={DIVISION_WEIGHT_MAX}
                    label="Min weight (in kg)"
                    value={
                      isNaN(formValues.minWeight) ? '' : formValues.minWeight
                    }
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('minWeight', +value);
                    })}
                  />
                  <NumberInput
                    id="maxWeight"
                    min={DIVISION_WEIGHT_MIN}
                    max={DIVISION_WEIGHT_MAX}
                    label="Max weight (in kg)"
                    value={
                      isNaN(formValues.maxWeight) ? '' : formValues.maxWeight
                    }
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('maxWeight', +value);
                    })}
                  />
                </div>
                <div className="TwoColumnsDesktop">
                  <NumberInput
                    id="numRounds"
                    min={DIVISION_WEIGHT_MIN}
                    max={DIVISION_WEIGHT_MAX}
                    label="Number of rounds"
                    value={
                      isNaN(formValues.numRounds) ? '' : formValues.numRounds
                    }
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_WEIGHT_MIN} and ${DIVISION_WEIGHT_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('numRounds', +value);
                    })}
                  />
                  <NumberInput
                    id="duration"
                    min={DIVISION_DURATION_MIN}
                    max={DIVISION_DURATION_MAX}
                    label="Duration per round (in seconds)"
                    value={
                      isNaN(formValues.duration) ? '' : formValues.duration
                    }
                    iconDescription=""
                    invalidText={`Please enter between ${DIVISION_DURATION_MIN} and ${DIVISION_DURATION_MAX}`}
                    onChange={normalizeNumberInputChange((value: any) => {
                      updateFormValue('duration', +value);
                    })}
                  />
                </div>
              </Stack>
            </Form>
          </main>
        </Stack>
      </div>
    </Modal>
  );
}

export default memo(EditDivisionDialog);
