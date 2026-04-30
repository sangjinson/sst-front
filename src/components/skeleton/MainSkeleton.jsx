import React from 'react';

const MainSkeleton = () => {
  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px] animate-pulse">

      {/* 1. HeroBanner - h-[200px] md:h-[300px] */}
      <div className="w-full h-[200px] md:h-[300px] bg-gray-200 flex justify-center items-center flex-col gap-3">
        <div className="h-8 w-32 bg-gray-300 rounded-lg"></div>
        <div className="h-4 w-56 bg-gray-300 rounded-lg"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">

        {/* 2. 브레드크럼 */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 md:mb-[50px]"></div>

        {/* 3. TopPick 섹션 */}
        <section className="mb-[50px] md:mb-[80px]">
          <div className="flex justify-center mb-8 border-b-2 border-gray-100 pb-3">
            <div className="h-6 bg-gray-300 rounded w-56"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={`top-${item}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CategorySection 4개 */}
        {[1, 2, 3, 4].map((section) => (
          <div key={`section-${section}`} className="mb-[50px] md:mb-[80px]">
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
              <div className="h-5 bg-gray-300 rounded w-44"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[1, 2, 3].map((card) => (
                <div key={`card-${card}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="relative h-40 bg-gray-200">
                    <div className="absolute top-3 left-3 h-5 w-12 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-2 right-2 h-7 w-7 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-3 mb-2">
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                      <div className="h-3 bg-gray-200 rounded w-6"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-100">
                    <div className="h-3 w-3 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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