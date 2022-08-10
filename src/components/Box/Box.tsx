import React, { memo, PropsWithChildren } from 'react';

import cx from 'classnames';

import './Box.scss';

type HAlign = 'left' | 'center' | 'right';
type VAlign = 'top' | 'center' | 'bottom';

type Props = {
  hAlign?: HAlign;
  vAlign?: VAlign;
  width?: number;
  height?: number;
  padding?: number;
};

function Box({
  hAlign = 'left',
  vAlign = 'top',
  width,
  height,
  padding,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cx('Box', `hAlign-${hAlign}`, `vAlign-${vAlign}`)}
      style={{ width, height, padding }}>
      {children}
    </div>
  );
}

export default memo(Box);
