import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toKorRegion } from '@utils/regionMap';
import Breadcrumb from '@components/common/Breadcrumb';
import ViewSkeleton from '@components/skeleton/ViewSkeleton';

// const PlayView = lazy(() => import('./play/View'));
const FoodView = lazy(() => import('./food/View'));
const SeeView = lazy(() => import('./see/View'));
const SleepView = lazy(() => import('./sleep/View'));

// ----------------------------------------------------
// 🚀 URL type에 따른 동적 설정 맵핑 객체
// ----------------------------------------------------
const VIEW_CONFIG = {
  // play: { Component: PlayView, label: '놀거리' },
  food: { Component: FoodView, label: '먹거리' },
  see: { Component: SeeView, label: '볼거리' },
  sleep: { Component: SleepView, label: '잘거리' },
};

// ----------------------------------------------------
// 메인 템플릿 컴포넌트
// ----------------------------------------------------
const AreaViewTemplate = () => {
  const { region, type } = useParams();
  const { pathname } = useLocation(); // 스크롤 초기화를 위해 추가
  const regionKor = toKorRegion(region); 

  // 페이지 이동 시 무조건 최상단으로 스크롤 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 현재 URL type에 해당하는 설정 객체 가져오기
  const currentConfig = VIEW_CONFIG[type];

  return (
    // 기존 <div>Loading...</div> 대신 스켈레톤 UI 컴포넌트를 fallback으로 지정
    <Suspense fallback={<ViewSkeleton />}>
      {/* 유효하지 않은 type 접근 시 예외 처리 */}
      {!currentConfig ? (
        <div className="flex justify-center items-center h-screen text-gray-500">
          잘못된 접근입니다. (Not Found)
        </div>
      ) : (
        /* 🚀 맵핑된 데이터를 활용한 단일 레이아웃 구조 (모든 View에 공통 적용) */
        <div className="bg-[#f8f6f0] min-h-screen">
          <div className="container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-6 max-w-[900px]">
            {/* 브레드크럼 */}
            <Breadcrumb 
              paths={[
                { label: '홈', to: '/' },
                { label: regionKor, to: `/${region}` },
                { label: currentConfig.label, to: `/${region}/${type}/list` },
                { label: '상세정보', to: `/${region}/${type}/view` } 
                // 💡 참고: 추후 View 컴포넌트 내부에서 게시물 데이터를 불러온 뒤,
                // '상세정보' 대신 'item.name(예: 수원 왕갈비)'을 라벨로 넘겨주면 훨씬 좋습니다!
              ]} 
              className="mb-10"
            />
            {/* 동적으로 상세 컴포넌트 렌더링 */}
            <currentConfig.Component />
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default AreaViewTemplate;