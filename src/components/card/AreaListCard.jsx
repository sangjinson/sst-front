import React from 'react';

const tagStyles = {
  볼거리: 'bg-[#E8F7EE] text-[#0F9B73]',
  먹거리: 'bg-[#FFF2E8] text-[#E26338]',
  놀거리: 'bg-[#EEF4FF] text-[#3B82F6]',
  잘거리: 'bg-[#F3E8FF] text-[#8B5CF6]',
};

const AreaListCard = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex h-[310px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-[translate,scale,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#0F9B73]/30 hover:shadow-[0_22px_54px_rgba(15,23,42,0.16)] active:scale-[0.98] sm:h-[365px]"
    >
      <div className="relative h-[175px] shrink-0 overflow-hidden sm:h-[210px]">
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <div className="relative bg-white p-4 sm:p-5">
        <span
          className={`mb-3 inline-block w-fit rounded px-3.5 py-1 text-sm font-semibold sm:text-base ${
            tagStyles[item.tag] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.tag}
        </span>

        <h4 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#0F9B73] sm:text-[1.35rem]">
          {item.title}
        </h4>

        <p className="line-clamp-2 text-base leading-relaxed text-gray-500 sm:text-lg">
          {item.desc}
        </p>
      </div>
    </div>
  );
};

export default AreaListCard;