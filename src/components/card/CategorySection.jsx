import React from 'react';
import AreaListCard from '@components/card/AreaListCard'; // 🚀 경로 확인!

const CategorySection = ({ title, pathType, dataList, onMoreClick, onCardClick }) => {
  return (
    <section className="mb-[60px]">
      <div className="flex justify-between items-end mb-[25px]">
        <h3 className="text-[22px] font-bold flex items-center gap-2.5 text-gray-900">
          <span className="inline-block w-1 h-5 bg-[#E26338] rounded-sm"></span>
          {title}
        </h3>
        <button 
          onClick={() => onMoreClick(pathType)}
          className="bg-[#f5f5f5] border border-[#eee] py-1 px-4 rounded-full text-[12px] text-gray-600 cursor-pointer hover:bg-[#eee] transition-colors"
        >
          더보기 <span>→</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[25px]">
        {dataList.map((item) => (
          <AreaListCard 
            key={item.id} 
            item={item} 
            onClick={() => onCardClick(pathType, item)} 
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;