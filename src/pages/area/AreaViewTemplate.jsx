import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { hasRegion, toKorRegion } from '@utils/regionMap';
import Breadcrumb from '@components/common/Breadcrumb';
import ViewSkeleton from '@components/skeleton/ViewSkeleton';

const FoodView = lazy(() => import('./food/View'));
const SeeView = lazy(() => import('./see/View'));
const SleepView = lazy(() => import('./sleep/View'));
const PlayView = lazy(() => import('./play/View'));

const VIEW_CONFIG = {
  food: { Component: FoodView, label: '먹거리' },
  see: { Component: SeeView, label: '볼거리' },
  sleep: { Component: SleepView, label: '잘거리' },
  play: { Component: PlayView, label: '놀거리' },
};

const AreaViewTemplate = () => {
  const { region, type } = useParams();
  const { pathname, search } = useLocation();
  const regionKor = toKorRegion(region);

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname, search]);
  

  const currentConfig = VIEW_CONFIG[type];

  if (!hasRegion(region) || !currentConfig) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Suspense fallback={<ViewSkeleton />}>
      <div className="bg-[#f8f6f0] min-h-screen">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 m-auto py-6 max-w-[1400px]">
          <Breadcrumb
            paths={[
              { label: '홈', to: '/' },
              { label: regionKor, to: `/${region}` },
              { label: currentConfig.label, to: `/${region}/${type}/list` },
              { label: '상세정보', to: `/${region}/${type}/view` },
            ]}
            className="mb-10"
          />
          <currentConfig.Component />
        </div>
      </div>
    </Suspense>
  );
};

export default AreaViewTemplate;
