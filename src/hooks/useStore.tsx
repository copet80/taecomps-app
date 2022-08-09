import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

import { User } from 'firebase/auth';
import { Tournament } from '../types';

type SetRegisterEmailFunc = (email: string) => void;
type SetCurrentUserFunc = (user: User) => void;
type SetCurrentTournamentFunc = (tournament: Tournament) => void;

export type StoreReturnType = {
  registerEmail: string;
  setRegisterEmail: SetRegisterEmailFunc;
  currentUser: User | null;
  setCurrentUser: SetCurrentUserFunc;
  currentTournament: Tournament | null;
  setCurrentTournament: SetCurrentTournamentFunc;
};

const StoreContext = createContext({ signUpEmail: '' });

function useStoreFn(): StoreReturnType {
  const [registerEmail, setRegisterEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(
    null,
  );

  return {
    registerEmail,
    setRegisterEmail,
    currentUser,
    setCurrentUser,
    currentTournament,
    setCurrentTournament,
  };
}

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
  const returnProps = useStoreFn();
  return (
    // @ts-ignore
    <StoreContext.Provider value={returnProps}>
      {/* @ts-ignore */}
      {typeof children === 'function' ? children(returnProps) : children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreReturnType {
  // @ts-ignore
  return useContext(StoreContext);
}
