import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HeroBanner from '../../components/common/HeroBanner';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';
import ListSkeleton from '@components/skeleton/ListSkeleton';

const PlayList = lazy(() => import('./play/List'));
const FoodList = lazy(() => import('./food/List'));
const SeeList = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

// ----------------------------------------------------
// 🚀 URL type에 따른 동적 설정 맵핑 객체
// ----------------------------------------------------
const LIST_CONFIG = {
  play: {
    Component: PlayList,
    label: '놀거리',
    subtitleSuffix: '의 거리에서 놀아보자',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  sleep: {
    Component: SleepList,
    label: '잘거리',
    subtitleSuffix: '의 편안한 숙소를 찾아보세요',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  food: {
    Component: FoodList,
    label: '먹거리',
    subtitleSuffix: '의 맛있는 음식점을 찾아보세요', // 임의 지정 (필요에 따라 수정)
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  see: {
    Component: SeeList,
    label: '볼거리',
    subtitleSuffix: '의 아름다운 명소를 만나보세요', // 임의 지정 (필요에 따라 수정)
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
};

function AreaListTemplate() {
  const { region, type } = useParams();
  const { pathname } = useLocation();
  const regionKor = toKorRegion(region);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 현재 URL type에 해당하는 설정 객체 가져오기
  const currentConfig = LIST_CONFIG[type];

  return (
    <Suspense fallback={<ListSkeleton />}>
      {/* 🚀 유효하지 않은 type 접근 시 예외 처리 */}
      {!currentConfig ? (
        <div className="flex justify-center items-center h-screen text-gray-500">
          잘못된 접근입니다. (Not Found)
        </div>
      ) : (
        /* 🚀 맵핑된 데이터를 활용한 단일 JSX 구조 */
        <div className="bg-[#f8f6f0] min-h-screen">
          <HeroBanner
            bgImage={currentConfig.bgImage}
            title={regionKor}
            subtitle={`${regionKor}${currentConfig.subtitleSuffix}`}
          />
          <div className="container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10 max-w-[1200px]">
            <Breadcrumb
              paths={[
                { label: '홈', to: '/' },
                { label: regionKor, to: `/${region}` },
                { label: currentConfig.label, to: `/${region}/${type}/list` },
              ]}
              className="mb-6"
            />
            {/* 동적으로 컴포넌트 렌더링 */}
            <currentConfig.Component />
          </div>
        </div>
      )}
    </Suspense>
  );
}

export default AreaListTemplate;