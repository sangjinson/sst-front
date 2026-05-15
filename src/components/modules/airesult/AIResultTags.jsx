import React from 'react';

const AIResultTags = ({
  selectedRegion,
  selectedPeriod,
  startDate,
  endDate,
  selectedThemes,
}) => {
  const items = [
    selectedRegion && { value: selectedRegion },
    selectedPeriod && { value: selectedPeriod },
    startDate && { value: startDate === endDate ? startDate : `${startDate} ~ ${endDate}` },
    selectedThemes?.length > 0 && selectedThemes.map(t => ({ value: t })),
  ].flat().filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-semibold text-gray-700">🗺 여행코스</span>
      {items.map((item, i) => (
        <span key={i} className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">
          {item.value}
        </span>
      ))}
    </div>
  );
};

export default AIResultTags;