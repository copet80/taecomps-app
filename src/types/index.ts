import { Unsubscribe } from 'firebase/firestore';

export enum DbCollection {
  Tournaments = 'tournaments',
}

export type Tournament = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  modifiedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type Entry = {
  id: string;
  name: string;
  age: number;
  belt: string;
  weight: number;
  createdAt: string;
  modifiedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type Division = {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
};

export type SwitchTournamentFn = (
  tournament: Tournament,
) => Promise<Tournament>;
export type CreateTournamentFn = (name: string) => Promise<Tournament>;
export type UpdateTournamentFn = (
  tournament: Tournament,
) => Promise<Tournament>;
export type ListTournamentsFn = () => Unsubscribe;
