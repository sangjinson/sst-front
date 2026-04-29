import React from 'react';
import AIResultScheduleItem from './AIResultScheduleItem';

const AIResultScheduleList = ({
  schedule,
  activeDay,
  dragIndex,
  dragOverIndex,
  onDayChange,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  onGoDetail,
  onSave,
  onToggleSearch,
  showSearch,
  onItemClick,   // ✅ 추가
  selectedItem,  // ✅ 추가
}) => {
  const currentDayItems = schedule[activeDay] || [];

  return (
    <div className="w-[320px] shrink-0 border-r border-gray-100">

      {/* 일차 탭 */}
      <div className="flex border-b border-gray-100">
        {schedule.map((_, i) => (
          <button
            key={i}
            onClick={() => onDayChange(i)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeDay === i
                ? 'text-[#0F9B73] border-b-2 border-[#0F9B73]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {i + 1}일차
          </button>
        ))}
      </div>

      {/* 일정 리스트 */}
      <div className="p-3 space-y-2 max-h-[520px] overflow-y-auto">
        {currentDayItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">일정이 없습니다</div>
        ) : (
          currentDayItems.map((item, idx) => (
            <AIResultScheduleItem
              key={item.id}
              item={item}
              idx={idx}
              dragIndex={dragIndex}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDelete={onDelete}
              onGoDetail={onGoDetail}
              onClick={() => onItemClick?.(item)}              // ✅ 추가
              isSelected={selectedItem?.id === item.id}       // ✅ 추가
            />
          ))
        )}
      </div>

      {/* 저장 / 추가 버튼 */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 py-2 bg-[#0F9B73] text-white text-sm font-medium rounded-xl hover:bg-[#0d8a66] transition"
        >
          저장
        </button>
        <button
          onClick={onToggleSearch}
          className="flex-1 py-2 border border-[#E8956D] text-[#E8956D] text-sm font-medium rounded-xl hover:bg-orange-50 transition"
        >
          {showSearch ? '닫기' : '+ 추가'}
        </button>
      </div>
    </div>
  );
};

export default AIResultScheduleList;