import React from 'react';

const THM_LABEL_MAP = {
  'THM001': '축제/행사',
  'THM002': '체험',
  'THM003': '식도락',
  'THM004': '역사',
  'THM005': '레저',
  'THM006': '테마파크',
};

const AIResultTags = ({
  selectedRegion,
  selectedPeriod,
  startDate,
  endDate,
  selectedThemes,
  selectedCompanion,
  existingId,
  savedName,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
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
      {startDate && endDate && (
        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
          {startDate} ~ {endDate}
        </span>
      )}
      {selectedCompanion && (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
          👤 {selectedCompanion}
        </span>
      )}
      {(selectedThemes || []).map(t => (
        <span key={t} className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">
          {THM_LABEL_MAP[t] ?? t}
        </span>
      ))}
      {existingId && savedName && (
        <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full font-medium">
          📝 {savedName}
        </span>
      )}
    </div>
  );
};

export default AIResultTags;