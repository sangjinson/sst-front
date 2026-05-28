import React from "react";

const CommunityLifeSkeleton = () => {
  return (
    <div className="paperlogy min-h-screen bg-[#f7f8fa] font-sans">
      <div className="max-w-[1420px] mx-auto px-4 py-6 md:py-10 mb-20 animate-pulse">

        {/* 브레드크럼 */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-6" />

        {/* 제목 영역 */}
        <section className="mt-8 mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />

              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-40 bg-gray-300 rounded-lg" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
              </div>

              <div className="h-4 w-80 bg-gray-200 rounded" />
            </div>

            <div className="h-11 w-32 bg-gray-300 rounded-full" />
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
        <div className="flex flex-col gap-8">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col lg:flex-row">

                {/* 썸네일 */}
                <div className="lg:w-[360px] h-[260px] bg-gray-200 shrink-0" />

                {/* 내용 */}
                <div className="flex-1 p-6">

                  {/* 제목 */}
                  <div className="h-7 w-2/3 bg-gray-300 rounded mb-4" />

                  {/* 설명 */}
                  <div className="space-y-2 mb-5">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  </div>

                  {/* 해시태그 */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-14 bg-gray-200 rounded-full" />
                  </div>

                  {/* 테마 */}
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  </div>

                  {/* 하단 */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">

                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>

                    <div className="flex gap-4">
                      <div className="h-5 w-10 bg-gray-200 rounded" />
                      <div className="h-5 w-10 bg-gray-200 rounded" />
                      <div className="h-5 w-10 bg-gray-200 rounded" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default CommunityLifeSkeleton;