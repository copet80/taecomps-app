import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

type SetRegisterEmailFunc = (email: string) => void;

export type StoreReturnType = {
  registerEmail: string;
  setRegisterEmail: SetRegisterEmailFunc;
};

const StoreContext = createContext({ signUpEmail: '' });

function useStoreFn(): StoreReturnType {
  const [registerEmail, setRegisterEmail] = useState('');

  return {
    registerEmail,
    setRegisterEmail,
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
