import React, { PropsWithChildren } from 'react';

import './LoggedInWrapper.scss';

export default function LoggedInWrapper({
  children,
}: PropsWithChildren<unknown>) {
  return <div className="LoggedInWrapper">{children}</div>;
}
