import React, { memo } from 'react';

import { IconButton } from '@carbon/react';
import { Edit as EditIcon } from '@carbon/icons-react';

import './DivisionTitle.scss';

import { GenderIcon } from '../../../components';
import { Division } from '../../../types';

type Props = {
  division: Division;
  onEditClick: (division: Division) => void;
};

function DivisionTitle({ division, onEditClick }: Props) {
  const { gender, belt, minAge, maxAge, minWeight, maxWeight } = division;

  function handleEditClick(event: Event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    onEditClick(division);
  }

  return (
    <div className="DivisionTitle">
      <div className="DivisionTitle__info">
        <h5>
          <GenderIcon gender={gender} />
          &nbsp;&nbsp;&nbsp;{gender}&nbsp;&nbsp;&nbsp;{minAge}-{maxAge}y
        </h5>
        &#183;<span>{belt} Belt</span>&#183;
        <span>
          {minWeight}-{maxWeight}kg
        </span>
      </div>
      <IconButton kind="ghost" label="Edit" onClick={handleEditClick}>
        <EditIcon />
      </IconButton>
    </div>
  );
}

export default memo(DivisionTitle);
