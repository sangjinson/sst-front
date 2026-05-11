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
    <div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <h2 className="text-lg font-bold text-gray-800">어떤 여행을 원하시나요?</h2>
        </div>
        <p className="text-sm text-gray-400">테마는 최대 3개까지 선택 가능합니다</p>
        {selectedThemes.length > 0 && (
          <p className="text-xs text-[#0F9B73] mt-1">{selectedThemes.length}/3 선택됨</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {THEME_OPTIONS.map(theme => (
          <button
            key={theme.value}
            onClick={() => onToggle(theme.value)}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
              selectedThemes.includes(theme.value)
                ? 'border-[#0F9B73] bg-green-50'
                : 'border-gray-200 hover:border-green-200'
            }`}
          >
            <span className="text-3xl">{theme.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIPlanThemeGrid;