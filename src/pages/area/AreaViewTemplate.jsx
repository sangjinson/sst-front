import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toKorRegion } from '@utils/regionMap';
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
    window.scrollTo(0, 0);
  }, [pathname, search]);

  const currentConfig = VIEW_CONFIG[type];

  return (
    <Suspense fallback={<ViewSkeleton />}>
      {!currentConfig ? (
        <div className="flex justify-center items-center h-screen text-gray-500">
          잘못된 접근입니다. (Not Found)
        </div>
      ) : (
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
      )}
    </Suspense>
  );
};

export default AreaViewTemplate;