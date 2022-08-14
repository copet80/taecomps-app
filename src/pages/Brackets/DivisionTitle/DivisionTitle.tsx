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
  const {
    gender,
    belt,
    minAge,
    maxAge,
    minWeight,
    maxWeight,
    numRounds,
    duration,
  } = division;

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
          <span className="gender">{gender}</span>
          <span className="age">
            {minAge}-{maxAge}y
          </span>
        </h5>
        <div className="DivisionTitle__secondaryInfo">
          <span className="firstDot">&#183;</span>
          <span>{belt} Belt</span>
          <span className="secondDot">&#183;</span>
          <span>
            {minWeight}-{maxWeight}kg
          </span>
          <span className="thirdDot">&#183;</span>
          <span className="numRounds">
            {numRounds} rounds x {duration} secs
          </span>
        </div>
      </div>
      <IconButton kind="ghost" label="Edit" onClick={handleEditClick}>
        <EditIcon />
      </IconButton>
    </div>
  );
}

export default memo(DivisionTitle);
