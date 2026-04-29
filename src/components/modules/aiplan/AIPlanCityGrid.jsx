// 역할: 남부/북부 탭 + 경기도 시군 그리드

import React from 'react';
import { CITIES_SOUTH, CITIES_NORTH } from './aiPlanUtils';

/**
 * AIPlanCityGrid - 지역 선택 그리드
 *
 * 사용 예시:
 * <AIPlanCityGrid
 *   selectedRegion={selectedRegion}
 *   onSelect={(city) => setSelectedRegion(city)}
 * />
 *
 * props:
 * - selectedRegion : 선택된 지역명
 * - onSelect       : 지역 선택 콜백 (city) => void
 */
const AIPlanCityGrid = ({ selectedRegion, onSelect }) => {
  const [activeTab, setActiveTab] = React.useState('남부');
  const cities = activeTab === '남부' ? CITIES_SOUTH : CITIES_NORTH;

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <h2 className="text-lg font-bold text-gray-800">어디로 떠나시겠어요?</h2>
        </div>
        <p className="text-sm text-gray-400">경기도 시·군을 선택해주세요</p>
      </div>

      {/* 남부/북부 탭 */}
      <div className="flex justify-center gap-2 mb-5">
        {['남부', '북부'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab ? 'bg-[#0F9B73] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            경기 {tab}
          </button>
        ))}
      </div>

      {/* 도시 그리드 */}
      <div className="grid grid-cols-5 gap-2">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className={`py-2.5 px-2 rounded-xl text-sm font-medium transition ${
              selectedRegion === city
                ? 'bg-[#0F9B73] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-[#0F9B73] border border-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">선택됨: </span>
          <span className="text-sm font-bold text-[#0F9B73]">{selectedRegion}</span>
        </div>
      )}
    </div>
  );
};

export default AIPlanCityGrid;