import React from 'react';
import AIResultScheduleItem from './AIResultScheduleItem';

const AIResultScheduleList = ({
  schedule,
  activeDay,
  dragIndex,
  onDayChange,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  onGoDetail,
  onSave,
  onToggleSearch,
  showSearch,
  onItemClick,
  selectedItem,
  renderHeart,  //추가
}) => {
  const currentDayItems = schedule[activeDay]?.plans || [];

  return (
    <div className="w-full md:w-[320px] shrink-0 border-r border-gray-100 flex flex-col">

      {/* 일차 탭 */}
      <div className="flex border-b border-gray-100">
        {schedule.map((_, i) => (
          <button
            key={i}
            onClick={() => onDayChange(i)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeDay === i
                ? 'text-[#4CAF8C] border-b-2 border-[#4CAF8C]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {i + 1}일차
          </button>
        ))}
      </div>

      {/* 일정 리스트 */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto md:max-h-[550px]">
        {currentDayItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">일정이 없습니다</div>
        ) : (
          currentDayItems.map((item, idx) => (
            <AIResultScheduleItem
              key={item.placeId}
              item={item}
              idx={idx}
              dragIndex={dragIndex}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDelete={onDelete}
              onGoDetail={onGoDetail}
              onClick={() => onItemClick?.(item)}
              isSelected={selectedItem?.placeId === item.placeId} // placeId로 통일
              renderHeart={renderHeart} // 전달
            />
          ))
        )}
      </div>

      {/* 저장 / 추가 버튼 */}
      <div className="sticky bottom-0 z-10 bg-white p-3 border-t border-gray-100 flex gap-2 outline-none">
        <button
          onClick={onSave}
          className="flex-1 py-2.5 bg-[#4CAF8C] text-white text-sm font-medium rounded-xl hover:bg-[#0d8a66] transition focus:outline-none"
        >
          저장
        </button>
        <button
          onClick={onToggleSearch}
          className={`flex-1 py-2.5 text-white text-sm font-medium rounded-xl transition focus:outline-none ${showSearch ? 'bg-[#0d8a66]' : 'bg-[#4CAF8C] hover:bg-[#0d8a66]'}`}
        >
          {showSearch ? '닫기' : '+ 추가'}
        </button>
      </div>
    </div>
  );
};

export default AIResultScheduleList;