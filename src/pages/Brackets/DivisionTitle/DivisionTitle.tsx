import React, { memo } from 'react';

import './DivisionTitle.scss';

import { GenderIcon } from '../../../components';
import { Division } from '../../../types';

type Props = {
  division: Division;
};

function DivisionTitle({ division }: Props) {
  const { gender, belt, minAge, maxAge, minWeight, maxWeight } = division;
  return (
    <div className="DivisionTitle">
      <h5>
        <GenderIcon gender={gender} />
        &nbsp;&nbsp;&nbsp;{gender}&nbsp;&nbsp;&nbsp;{minAge}-{maxAge}y
      </h5>
      &#183;<span>{belt} Belt</span>&#183;
      <span>
        {minWeight}-{maxWeight}kg
      </span>
    </div>
  );
}

export default memo(DivisionTitle);
