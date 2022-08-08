import React, { useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import './App.scss';

import { FullScreenSpinner } from './components';
import { useStore } from './hooks';
import AppRoutes from './AppRoutes';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

enum AuthState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

export default function App() {
  let navigate = useNavigate();
  const { setRegisterEmail, setCurrentUser } = useStore();

  const [authState, setAuthState] = useState(AuthState.Loading);

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
    setRegisterEmail(email);
    navigate(AppRoutes.Register);
  }

  function handleRegistered(user: User) {
    setCurrentUser(user);
    navigate(AppRoutes.Dashboard);
  }

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />;

    case AuthState.LoggedIn:
      return (
        <Routes>
          <Route path={AppRoutes.Dashboard} element={<DashboardPage />}></Route>
          <Route
            path="*"
            element={<Navigate to={AppRoutes.Dashboard} replace />}
          />
        </Routes>
      );

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
              />
            }></Route>
          <Route
            path={AppRoutes.Register}
            element={
              <RegisterPage
                onRegistered={handleRegistered}
                onLoginClick={handleLoginClick}
              />
            }></Route>
          <Route path="*" element={<Navigate to={AppRoutes.Login} replace />} />
        </Routes>
      );
  }
}
