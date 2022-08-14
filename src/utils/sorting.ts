import { DateTime } from 'luxon';

import { Entry, SortInfo, Tournament } from '../types';

export function sortTournamentByName(a: Tournament, b: Tournament): number {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}

export function sortTournamentByDate(a: Tournament, b: Tournament): number {
  const aDate = DateTime.fromISO(a.modifiedAt || a.createdAt);
  const bDate = DateTime.fromISO(b.modifiedAt || b.createdAt);
  if (aDate > bDate) {
    return -1;
  }
  if (aDate < bDate) {
    return 1;
  }
  return 0;
}

export function sortEntryByName(a: Entry, b: Entry): number {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}

export function sortOptionByLabel(
  a: { label: string },
  b: { label: string },
): number {
  const aLabel = a.label.toLowerCase();
  const bLabel = b.label.toLowerCase();
  if (aLabel < bLabel) {
    return -1;
  }
  if (aLabel > bLabel) {
    return 1;
  }
  return 0;
}

export type SortEntryFn = (a: Entry, b: Entry) => number;
export type SortableStringEntryColumns = 'name' | 'club' | 'belt' | 'gender';
export type SortableNumberEntryColumns = 'age' | 'weight';
export type SortableDateEntryColumns = 'createdAt';

export function createSortEntry(sortInfo: SortInfo): SortEntryFn {
  const { headerKey, sortDirection } = sortInfo;
  switch (headerKey) {
    case 'createdAt':
      return (a: Entry, b: Entry): number => {
        const aValue = DateTime.fromISO(
          a[sortInfo.headerKey as SortableDateEntryColumns],
        );
        const bValue = DateTime.fromISO(
          b[sortInfo.headerKey as SortableDateEntryColumns],
        );
        if (aValue < bValue) {
          return sortDirection === 'ASC' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'ASC' ? 1 : -1;
        }
        return 0;
      };

    case 'age':
    case 'weight':
      return (a: Entry, b: Entry): number => {
        const aValue = a[sortInfo.headerKey as SortableNumberEntryColumns];
        const bValue = b[sortInfo.headerKey as SortableNumberEntryColumns];
        if (aValue < bValue) {
          return sortDirection === 'ASC' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'ASC' ? 1 : -1;
        }
        return 0;
      };

    default:
      return (a: Entry, b: Entry): number => {
        const aValue =
          a[sortInfo.headerKey as SortableStringEntryColumns].toLowerCase();
        const bValue =
          b[sortInfo.headerKey as SortableStringEntryColumns].toLowerCase();
        if (aValue < bValue) {
          return sortDirection === 'ASC' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === 'ASC' ? 1 : -1;
        }
        return 0;
      };
  }
}
