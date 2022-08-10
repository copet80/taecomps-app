import { Unsubscribe } from 'firebase/firestore';

export enum DbCollection {
  Tournaments = 'tournaments',
  Entries = 'entries',
}

export type Tournament = {
  id: string;
  name: string;
  description?: string;
  clubs?: string;
  belts?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  modifiedAt?: string;
  isArchived?: boolean;
  archivedAt?: string;
  unarchivedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type Entry = {
  id: string;
  tournamentId: string;
  name: string;
  age: number;
  belt: string;
  club: string;
  weight: number;
  createdAt: string;
  modifiedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type NewEntry = Pick<Entry, 'name' | 'age' | 'belt' | 'club' | 'weight'>;

export type Division = {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
};

export type ListTournamentsFn = () => Unsubscribe;
export type CreateTournamentFn = (name: string) => Promise<Tournament>;
export type UpdateTournamentFn = (
  tournament: Tournament,
) => Promise<Tournament>;
export type DeleteTournamentFn = (id: string) => Promise<boolean>;
export type CloseTournamentFn = (id: string) => Promise<boolean>;
export type UnarchiveTournamentFn = (id: string) => Promise<boolean>;
export type SwitchTournamentFn = (
  tournament: Tournament,
) => Promise<Tournament>;
export type ListRecentTournamentsFn = () => Tournament[];
export type AddRecentTournamentFn = (tournament: Tournament) => Tournament[];

export type ListEntriesFn = (tournamentId: string) => Unsubscribe;
export type CreateEntryFn = (
  tournamentId: string,
  newEntry: NewEntry,
) => Promise<Entry>;
export type UpdateEntryFn = (entry: Entry) => Promise<Entry>;
export type DeleteEntryFn = (entry: Entry) => Promise<boolean>;
