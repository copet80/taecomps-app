import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import { FullScreenSpinner } from './components';
import LoginPage from './pages/Login';

enum AuthState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Loading);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setAuthState(AuthState.LoggedIn);
      } else {
        setAuthState(AuthState.NotLoggedIn);
      }
    });
  }, []);

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />

    case AuthState.LoggedIn:
      return <FullScreenSpinner />

    case AuthState.NotLoggedIn:
    default:
      return <LoginPage />;
  }
}
