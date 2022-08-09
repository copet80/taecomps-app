import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
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
  CreateTournamentFn,
  DbCollection,
  ListTournamentsFn,
  Tournament,
  UpdateTournamentFn,
} from '../types';

export type ApiReturnType = {
  tournaments: Tournament[];
  listTournaments: ListTournamentsFn;
  createTournament: CreateTournamentFn;
  updateTournament: UpdateTournamentFn;
};

const ApiContext = createContext({ tournaments: [] });

function useApiFn(db: Firestore): ApiReturnType {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  function listTournaments(): Unsubscribe {
    const q = query(collection(db, DbCollection.Tournaments));
    return onSnapshot(q, (querySnapshot) => {
      const t: Tournament[] = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data() as Tournament);
      });
      setTournaments(t);
      console.log(t, tournaments);
    });
  }

  async function createTournament(name: string): Promise<Tournament> {
    const id = uuid();
    const tournament = {
      id,
      name,
      createdAt: DateTime.now().toISO(),
      isDeleted: false,
    };
    await setDoc(doc(db, DbCollection.Tournaments, id), tournament);
    return tournament;
  }

  async function updateTournament(tournament: Tournament): Promise<Tournament> {
    await setDoc(doc(db, DbCollection.Tournaments, tournament.id), tournament);
    return tournament;
  }

  return {
    tournaments,
    listTournaments,
    createTournament,
    updateTournament,
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
