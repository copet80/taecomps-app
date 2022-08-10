import React, { lazy, Suspense, useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import './styles/App.scss';

import { FullScreenSpinner, LoggedInWrapper } from './components';
import { useApi, useStore } from './hooks';
import AppRoutes, { TournamentAppRoutes } from './AppRoutes';
import { Tournament } from './types';

const BracketPage = lazy(() => import('./pages/Bracket'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const EntriesPage = lazy(() => import('./pages/Entries'));
const LoginPage = lazy(() => import('./pages/Login'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const RegisterPage = lazy(() => import('./pages/Register'));

enum AuthState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

export default function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { isTournamentsLoaded } = useApi();
  const {
    setRegisterEmail,
    setCurrentUser,
    currentTournament,
    isCurrentTournamentInit,
  } = useStore();

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

  useEffect(() => {
    if (
      isTournamentsLoaded &&
      isCurrentTournamentInit &&
      !currentTournament &&
      TournamentAppRoutes.includes(location.pathname as AppRoutes)
    ) {
      navigate(AppRoutes.Dashboard, { replace: true });
    }
  }, [isTournamentsLoaded, currentTournament]);

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

  function handleSwitchTournamentSuccess(tournament: Tournament) {
    if (
      tournament &&
      !TournamentAppRoutes.includes(location.pathname as AppRoutes)
    ) {
      navigate(AppRoutes.Dashboard, { replace: true });
    }
  }

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />;

    case AuthState.LoggedIn:
      return (
        <LoggedInWrapper
          onSwitchTournamentSuccess={handleSwitchTournamentSuccess}>
          <Suspense fallback={<FullScreenSpinner />}>
            <Routes>
              <Route path={AppRoutes.Dashboard} element={<DashboardPage />} />
              <Route path={AppRoutes.Bracket} element={<BracketPage />} />
              <Route path={AppRoutes.Entries} element={<EntriesPage />} />
              <Route
                path={AppRoutes.Profile}
                element={<ProfilePage onLogoutClick={handleLogoutClick} />}
              />
              <Route path="*" element={<NotFoundPage />} />
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
            }
          />
          <Route
            path={AppRoutes.Register}
            element={
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onLoginClick={handleLoginClick}
              />
            }
          />
          <Route path="*" element={<Navigate to={AppRoutes.Login} replace />} />
        </Routes>
      );
  }
}
