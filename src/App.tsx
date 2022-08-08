import React, { useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';

import './App.scss';

import { FullScreenSpinner } from './components';
import { useStore } from './hooks';
import AppRoutes from './AppRoutes';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

enum AuthState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

export default function App() {
  let navigate = useNavigate();

  const [authState, setAuthState] = useState(AuthState.Loading);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setRegisterEmail: setSignUpEmail } = useStore();

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

  function handleLoginClick() {
    navigate(AppRoutes.Login);
  }

  function handleRegisterClick(email: string) {
    setSignUpEmail(email);
    navigate(AppRoutes.Register);
  }

  function handleResetPasswordClick(email: string) {
    setSignUpEmail(email);
  }

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />;

    case AuthState.LoggedIn:
      return <FullScreenSpinner />;

    case AuthState.NotLoggedIn:
    default:
      return (
        <Routes>
          <Route
            path={AppRoutes.Login}
            element={
              <LoginPage
                onLoggedIn={setCurrentUser}
                onRegisterClick={handleRegisterClick}
                onRecoverPasswordClick={handleResetPasswordClick}
              />
            }></Route>
          <Route
            path={AppRoutes.Register}
            element={
              <RegisterPage
                onRegistered={setCurrentUser}
                onLoginClick={handleLoginClick}
              />
            }></Route>
        </Routes>
      );
  }
}
