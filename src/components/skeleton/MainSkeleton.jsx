import React from 'react';
// ----------------------------------------------------
// 메인 페이지 전용 스켈레톤 UI 컴포넌트
// ----------------------------------------------------
const MainSkeleton = () => {
  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px] animate-pulse">
      
      {/* 1. 배너 스켈레톤 */}
      <div className="w-full h-[300px] md:h-[400px] bg-gray-200"></div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">
        
        {/* 2. 브레드크럼 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 md:mb-[50px]"></div>

        {/* 3. 상단 추천 섹션 스켈레톤 (방방곳곳 숨어있는 추천을 찾다) */}
        <section className="mb-[50px] md:mb-[80px]">
          <div className="flex justify-center mb-8 md:mb-10 border-b-2 border-gray-100 pb-3 md:pb-4">
            <div className="h-8 md:h-10 bg-gray-300 rounded w-64 md:w-80"></div>
          </div>
          
          {/* 4칸 그리드 (모바일 1, 태블릿 2, 데스크탑 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={`top-${item}`} className="h-[280px] md:h-[320px] bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </section>

        {/* 4. 카테고리 섹션 스켈레톤 (볼거리, 놀거리, 잘거리, 먹거리) */}
        {[1, 2, 3, 4].map((section) => (
          <div key={`section-${section}`} className="mb-[50px] md:mb-[80px]">
            {/* 타이틀 및 '더보기' 버튼 영역 */}
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
              <div className="h-6 md:h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            {/* 3칸 그리드 (기본 CategorySection은 보통 3개를 보여줍니다) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[1, 2, 3].map((card) => (
                <div key={`card-${card}`} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default MainSkeleton;