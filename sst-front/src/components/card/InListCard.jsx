import React from 'react';

const InListCard = ({ item }) => {
  return (
    <div className="group cursor-pointer">
      {/* 카드 이미지 영역 */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm">
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/400x300'} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* 좋아요 아이콘 */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* 뱃지 영역 */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          <span className="px-2 py-1 bg-black/50 text-[10px] text-white rounded-md">{item.location}</span>
          <span className="px-2 py-1 bg-[#16a38a] text-[10px] text-white rounded-md">{item.type}</span>
        </div>
      </div>

      {/* 정보 영역 */}
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{item.title}</h3>
          <div className="flex items-center text-[#ff9d00] text-sm">
            <span className="mr-1">★</span> {item.rating}
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2 leading-relaxed">
          {item.desc}
        </p>
        <div className="flex items-center text-[11px] text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {item.address}
        </div>
      </div>
    </div>
  );
};

export default InListCard;