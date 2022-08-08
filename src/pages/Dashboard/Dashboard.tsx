import React from 'react';

import { LoggedInWrapper } from '../../components';

export default function Dashboard() {
  return (
    <LoggedInWrapper>
      <div className="DashboardContainer">Dashboard</div>
    </LoggedInWrapper>
  );
}
