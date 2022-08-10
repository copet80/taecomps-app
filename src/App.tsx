import React, { lazy, Suspense, useEffect, useState } from 'react';

import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import './styles/App.scss';

import {
  ArchiveTournamentDialog,
  DeleteTournamentDialog,
  EditTournamentDialog,
  FullScreenSpinner,
  LoggedInWrapper,
  UnarchiveTournamentDialog,
} from './components';
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

enum DialogMode {
  EditTournament,
  DeleteTournament,
  ArchiveTournament,
  UnarchiveTournament,
}

export default function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { isTournamentsLoaded } = useApi();
  const {
    setRegisterEmail,
    setCurrentUser,
    currentTournament,
    setCurrentTournament,
    isCurrentTournamentInit,
  } = useStore();

  const [authState, setAuthState] = useState(AuthState.Loading);
  const [dialogMode, setDialogMode] = useState<DialogMode | undefined>(
    undefined,
  );

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

  function handleClearDialog() {
    setDialogMode(undefined);
  }

  switch (authState) {
    case AuthState.Loading:
      return <FullScreenSpinner />;

    case AuthState.LoggedIn:
      return (
        <LoggedInWrapper
          onEditCurrentTournamentClick={() =>
            setDialogMode(DialogMode.EditTournament)
          }
          onSwitchTournamentSuccess={handleSwitchTournamentSuccess}
          onArchiveCurrentTournamentClick={() =>
            setDialogMode(DialogMode.ArchiveTournament)
          }
          onUnarchiveCurrentTournamentClick={() =>
            setDialogMode(DialogMode.UnarchiveTournament)
          }
          onDeleteCurrentTournamentClick={() =>
            setDialogMode(DialogMode.DeleteTournament)
          }>
          <Suspense fallback={<FullScreenSpinner />}>
            <Routes>
              <Route
                path={AppRoutes.Dashboard}
                element={
                  <DashboardPage
                    onEditCurrentTournamentClick={() =>
                      setDialogMode(DialogMode.EditTournament)
                    }
                    onDeleteCurrentTournamentClick={() =>
                      setDialogMode(DialogMode.DeleteTournament)
                    }
                  />
                }
              />
              <Route path={AppRoutes.Bracket} element={<BracketPage />} />
              <Route path={AppRoutes.Entries} element={<EntriesPage />} />
              <Route
                path={AppRoutes.Profile}
                element={<ProfilePage onLogoutClick={handleLogoutClick} />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          {currentTournament && (
            <>
              <EditTournamentDialog
                isVisible={dialogMode === DialogMode.EditTournament}
                tournament={currentTournament}
                onCancelClick={handleClearDialog}
                onUpdateSuccess={handleClearDialog}
              />
              <DeleteTournamentDialog
                isVisible={dialogMode === DialogMode.DeleteTournament}
                tournament={currentTournament}
                onCancelClick={handleClearDialog}
                onDeleteSuccess={handleClearDialog}
              />
              <ArchiveTournamentDialog
                isVisible={dialogMode === DialogMode.ArchiveTournament}
                tournament={currentTournament}
                onCancelClick={handleClearDialog}
                onArchiveSuccess={handleClearDialog}
              />
              <UnarchiveTournamentDialog
                isVisible={dialogMode === DialogMode.UnarchiveTournament}
                tournament={currentTournament}
                onCancelClick={handleClearDialog}
                onUnarchiveSuccess={handleClearDialog}
              />
            </>
          )}
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
