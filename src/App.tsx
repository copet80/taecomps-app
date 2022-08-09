import React, { lazy, Suspense, useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import './App.scss';

import { FullScreenSpinner, LoggedInWrapper } from './components';
import { useStore } from './hooks';
import AppRoutes from './AppRoutes';

const BracketPage = lazy(() => import('./pages/Bracket'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const EntriesPage = lazy(() => import('./pages/Entries'));
const LoginPage = lazy(() => import('./pages/Login'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const RegisterPage = lazy(() => import('./pages/Register'));
const TournamentDetailsPage = lazy(() => import('./pages/TournamentDetails'));

enum AuthState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

export default function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { setRegisterEmail, setCurrentUser } = useStore();

  const [authState, setAuthState] = useState(AuthState.Loading);

  useEffect(() => {
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

  function handleLoginSuccess(user: User) {
    setCurrentUser(user);
  }

  function handleRegisterClick(email: string) {
    setRegisterEmail(email);
    navigate(AppRoutes.Register);
  }

  function handleRegisterSuccess(user: User) {
    setCurrentUser(user);
    navigate(AppRoutes.Dashboard);
  }

  async function handleLogoutClick() {
    try {
      await signOut(auth);
    } catch (error) {}
  }

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />;

    case AuthState.LoggedIn:
      return (
        <LoggedInWrapper>
          <Suspense fallback={<FullScreenSpinner />}>
            <Routes>
              <Route
                path={AppRoutes.Dashboard}
                element={<DashboardPage />}></Route>
              <Route path={AppRoutes.Bracket} element={<BracketPage />}></Route>
              <Route path={AppRoutes.Entries} element={<EntriesPage />}></Route>
              <Route
                path={AppRoutes.Profile}
                element={
                  <ProfilePage onLogoutClick={handleLogoutClick} />
                }></Route>
              <Route
                path={AppRoutes.TournamentDetails}
                element={<TournamentDetailsPage />}></Route>
              <Route
                path="*"
                element={<Navigate to={AppRoutes.Dashboard} replace />}
              />
            </Routes>
          </Suspense>
        </LoggedInWrapper>
      );

    case AuthState.NotLoggedIn:
    default:
      return (
        <Routes>
          <Route
            path={AppRoutes.Login}
            element={
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onRegisterClick={handleRegisterClick}
              />
            }></Route>
          <Route
            path={AppRoutes.Register}
            element={
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onLoginClick={handleLoginClick}
              />
            }></Route>
          <Route path="*" element={<Navigate to={AppRoutes.Login} replace />} />
        </Routes>
      );
  }
}
