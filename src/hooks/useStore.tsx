import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

import { User } from 'firebase/auth';
import { Tournament } from '../types';

type SetRegisterEmailFn = (email: string) => void;
type SetCurrentUserFn = (user: User) => void;
type SetCurrentTournamentFn = (tournament?: Tournament) => void;

export type StoreReturnType = {
  registerEmail: string;
  setRegisterEmail: SetRegisterEmailFn;
  currentUser: User | undefined;
  setCurrentUser: SetCurrentUserFn;
  currentTournament: Tournament | undefined;
  setCurrentTournament: SetCurrentTournamentFn;
};

const StoreContext = createContext({ signUpEmail: '' });

function useStoreFn(): StoreReturnType {
  const [registerEmail, setRegisterEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [currentTournament, setCurrentTournament] = useState<
    Tournament | undefined
  >(undefined);

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
