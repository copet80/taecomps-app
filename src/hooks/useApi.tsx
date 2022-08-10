import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';

import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

import {
  AddRecentTournamentFn,
  CreateTournamentFn,
  DbCollection,
  ListRecentTournamentsFn,
  ListTournamentsFn,
  Tournament,
  UpdateTournamentFn,
} from '../types';
import { sortTournamentByDate } from '../utils';

export type ApiReturnType = {
  tournaments: Tournament[];
  tournamentsById: Record<string, Tournament>;
  listTournaments: ListTournamentsFn;
  createTournament: CreateTournamentFn;
  updateTournament: UpdateTournamentFn;
  listRecentTournaments: ListRecentTournamentsFn;
  addRecentTournament: AddRecentTournamentFn;
};

const MAX_RECENT_TOURNAMENTS = 3;

const ApiContext = createContext({ tournaments: [] });

function useApiFn(db: Firestore): ApiReturnType {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const tournamentsById: Record<string, Tournament> = useMemo(() => {
    return Object.fromEntries(tournaments.map((t) => [t.id, t]));
  }, [tournaments]);

  const listTournaments = useCallback((): Unsubscribe => {
    const q = query(collection(db, DbCollection.Tournaments));
    return onSnapshot(q, (querySnapshot) => {
      const t: Tournament[] = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data() as Tournament);
      });
      setTournaments(t);
    });
  }, []);

  const createTournament: CreateTournamentFn = useCallback(
    async (name: string): Promise<Tournament> => {
      const id = uuid();
      const tournament = {
        id,
        name,
        createdAt: DateTime.now().toISO(),
        isDeleted: false,
      };
      await setDoc(doc(db, DbCollection.Tournaments, id), tournament);
      return tournament;
    },
    [],
  );

  const updateTournament = useCallback(
    async (tournament: Tournament): Promise<Tournament> => {
      await setDoc(
        doc(db, DbCollection.Tournaments, tournament.id),
        tournament,
      );
      return tournament;
    },
    [],
  );

  const listRecentTournaments: ListRecentTournamentsFn = useCallback(() => {
    const recentTournamentIds: string[] = JSON.parse(
      window.localStorage.getItem('recentTournamentIds') || '[]',
    );
    const recentTournaments = recentTournamentIds
      .filter((id) => Boolean(tournamentsById[id]))
      .map((id) => tournamentsById[id]);
    const sortedTournaments = tournaments
      .filter((t) => !recentTournamentIds.includes(t.id))
      .sort(sortTournamentByDate);
    return [...recentTournaments, ...sortedTournaments].slice(
      0,
      MAX_RECENT_TOURNAMENTS,
    );
  }, [tournamentsById, tournaments]);

  const addRecentTournament: AddRecentTournamentFn = useCallback(
    (tournament: Tournament): Tournament[] => {
      const recentTournamentIds: string[] = JSON.parse(
        window.localStorage.getItem('recentTournamentIds') || '[]',
      );
      const updatedRecentTournamentIds = [
        tournament.id,
        ...recentTournamentIds,
      ].slice(0, MAX_RECENT_TOURNAMENTS);
      window.localStorage.setItem(
        'recentTournamentIds',
        JSON.stringify(updatedRecentTournamentIds),
      );
      return listRecentTournaments();
    },
    [],
  );

  return {
    tournaments,
    tournamentsById,
    listTournaments,
    createTournament,
    updateTournament,
    listRecentTournaments,
    addRecentTournament,
  };
}

type Props = {
  db: Firestore;
};

export function ApiProvider({ db, children }: PropsWithChildren<Props>) {
  const returnProps = useApiFn(db);
  return (
    // @ts-ignore
    <ApiContext.Provider value={returnProps}>
      {/* @ts-ignore */}
      {typeof children === 'function' ? children(returnProps) : children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiReturnType {
  // @ts-ignore
  return useContext(ApiContext);
}
