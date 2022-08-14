import React from 'react';

import { Button, Stack } from '@carbon/react';
import cx from 'classnames';

import './EmptyState.scss';

type Props = {
  image?: EmptyStateImage;
  title: string;
  subTitle: string;
  isCtaVisible?: boolean;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export enum EmptyStateImage {
  Default = 'default',
  PageNotFound = 'pageNotFound',
}

export default function EmptyState({
  image = EmptyStateImage.Default,
  title,
  subTitle,
  isCtaVisible,
  ctaLabel,
  onCtaClick,
}: Props) {
  return (
    <div className="EmptyStateContainer">
      <div className="EmptyStateContent">
        <div className={cx('EmptyState', image)}></div>
        <Stack gap={9}>
          <Stack gap={3}>
            {title && <h2>{title}</h2>}
            {subTitle && <p>{subTitle}</p>}
          </Stack>
          {isCtaVisible && (
            <Button onClick={() => onCtaClick && onCtaClick()}>
              {ctaLabel}
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
}
