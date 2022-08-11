import React, { memo } from 'react';

import {
  GenderMale as GenderMaleIcon,
  GenderFemale as GenderFemaleIcon,
} from '@carbon/icons-react';

import './GenderIcon.scss';

import { Gender } from '../../types';

type Props = {
  gender: Gender;
};

function GenderIcon({ gender }: Props) {
  return (
    <span className="GenderIcon">
      {gender === 'Male' ? (
        <GenderMaleIcon aria-label="Male" className="gender-male" />
      ) : (
        <GenderFemaleIcon aria-label="Female" className="gender-female" />
      )}
    </span>
  );
}

export default memo(GenderIcon);
