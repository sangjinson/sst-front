import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// const PlayView = lazy(() => import('./play/View'));
const FoodView = lazy(() => import('./food/View'));
const SeeView = lazy(() => import('./see/View'));
const SleepView = lazy(() => import('./sleep/View'));

// ----------------------------------------------------
// 상세(View) 페이지 전용 스켈레톤 UI
// ----------------------------------------------------
const ViewSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f0] animate-pulse">
      <div className="max-w-[900px] mx-auto px-4 py-6">
        
        {/* 브레드크럼 */}
        <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>

        {/* 대표 이미지 */}
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl mb-6"></div>

        {/* 상세 설명 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* 이용 정보 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50">
          <div className="h-6 bg-gray-200 rounded w-24 mb-5"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0"></div>
                <div className="w-full space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
          {/* 편의시설 태그 */}
          <div className="pt-4 border-t border-gray-100 flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50">
          <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
          <div className="w-full h-52 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-48"></div>
        </div>

        {/* 평점 & 리뷰 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          {/* 리뷰 작성 폼 스켈레톤 */}
          <div className="h-32 bg-gray-50 rounded-xl mb-4 border border-gray-100"></div>
          {/* 리뷰 리스트 스켈레톤 */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white border border-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-50 rounded-xl mt-4 w-full border border-gray-200"></div>
        </div>

        {/* 연관 추천 숙소 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-50">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-28 bg-gray-200 rounded-xl w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const AreaViewTemplate = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { type } = useParams();
  
  const renderList = () => {
    switch (type) {
      // case 'play':
      //   return <PlayView />;
      case 'food':
        return <FoodView />;
      case 'see':
        return <SeeView />;
      case 'sleep':
        return <SleepView />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    // 기존 fallback 대신 View 전용 스켈레톤 컴포넌트 삽입
    <Suspense fallback={<ViewSkeletonLoader />}>
      {renderList()}
    </Suspense>
  );
};

export default AreaViewTemplate;