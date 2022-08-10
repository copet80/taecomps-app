import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavDivider,
  SideNavItems,
} from '@carbon/react';
import {
  Switcher as SwitcherIcon,
  UserAvatar as UserIcon,
} from '@carbon/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import './LoggedInWrapper.scss';

import AppRoutes from '../../AppRoutes';
import { useApi, useStore } from '../../hooks';
import TournamentSwitcher from '../TournamentSwitcher';
import { Tournament } from '../../types';
import { sortTournamentByDate } from '../../utils';
import FullScreenSpinner from '../FullScreenSpinner';

type Props = {
  onSwitchTournamentSuccess: (tournament: Tournament) => void;
};

function LoggedInWrapper({
  children,
  onSwitchTournamentSuccess,
}: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTournamentSwitcherActive, setIsTournamentSwitcherActive] =
    useState(false);
  const { currentTournament, setCurrentTournament, isCurrentTournamentInit } =
    useStore();
  const {
    tournaments,
    tournamentsById,
    listTournaments,
    createTournament,
    listRecentTournaments,
    isTournamentsLoaded,
  } = useApi();

  const tournamentOptions = useMemo(() => {
    const currentTournamentName = currentTournament
      ? currentTournament.name
      : 'Select tournament';
    const recentTournaments = listRecentTournaments();
    return (
      <HeaderMenu
        aria-label={currentTournamentName}
        className="switchTournamentMenu"
        menuLinkName={currentTournamentName}>
        {recentTournaments.map((t) => (
          <HeaderMenuItem
            key={t.id}
            isCurrentPage={currentTournament?.id === t.id}
            onClick={async () => {
              await switchTournament(t);
              onSwitchTournamentSuccess(t);
            }}>
            {t.name}
          </HeaderMenuItem>
        ))}
        <SideNavDivider />
        <HeaderMenuItem onClick={handleTournamentSwitcherClick}>
          Manage tournaments
        </HeaderMenuItem>
      </HeaderMenu>
    );
  }, [currentTournament, listRecentTournaments]);

  const tournamentSubOptions = useMemo(
    () =>
      currentTournament ? (
        <>
          <HeaderMenuItem
            isCurrentPage={location.pathname === AppRoutes.Dashboard}
            onClick={() => navigate(AppRoutes.Dashboard)}>
            Dashboard
          </HeaderMenuItem>
          <HeaderMenuItem
            isCurrentPage={location.pathname === AppRoutes.Entries}
            onClick={() => navigate(AppRoutes.Entries)}>
            Entries
          </HeaderMenuItem>
          <HeaderMenuItem
            isCurrentPage={location.pathname === AppRoutes.Bracket}
            onClick={() => navigate(AppRoutes.Bracket)}>
            Bracket
          </HeaderMenuItem>
        </>
      ) : null,
    [location, currentTournament],
  );

  useEffect(() => {
    listTournaments();
  }, []);

  useEffect(() => {
    if (!currentTournament && tournaments.length > 0) {
      const currentTournamentId = window.localStorage.getItem(
        'currentTournamentId',
      );
      if (currentTournamentId && tournamentsById[currentTournamentId]) {
        setCurrentTournament(tournamentsById[currentTournamentId]);
      } else {
        setCurrentTournament(tournaments.sort(sortTournamentByDate)[0]);
      }
    }
  }, [tournaments]);

  useEffect(() => {
    if (currentTournament && tournamentsById[currentTournament.id]) {
      setCurrentTournament(tournamentsById[currentTournament.id]);
    }
  }, [tournamentsById]);

  async function switchTournament(tournament: Tournament) {
    setCurrentTournament(tournament);
    return Promise.resolve(tournament);
  }

  function handleTournamentSwitcherClick() {
    setIsTournamentSwitcherActive(true);
  }

  function handleProfileClick() {
    navigate(AppRoutes.Profile);
  }

  function handleSwitchTournament(tournament: Tournament) {
    setCurrentTournament(tournament);
    setIsTournamentSwitcherActive(false);
    navigate(AppRoutes.Dashboard);
    onSwitchTournamentSuccess(tournament);
  }

  function handleCancelSwitchTournament() {
    setIsTournamentSwitcherActive(false);
  }

  function renderHeader({ isSideNavExpanded, onClickSideNavExpand }: any) {
    return (
      <Header aria-label="Taecomps">
        <SkipToContent />
        <HeaderMenuButton
          aria-label="Open menu"
          onClick={onClickSideNavExpand}
          isActive={isSideNavExpanded}
        />
        <HeaderName href="/" prefix="">
          Taecomps
        </HeaderName>
        <HeaderNavigation aria-label="Current Tournament">
          {tournamentOptions}
        </HeaderNavigation>
        <HeaderNavigation aria-label="Tournament Details">
          {tournamentSubOptions}
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            isActive={location.pathname === AppRoutes.Profile}
            aria-label="User Profile"
            onClick={handleProfileClick}>
            <UserIcon size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            isActive={isTournamentSwitcherActive}
            aria-label="Manage Tournaments"
            onClick={handleTournamentSwitcherClick}>
            <SwitcherIcon size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}>
          <SideNavItems>
            <HeaderSideNavItems hasDivider={true}>
              {tournamentOptions}
            </HeaderSideNavItems>
            <HeaderSideNavItems>{tournamentSubOptions}</HeaderSideNavItems>
          </SideNavItems>
        </SideNav>
      </Header>
    );
  }

  if (!isCurrentTournamentInit || !isTournamentsLoaded) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="LoggedInWrapper">
      <HeaderContainer render={renderHeader} />
      {children}
      <TournamentSwitcher
        currentTournament={currentTournament}
        isVisible={isTournamentSwitcherActive}
        tournaments={tournaments}
        createCallback={createTournament}
        switchCallback={switchTournament}
        onCreateSuccess={handleSwitchTournament}
        onSwitchSuccess={handleSwitchTournament}
        onCloseClick={handleCancelSwitchTournament}
      />
    </div>
  );
}

export default memo(LoggedInWrapper);
