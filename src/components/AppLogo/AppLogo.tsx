import React, { memo } from 'react';

import cx from 'classnames';

import './AppLogo.scss';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  size?: Size;
  onClick?: () => void;
};

function AppLogo({ size = 'md', onClick }: Props) {
  return (
    <div className={cx('AppLogo', size)}>
      {onClick ? <a onClick={onClick}></a> : <span></span>}
    </div>
  );
}

export default memo(AppLogo);
