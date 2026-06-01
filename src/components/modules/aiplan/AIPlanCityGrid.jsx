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
    <div data-aos="zoom-in" data-aos-once="true">
      <div className="mb-7 text-center md:mb-8">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#0F9B73] md:h-8 md:w-8" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <h2 className="text-2xl font-black text-gray-900 md:text-[2rem]">어디로 떠나시겠어요?</h2>
        </div>
        <p className="text-base font-semibold leading-relaxed text-gray-400 md:text-lg">경기도 시·군을 선택해주세요</p>
      </div>

      {/* 남부/북부 탭 */}
      <div className="mb-7 flex justify-center gap-3">
        {['남부', '북부'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-2xl px-7 py-3 text-base font-semibold md:text-lg transition-all duration-200 active:scale-[0.98] ${
              activeTab === tab
                ? 'bg-white text-[#0F9B73] shadow-[0_8px_22px_rgba(15,23,42,0.08)] ring-1 ring-[#0F9B73]/25'
                : 'bg-gray-100 text-gray-500 hover:-translate-y-0.5 hover:bg-white hover:text-gray-700 hover:shadow-sm'
            }`}
          >
            경기 {tab}
          </button>
        ))}
      </div>

      {/* 도시 그리드 */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4" data-aos="zoom-in-up" data-aos-once="true">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className={`h-12 rounded-2xl px-2 text-base font-semibold transition-all duration-200 active:scale-[0.98] md:h-[58px] md:px-4 md:text-lg ${
              selectedRegion === city
                ? 'border border-gray-200 bg-white text-[#0F9B73] shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                : 'border border-gray-200 bg-gray-50 text-gray-600 hover:-translate-y-0.5 hover:border-[#0F9B73]/30 hover:bg-white hover:text-gray-800 hover:shadow-sm'
            }`}
          >
            <span className="block truncate tracking-[0.08em]">{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIPlanCityGrid;
