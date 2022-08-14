import React, { FormEvent, memo, useEffect, useMemo, useState } from 'react';

import { Dropdown, Search } from '@carbon/react';

import './BracketFilters.scss';

export type FilterCriteria = {
  searchQuery: string;
  belt: string;
  club: string;
};

type Props = {
  belts: string[];
  clubs: string[];
  onChange: (criteria: FilterCriteria) => void;
};

function BracketFilters({ belts, clubs, onChange }: Props) {
  const [criteria, setCriteria] = useState<FilterCriteria>({
    searchQuery: '',
    belt: '',
    club: '',
  });

  const beltOptions = useMemo(
    () => [
      {
        label: 'Filter by belt',
        value: '',
      },
      ...belts.map((b) => ({ label: b.trim(), value: b.trim() })),
    ],
    [belts],
  );
  const clubOptions = useMemo(
    () => [
      {
        label: 'Filter by club',
        value: '',
      },
      ...clubs.map((c) => ({ label: c.trim(), value: c.trim() })),
    ],
    [clubs],
  );

  useEffect(() => {
    onChange(criteria);
  }, [criteria]);

  return (
    <div className="BracketFilters">
      <Search
        size="lg"
        id="searchQuery"
        placeholder="Search by name or match number"
        closeButtonLabelText="Clear search input"
        onChange={(event: FormEvent<HTMLInputElement>) =>
          setCriteria({
            ...criteria,
            searchQuery: (event?.target as HTMLInputElement).value,
          })
        }
      />
      <Dropdown
        size="lg"
        id="beltFilter"
        label="Filter by belt"
        items={beltOptions}
        onChange={({ selectedItem }: { selectedItem: { value: string } }) => {
          setCriteria({
            ...criteria,
            belt: selectedItem.value,
          });
        }}
      />
      <Dropdown
        size="lg"
        id="clubFilter"
        label="Filter by club"
        items={clubOptions}
        onChange={({ selectedItem }: { selectedItem: { value: string } }) => {
          setCriteria({
            ...criteria,
            club: selectedItem.value,
          });
        }}
      />
    </div>
  );
}

export default memo(BracketFilters);
