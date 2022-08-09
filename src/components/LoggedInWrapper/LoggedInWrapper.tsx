import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

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

export default function LoggedInWrapper({
  children,
}: PropsWithChildren<unknown>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTournamentSwitcherActive, setIsTournamentSwitcherActive] =
    useState(false);
  const { currentTournament, setCurrentTournament } = useStore();
  const { tournaments, listTournaments, createTournament } = useApi();

  const tournamentOptions = useMemo(
    () => (
      <HeaderMenu aria-label="Gold Coast Open" menuLinkName="Gold Coast Open">
        <HeaderMenuItem href="#">NSW State Championship</HeaderMenuItem>
        <HeaderMenuItem href="#">Melbourne National Selections</HeaderMenuItem>
        <SideNavDivider />
        <HeaderMenuItem onClick={handleTournamentSwitcherClick}>
          Manage tournaments
        </HeaderMenuItem>
      </HeaderMenu>
    ),
    [],
  );

  const tournamentSubOptions = useMemo(
    () => (
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
    ),
    [location],
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
