import React from 'react';
import AreaListCard from '@components/card/AreaListCard';

const CategorySection = ({ title, pathType, dataList, onMoreClick, onCardClick }) => {
  return (
    <section className="mb-[5vw]">
      <div className="mb-5 flex items-end justify-between gap-4 md:mb-8">
        {/* 변경 전 확인용: 배지 형태 제목 스타일
        <h3 className="flex items-center gap-3 text-[1.9rem] font-bold text-gray-900">
          <span className="inline-flex items-center rounded-full bg-[#FFF2E8] px-5 py-2.5 text-lg font-semibold text-[#E26338]">
            {title}
          </span>
        </h3>
        */}
        <h3 className="flex items-center gap-2.5 font-bold text-gray-900 fs-up-4">
          <span className="inline-block h-5 w-1 rounded-sm bg-[#E26338]"></span>
          {title}
        </h3>
        <button
  type="button"
  onClick={() => onMoreClick(pathType)}
  className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 fs-up-2 font-medium text-black transition-all duration-200 hover:border-[#0F9B73] hover:text-[#0F9B73]"
>
  더보기 <span className="ml-1">→</span>
</button>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-[25px] md:overflow-visible md:px-0 md:pb-0">
        {dataList.map((item) => (
          <div key={item.id} className="min-w-[82%] snap-center md:min-w-0">
            <AreaListCard
              item={item}
              onClick={() => onCardClick(pathType, item)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
