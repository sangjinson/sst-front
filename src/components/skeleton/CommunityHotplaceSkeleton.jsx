import React from "react";

const CommunityHotplaceSkeleton = () => {
  return (
    <div className="paperlogy max-w-[1420px] mx-auto px-4 py-6 md:py-10 mb-20 animate-pulse">

      {/* 브레드크럼 */}
      <div className="h-4 w-32 bg-gray-200 rounded mb-6" />

      {/* 제목 영역 */}
      <section className="mt-8 mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-40 bg-gray-300 rounded-lg" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-80 bg-gray-200 rounded" />
          </div>

          <div className="h-11 w-28 bg-gray-300 rounded-full" />
        </div>
      </section>

      {/* 검색바 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm mb-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <div className="h-11 bg-gray-200 rounded-xl" />
          <div className="h-11 bg-gray-200 rounded-xl" />
          <div className="h-11 bg-gray-200 rounded-xl" />
        </div>

        <div className="mt-3 h-4 w-32 bg-gray-200 rounded" />
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            {/* 이미지 */}
            <div className="aspect-[4/3] bg-gray-200 relative">
              <div className="absolute bottom-4 left-4">
                <div className="h-5 w-40 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
            </div>

            {/* 내용 */}
            <div className="p-4">
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-4/5 bg-gray-200 rounded mb-6" />

              {/* 작성자 */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>

              {/* 해시태그 */}
              <div className="flex gap-2 mb-4">
                <div className="h-4 w-14 bg-gray-200 rounded-full" />
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
                <div className="h-4 w-12 bg-gray-200 rounded-full" />
              </div>

              {/* 하단 */}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <div className="flex gap-4">
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                </div>

                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHotplaceSkeleton;