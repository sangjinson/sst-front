import React from 'react';
import { THEME_OPTIONS } from './aiPlanUtils';

/**
 * AIPlanThemeGrid - 여행 테마 선택 그리드
 *
 * 사용 예시:
 * <AIPlanThemeGrid
 *   selectedThemes={selectedThemes}
 *   onToggle={(theme) => toggleTheme(theme)}
 * />
 *
 * props:
 * - selectedThemes : 선택된 테마 배열
 * - onToggle       : 테마 토글 콜백 (theme) => void
 */
const AIPlanThemeGrid = ({ selectedThemes = [], onToggle }) => {
  return (
    <div data-aos="zoom-in" data-aos-once="true">
      <div className="mb-9 text-center md:mb-11">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#0F9B73] md:h-8 md:w-8" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <h2 className="text-2xl font-black text-gray-900 md:text-[2rem]">어떤 여행을 원하시나요?</h2>
        </div>
        <p className="text-base font-semibold leading-relaxed text-gray-400 md:text-lg">테마는 최대 3개까지 선택 가능합니다</p>
        {selectedThemes.length > 0 && (
          <p className="mt-2 text-sm font-bold text-[#0F9B73] md:text-base">{selectedThemes.length}/3 선택됨</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3" data-aos="zoom-in-up" data-aos-once="true">
        {THEME_OPTIONS.map(theme => (
          <button
            key={theme.value}
            onClick={() => onToggle(theme.value)}
            className={`flex min-h-[108px] flex-col items-center justify-center gap-2.5 rounded-2xl border p-4 md:min-h-[128px] md:gap-4 md:p-6 transition-all duration-200 active:scale-[0.98] ${
              selectedThemes.includes(theme.value)
                ? 'border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-[#0F9B73]/20'
                : 'border-gray-200 bg-gray-50 hover:-translate-y-0.5 hover:border-[#0F9B73]/30 hover:bg-white hover:shadow-sm'
            }`}
          >
            <span className="text-3xl md:text-[2.5rem]">{theme.emoji}</span>
            <span className={`text-base font-bold tracking-[0.04em] transition-colors duration-200 md:text-lg ${selectedThemes.includes(theme.value) ? 'text-[#0F9B73]' : 'text-gray-800'}`}>{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIPlanThemeGrid;