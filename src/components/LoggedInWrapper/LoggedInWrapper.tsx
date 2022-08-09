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

function LoggedInWrapper({ children }: PropsWithChildren<unknown>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTournamentSwitcherActive, setIsTournamentSwitcherActive] =
    useState(false);
  const { currentTournament, setCurrentTournament } = useStore();
  const {
    tournaments,
    listTournaments,
    createTournament,
    listRecentTournaments,
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
            onClick={() => switchTournament(t)}>
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
          <HeaderMenuItem
            isCurrentPage={location.pathname === AppRoutes.TournamentDetails}
            onClick={() => navigate(AppRoutes.TournamentDetails)}>
            Tournament Details
          </HeaderMenuItem>
        </>
      ) : null,
    [location, currentTournament],
  );

  useEffect(() => {
    listTournaments();
  }, []);

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
    navigate(AppRoutes.TournamentDetails);
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
