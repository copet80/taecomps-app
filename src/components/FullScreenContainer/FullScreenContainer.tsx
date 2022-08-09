import React from 'react';

import cx from 'classnames';

import './FullScreenContainer.scss';

import { PropsWithClassName } from '../types';

type Props = {
  center: boolean;
};

export default function FullScreenContainer({
  center,
  className,
  children,
}: PropsWithClassName<Props>) {
  return (
    <div className={cx('FullScreenContainer', className, { center })}>
      {children}
    </div>
  );
}
