import React from 'react';
import { TYPE_LABEL, TYPE_COLOR, CAT_LABEL_MAP, CAT_COLOR_MAP, CAT_KOR_COLOR_MAP } from './aiResultUtils';

const AIResultScheduleItem = ({
  item,
  idx,
  dragIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  onGoDetail,
  onClick,
  isSelected,
  renderHeart, // 추가
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={(e) => onDragOver(e, idx)}
      onDrop={onDrop}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-5 rounded-xl border-2 transition cursor-pointer ${
        isSelected
          ? 'border-[#4CAF8C] bg-green-50'
          : dragIndex === idx
            ? 'opacity-50 border-[#4CAF8C]'
            : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* 순서 번호 */}
      <div className="w-7 h-7 rounded-full bg-[#4CAF8C] text-white text-xs flex items-center justify-center shrink-0 font-bold">
        {idx + 1}
      </div>

      {/* 이미지 */}
      <div className="w-18 h-18 rounded-lg overflow-hidden shrink-0">
        {item.imgUrl ? (
          <img src={item.imgUrl} alt={item.placeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            CAT_KOR_COLOR_MAP[item.category] ?? CAT_COLOR_MAP[item.category] ?? TYPE_COLOR[item.type] ?? 'bg-green-100 text-[#4CAF8C]'
          }`}>
            {item.category ?? CAT_LABEL_MAP[item.category] ?? TYPE_LABEL[item.type]}
          </span>
        </div>
        <p className="text-base font-semibold text-gray-800 truncate">{item.placeName}</p>
        <p className="text-sm text-gray-400 truncate">{item.address || item.overview}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center shrink-0">
        {/* 하트 버튼 */}
        {renderHeart && (
          <div onClick={(e) => e.stopPropagation()}>
            {renderHeart(item)}
          </div>
        )}
        <button
          onClick={(e) => { 
          e.stopPropagation(); 
          console.log("상세보기 item:", JSON.stringify(item));
          onGoDetail(item); 
        }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#4CAF8C] transition"
          title="상세보기"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(idx); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition"
          title="삭제"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIResultScheduleItem;