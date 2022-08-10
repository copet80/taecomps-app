import React from 'react';

import { useNavigate } from 'react-router-dom';

import AppRoutes from '../../AppRoutes';
import { EmptyState } from '../../components';
import { EmptyStateImage } from '../../components/EmptyState/EmptyState';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <EmptyState
      image={EmptyStateImage.PageNotFound}
      title="This page is lost"
      subTitle="The page you're looking for isn't available."
      isCtaVisible
      ctaLabel="Back to dashboard"
      onCtaClick={() => navigate(AppRoutes.Dashboard)}
    />
  );
}
