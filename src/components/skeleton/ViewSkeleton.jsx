import React from 'react';

const ViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white animate-pulse pb-20">

      {/* 1. AreaDetailHero - rounded-2xl h-64 md:h-96 */}
      <div className="max-w-[1200px] mx-auto px-4 pt-6">
        <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-96 bg-gray-200">
          <div className="absolute top-4 left-4 h-7 w-16 bg-gray-300 rounded-full"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="h-7 w-7 bg-gray-300 rounded-full"></div>
            <div className="h-7 w-7 bg-gray-300 rounded-full"></div>
          </div>
          <div className="absolute bottom-5 left-5 flex flex-col gap-2">
            <div className="h-4 w-14 bg-gray-300 rounded-full"></div>
            <div className="h-7 w-40 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">

          {/* 왼쪽 */}
          <div className="space-y-4">

            {/* AreaDescription */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="h-5 bg-gray-300 rounded w-20 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>

            {/* AreaInfoSection */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="h-5 bg-gray-300 rounded w-20 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-14 mb-1.5"></div>
                      <div className="h-4 bg-gray-300 rounded w-28"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-14 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* AreaMap */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="h-5 bg-gray-300 rounded w-10 mb-3"></div>
              <div className="h-52 bg-gray-200 rounded-xl"></div>
              <div className="h-3 bg-gray-200 rounded w-40 mt-2"></div>
            </div>

            {/* AreaReview */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-14"></div>
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>

          </div>

          {/* 오른쪽 - AreaRelated */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit">
            <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-28 bg-gray-200 rounded-xl mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewSkeleton;