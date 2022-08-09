import React, { useMemo } from 'react';

import { Button, Stack } from '@carbon/react';

import './Profile.scss';

import { LoggedInWrapper } from '../../components';
import { useStore } from '../../hooks';

type Props = {
  onLogoutClick: () => void;
};

export default function Profile({ onLogoutClick }: Props) {
  const { currentUser } = useStore();
  const name = useMemo(
    () => currentUser?.displayName || currentUser?.email,
    [currentUser],
  );

  function handleLogoutClick() {
    onLogoutClick();
  }

  return (
    <LoggedInWrapper>
      <div className="ProfileContainer">
        <section className="ProfileContainer_hero">
          <Stack gap={6}>
            <h2>Welcome, {name}</h2>
            <p>
              Manage your info and communication preference to make Taecomps
              work better for you.
            </p>
            <Button onClick={handleLogoutClick}>Sign out</Button>
          </Stack>
        </section>
      </div>
    </LoggedInWrapper>
  );
}
