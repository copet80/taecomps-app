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
  CloseTournamentFn as ArchiveTournamentFn,
  CreateEntryFn,
  CreateTournamentFn,
  DbCollection,
  DeleteTournamentFn,
  Entry,
  ListEntriesFn,
  ListRecentTournamentsFn,
  ListTournamentsFn,
  NewEntry,
  UnarchiveTournamentFn,
  Tournament,
  UpdateTournamentFn,
} from '../types';
import { sortTournamentByDate } from '../utils';

export type ApiReturnType = {
  isTournamentsLoaded: boolean;
  tournaments: Tournament[];
  tournamentsById: Record<string, Tournament>;
  entriesByTournamentId: Record<string, Entry[]>;
  listTournaments: ListTournamentsFn;
  createTournament: CreateTournamentFn;
  updateTournament: UpdateTournamentFn;
  deleteTournament: DeleteTournamentFn;
  archiveTournament: ArchiveTournamentFn;
  unarchiveTournament: UnarchiveTournamentFn;
  listRecentTournaments: ListRecentTournamentsFn;
  addRecentTournament: AddRecentTournamentFn;
  listEntries: ListEntriesFn;
};

const MAX_RECENT_TOURNAMENTS = 3;

const ApiContext = createContext({ tournaments: [] });

function useApiFn(db: Firestore): ApiReturnType {
  const [isTournamentsLoaded, setIsTournamentsLoaded] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [entriesByTournamentId, setEntriesByTournamentId] = useState<
    Record<string, Entry[]>
  >({});

  const tournamentsById: Record<string, Tournament> = useMemo(() => {
    return Object.fromEntries(tournaments.map((t) => [t.id, t]));
  }, [tournaments]);

  const listTournaments = useCallback((): Unsubscribe => {
    const q = query(
      collection(db, DbCollection.Tournaments),
      where('isDeleted', '==', false),
    );
    return onSnapshot(q, (querySnapshot) => {
      const t: Tournament[] = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data() as Tournament);
      });
      setTournaments(t);
      setIsTournamentsLoaded(true);
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

  const deleteTournament = useCallback(async (id: string): Promise<boolean> => {
    await setDoc(
      doc(db, DbCollection.Tournaments, id),
      { isDeleted: true, deletedAt: DateTime.now().toISO() },
      { merge: true },
    );
    return true;
  }, []);

  const archiveTournament = useCallback(
    async (id: string): Promise<boolean> => {
      await setDoc(
        doc(db, DbCollection.Tournaments, id),
        { isArchived: true, archivedAt: DateTime.now().toISO() },
        { merge: true },
      );
      return true;
    },
    [],
  );

  const unarchiveTournament = useCallback(
    async (id: string): Promise<boolean> => {
      await setDoc(
        doc(db, DbCollection.Tournaments, id),
        { isArchived: false, unarchivedAt: DateTime.now().toISO() },
        { merge: true },
      );
      return true;
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

  const listEntries = useCallback((tournamentId: string): Unsubscribe => {
    const tournamentDoc = doc(db, DbCollection.Entries, tournamentId);
    const q = query(
      collection(tournamentDoc, DbCollection.Entries),
      where('isDeleted', '==', false),
    );
    return onSnapshot(q, (querySnapshot) => {
      const e: Entry[] = [];
      querySnapshot.forEach((doc) => {
        e.push(doc.data() as Entry);
      });
      setEntriesByTournamentId({
        ...entriesByTournamentId,
        [tournamentId]: e,
      });
    });
  }, []);

  // const createEntry: CreateEntryFn = useCallback(
  //   async (tournamentId: string, newEntry: NewEntry): Promise<Entry> => {
  //     const id = uuid();
  //     const entry = {
  //       tournamentId,
  //       id,
  //       ...newEntry,
  //       createdAt: DateTime.now().toISO(),
  //       isDeleted: false,
  //     };
  //     await setDoc(doc(db, DbCollection.Entries, id), entry);
  //     return entry;
  //   },
  //   [],
  // );

  // const updateTournament = useCallback(
  //   async (tournament: Tournament): Promise<Tournament> => {
  //     await setDoc(
  //       doc(db, DbCollection.Tournaments, tournament.id),
  //       tournament,
  //     );
  //     return tournament;
  //   },
  //   [],
  // );

  // const deleteTournament = useCallback(async (id: string): Promise<boolean> => {
  //   await setDoc(
  //     doc(db, DbCollection.Tournaments, id),
  //     { isDeleted: true },
  //     { merge: true },
  //   );
  //   return true;
  // }, []);

  return {
    isTournamentsLoaded,
    tournaments,
    tournamentsById,
    entriesByTournamentId,
    listTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    archiveTournament,
    unarchiveTournament,
    listRecentTournaments,
    addRecentTournament,
    listEntries,
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
