import React from 'react';
import { TYPE_LABEL, TYPE_COLOR } from './aiResultUtils';

const AIResultScheduleItem = ({
  item,
  idx,
  dragIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  onGoDetail,
  onClick,       // ✅ 추가
  isSelected,    // ✅ 추가
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={(e) => onDragOver(e, idx)}
      onDrop={onDrop}
      onClick={onClick}  // ✅ 추가
      className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer ${
        isSelected
          ? 'border-[#0F9B73] bg-green-50'                          // ✅ 선택된 아이템 강조
          : dragIndex === idx
            ? 'opacity-50 border-[#0F9B73]'
            : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* 순서 번호 */}
      <div className="w-6 h-6 rounded-full bg-[#0F9B73] text-white text-xs flex items-center justify-center shrink-0 font-bold">
        {idx + 1}
      </div>

      {/* 이미지 */}
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-xs text-gray-400">{item.time}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TYPE_COLOR[item.type]}`}>
            {TYPE_LABEL[item.type]}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400 truncate">{item.desc}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-1 shrink-0">
        {/* 바로가기 */}
        <button
          onClick={(e) => { e.stopPropagation(); onGoDetail(item); }}  // ✅ 버블링 방지
          className="p-1 rounded text-gray-400 hover:text-[#0F9B73] hover:bg-gray-50 transition"
          title="상세보기"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
        {/* 삭제 */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(idx); }}  // ✅ 버블링 방지
          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          title="삭제"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
        {/* 드래그 핸들 */}
        <button className="p-1 rounded text-gray-300 cursor-grab" title="순서 변경">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
            <line x1="3" y1="7" x2="21" y2="7"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="17" x2="21" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIResultScheduleItem;