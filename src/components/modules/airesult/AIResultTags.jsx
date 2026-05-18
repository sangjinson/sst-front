import React, { useState } from 'react';
import AIPlanCalendar from '@components/modules/aiplan/AIPlanCalendar';

const AIResultTags = ({
  selectedRegion,
  selectedPeriod,
  startDate,
  endDate,
  selectedThemes,
  onDateChange,
}) => {
  const [showCal, setShowCal] = useState(false);

  const dateLabel = startDate
    ? startDate === endDate ? startDate : `${startDate} ~ ${endDate}`
    : '날짜 미정';

  const nights = startDate && endDate
    ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 relative">
      <span className="text-sm font-semibold text-gray-700">🗺 여행코스</span>

      {selectedRegion && (
        <span className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">
          {selectedRegion}
        </span>
      )}

      {selectedPeriod && (
        <span className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">
          {selectedPeriod}
        </span>
      )}

      {/* 날짜 클릭 시 달력 오픈 */}
      <button
        onClick={() => setShowCal(prev => !prev)}
        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-300 transition"
      >
        📅 {dateLabel}
      </button>

      {selectedThemes?.map((t, i) => (
        <span key={i} className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">
          {t}
        </span>
      ))}

      {/* 달력 */}
      {showCal && (
        <AIPlanCalendar
          mode="start"
          nights={nights}
          startDate={startDate}
          onSelect={(start, end) => {
            onDateChange?.(start, end);
            setShowCal(false);
          }}
          onClose={() => setShowCal(false)}
        />
      )}
    </div>
  );
};

export default AIResultTags;