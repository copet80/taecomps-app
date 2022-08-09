import React, { PropsWithChildren, useState } from 'react';

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
  HeaderPanel,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
} from '@carbon/react';
import {
  Switcher as SwitcherIcon,
  UserAvatar as UserIcon,
} from '@carbon/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import './LoggedInWrapper.scss';

import AppRoutes from '../../AppRoutes';
import { useApi } from '../../hooks';

type Props = {};

export default function LoggedInWrapper({
  children,
}: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTournamentSwitcherActive, setIsTournamentSwitcherActive] =
    useState(false);
  const { tournaments } = useApi();

  function handleTournamentSwitcherClick() {}

  function handleProfileClick() {
    navigate(AppRoutes.Profile);
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
        <HeaderNavigation aria-label="Taecomps">
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
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="User Profile"
            onClick={handleProfileClick}>
            <UserIcon size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Tournament Switcher"
            isActive={isTournamentSwitcherActive}
            onClick={handleTournamentSwitcherClick}
            tooltipAlignment="end">
            <SwitcherIcon size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}>
          <SideNavItems>
            <HeaderSideNavItems>
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
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>
      </Header>
    );
  }

  return (
    <div className="LoggedInWrapper">
      <HeaderContainer render={renderHeader} />
      {children}
    </div>
  );
}
