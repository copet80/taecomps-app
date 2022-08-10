import { DateTime } from 'luxon';

import { Entry, Tournament } from '../types';

export function sortTournamentByName(a: Tournament, b: Tournament): number {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();
  if (aName < bName) {
    return -1;
  }
  if (bName > aName) {
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
  if (bDate < aDate) {
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
  if (bName > aName) {
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
  if (bLabel > aLabel) {
    return 1;
  }
  return 0;
}
