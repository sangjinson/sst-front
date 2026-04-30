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
        <span className="inline-block fs-up-1 bg-[#FFF2E8] text-[#E26338] font-semibold py-1 px-2.5 rounded mb-3">
          {item.tag}
        </span>
        <h4 className="fs-up-3 font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <p className="fs-up-2 text-gray-500 leading-relaxed line-clamp-2">
          {item.desc}
        </p>
      </div>
    </div>
  );
};

export default AreaListCard;
