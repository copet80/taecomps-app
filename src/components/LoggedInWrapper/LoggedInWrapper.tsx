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
import { useNavigate } from 'react-router-dom';

import './LoggedInWrapper.scss';

import AppRoutes from '../../AppRoutes';

export default function LoggedInWrapper({
  children,
}: PropsWithChildren<unknown>) {
  const navigate = useNavigate();
  const [isTournamentSwitcherActive, setIsTournamentSwitcherActive] =
    useState(false);

  function handleTournamentSwitcherClick() {
    setIsTournamentSwitcherActive(!isTournamentSwitcherActive);
  }

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
            isCurrentPage
            onClick={() => navigate(AppRoutes.Entries)}>
            Entries
          </HeaderMenuItem>
          <HeaderMenuItem onClick={() => navigate(AppRoutes.Bracket)}>
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
          <HeaderPanel
            aria-label="Header Panel"
            expanded={isTournamentSwitcherActive}>
            <Switcher aria-label="Switcher Container">
              <SwitcherItem isSelected aria-label="Link 1" href="#">
                Gold Coast Open
              </SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem href="#" aria-label="Link 2">
                NSW State Championships
              </SwitcherItem>
              <SwitcherItem href="#" aria-label="Link 3">
                Melbourne Nationals Selections
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </HeaderGlobalBar>
        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          isPersistent={false}>
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem
                isCurrentPage
                onClick={() => navigate(AppRoutes.Entries)}>
                Entries
              </HeaderMenuItem>
              <HeaderMenuItem onClick={() => navigate(AppRoutes.Bracket)}>
                Bracket
              </HeaderMenuItem>
              <HeaderMenu
                aria-label="Switch tournament"
                menuLinkName="Switch tournament">
                <HeaderMenuItem href="#">Gold Coast Open</HeaderMenuItem>
                <HeaderMenuItem href="#">
                  NSW State Championships
                </HeaderMenuItem>
                <HeaderMenuItem href="#">
                  Melbourne Nationals Selections
                </HeaderMenuItem>
              </HeaderMenu>
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
