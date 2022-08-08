import React from 'react';
import cx from 'classnames';

import './FullScreenContainer.scss';

export default function FullScreenContainer({ center, children }: any) {
  return <div className={cx('FullScreenContainer', { center })}>{children}</div>;
}
