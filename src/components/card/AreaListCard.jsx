import React from 'react';

const AreaListCard = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-[translate,scale,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#0F9B73]/30 hover:shadow-[0_22px_54px_rgba(15,23,42,0.16)] active:scale-[0.98]"
    >
      <div className="relative h-[150px] overflow-hidden sm:h-[180px]">
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <div className="relative bg-white p-4 sm:p-5">
        <span className="mb-3 inline-block rounded bg-[#FFF2E8] px-2.5 py-1 text-xs font-semibold text-[#E26338] sm:text-sm">
          {item.tag}
        </span>

        <h4 className="mb-2 line-clamp-1 text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0F9B73] sm:text-lg">
          {item.title}
        </h4>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 sm:text-base">
          {item.desc}
        </p>
      </div>
    </div>
  );
};

export default AreaListCard;