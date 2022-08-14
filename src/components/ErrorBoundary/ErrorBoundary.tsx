import React, { Component, ErrorInfo, ReactNode } from 'react';

import AppRoutes from '../../AppRoutes';
import { EmptyState, EmptyStateImage } from '../../components';

function ErrorFallback() {
  return (
    <EmptyState
      image={EmptyStateImage.PageNotFound}
      title="This page has gone rogue"
      subTitle="The page you're viewing has stopped working due to some technical error."
      isCtaVisible
      ctaLabel="Reload app"
      onCtaClick={() => window.location.reload()}
    />
  );
}

type ErrorBoundaryProps = {
  children?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};
type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    if (onError) {
      onError(error, errorInfo);
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorFallback />;
    }

    return children;
  }
}
