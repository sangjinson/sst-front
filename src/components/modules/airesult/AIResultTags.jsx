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
      <span className="text-base font-semibold text-gray-700">🗺 여행코스</span>

      {selectedRegion && (
        <span className="px-4 py-1 bg-[#4CAF8C] text-white text-sm rounded-full font-medium">
          {selectedRegion}
        </span>
      )}

      {selectedPeriod && (
        <span className="px-4 py-1 bg-[#4CAF8C] text-white text-sm rounded-full font-medium">
          {selectedPeriod}
        </span>
      )}

      {selectedThemes?.map((t, i) => (
        <span key={i} className="px-4 py-1 bg-[#4CAF8C] text-white text-sm rounded-full font-medium">
          {t}
        </span>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowCal(prev => !prev)}
          className="px-4 py-1 bg-[#4CAF8C] text-white text-sm rounded-full font-medium hover:bg-[#0d8a66] transition"
        >
          📅 {dateLabel}
        </button>

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
    </div>
  );
};

export default AIResultTags;