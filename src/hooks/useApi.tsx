import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

import { Tournament } from '../types';

type ListTournamentFunc = () => void;

export type ApiReturnType = {
  tournaments: Tournament[];
  listTournament: ListTournamentFunc;
};

const ApiContext = createContext({ tournaments: [] });

function useApiFn(): ApiReturnType {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  function listTournament() {}

  return {
    tournaments,
    listTournament,
  };
}

export function ApiProvider({ children }: PropsWithChildren<unknown>) {
  const returnProps = useApiFn();
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
