import React from 'react';

const AreaListCard = ({ item, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-[#eee] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] group"
    >
      <img 
        src={item.img} 
        alt={item.title} 
        className="w-full h-[180px] object-cover block group-hover:scale-105 transition-transform duration-300" 
      />
      <div className="p-5 relative bg-white">
        <span className="inline-block bg-[#FFF2E8] text-[#E26338] text-[11px] font-bold py-1 px-2.5 rounded mb-3">
          {item.tag}
        </span>
        <h4 className="text-[18px] font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>
    </div>
  );
};

export default AreaListCard;