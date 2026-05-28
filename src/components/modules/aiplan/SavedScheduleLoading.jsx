import React from 'react';

const SkeletonLine = ({ className = '' }) => (
  <div className={`animate-pulse rounded-full bg-gray-100 ${className}`} />
);

const SavedScheduleLoading = () => {
  return (
    <div className="print-area overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="w-full border-b border-gray-100 p-6 md:min-h-[520px] md:w-[34%] md:border-b-0 md:border-r">
          <div className="mb-6">
            <p className="text-sm font-bold text-[#0F9B73]">저장 일정 불러오기</p>
            <h2 className="mt-2 text-xl font-black text-gray-900">
              저장된 일정을 준비하고 있어요
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-400">
              장소와 날짜 정보를 불러오는 중입니다.
            </p>
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <SkeletonLine className="h-9 w-9 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <SkeletonLine className="mb-2 h-3 w-20" />
                    <SkeletonLine className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[360px] flex-1 flex-col p-6 md:min-h-[520px]">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <SkeletonLine className="h-8 w-24" />
            <SkeletonLine className="h-8 w-28" />
            <SkeletonLine className="h-8 w-20" />
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <SkeletonLine className="mb-4 h-4 w-32" />
              <div className="space-y-3">
                <SkeletonLine className="h-3 w-full" />
                <SkeletonLine className="h-3 w-5/6" />
                <SkeletonLine className="h-3 w-2/3" />
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <SkeletonLine className="mb-5 h-4 w-28" />
              <div className="h-44 animate-pulse rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedScheduleLoading;
