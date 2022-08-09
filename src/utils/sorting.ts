import { DateTime } from 'luxon';

import { Tournament } from '../types';

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
