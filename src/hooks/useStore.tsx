import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

import { User } from 'firebase/auth';

type SetRegisterEmailFunc = (email: string) => void;
type SetCurrentUserFunc = (user: User) => void;

export type StoreReturnType = {
  registerEmail: string;
  setRegisterEmail: SetRegisterEmailFunc;
  currentUser: User | null;
  setCurrentUser: SetCurrentUserFunc;
};

const StoreContext = createContext({ signUpEmail: '' });

function useStoreFn(): StoreReturnType {
  const [registerEmail, setRegisterEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return {
    registerEmail,
    setRegisterEmail,
    currentUser,
    setCurrentUser,
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
