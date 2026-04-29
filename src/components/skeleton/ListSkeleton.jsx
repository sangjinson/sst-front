import React from 'react';

const ListSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f0] animate-pulse">
      {/* 1. 상단 배너 스켈레톤 */}
      <div className="w-full h-[300px] md:h-[400px] bg-gray-200"></div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* 2. 브레드크럼 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 md:mb-10"></div>

        {/* 3. 필터 및 정렬 버튼 영역 스켈레톤 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2">
            <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* 4. 카드 그리드 스켈레톤 (기본 6개 노출) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-48 w-full bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton;