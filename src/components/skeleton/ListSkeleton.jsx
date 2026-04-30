import React from 'react';

const ListSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f0] animate-pulse">

      {/* 1. HeroBanner - h-[200px] md:h-[300px] */}
      <div className="w-full h-[200px] md:h-[300px] bg-gray-200 flex justify-center items-center flex-col gap-3">
        <div className="h-8 w-32 bg-gray-300 rounded-lg"></div>
        <div className="h-4 w-56 bg-gray-300 rounded-lg"></div>
      </div>

      <div className="max-w-[1920px] mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px]">

        {/* 2. 브레드크럼 */}
        <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>

        {/* 3. 필터바 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-9 w-16 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-9 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* 총 개수 */}
        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>

        {/* 4. 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute top-3 left-3 h-5 w-12 bg-gray-300 rounded-full"></div>
                <div className="absolute top-2 right-2 h-7 w-7 bg-gray-300 rounded-full"></div>
              </div>
              <div className="px-4 py-3">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="flex gap-3 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                  <div className="h-4 bg-gray-200 rounded w-6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-100">
                <div className="h-3 w-3 bg-gray-200 rounded-full shrink-0"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <div className="h-9 w-14 bg-gray-200 rounded-lg"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-9 w-9 bg-gray-200 rounded-lg"></div>
          ))}
          <div className="h-9 w-14 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ListSkeleton;