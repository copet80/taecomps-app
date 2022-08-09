import { PropsWithChildren } from 'react';

export type PropsWithClassName<P = unknown> = P &
  PropsWithChildren<P> & { className?: string | undefined };
