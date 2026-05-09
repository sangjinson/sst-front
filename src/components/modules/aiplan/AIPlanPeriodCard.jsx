import React, { useState } from 'react';
import { PERIOD_OPTIONS } from './aiPlanUtils';
import AIPlanCalendar from './AIPlanCalendar';

/**
 * AIPlanPeriodCard - 여행 기간 선택 카드
 *
 * 사용 예시:
 * <AIPlanPeriodCard
 *   selectedPeriod={selectedPeriod}
 *   selectedNights={selectedNights}
 *   startDate={startDate}
 *   endDate={endDate}
 *   onPeriodSelect={(opt) => { setSelectedPeriod(opt.value); setSelectedNights(opt.nights); }}
 *   onDateSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
 * />
 *
 * props:
 * - selectedPeriod : 선택된 기간값
 * - selectedNights : 박수
 * - startDate      : 시작일
 * - endDate        : 종료일
 * - onPeriodSelect : 기간 선택 콜백 (opt) => void
 * - onDateSelect   : 날짜 선택 콜백 (start, end) => void
 */
const AIPlanPeriodCard = ({
  selectedPeriod,
  selectedNights = 0,
  startDate,
  endDate,
  onPeriodSelect,
  onDateSelect,
}) => {
  const [showStartCal, setShowStartCal] = useState(false);
  const [showEndCal, setShowEndCal]     = useState(false);

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h2 className="text-lg font-bold text-gray-800">여행 기간을 선택해주세요</h2>
        </div>
        <p className="text-sm text-gray-400">원하는 여행 일정 유형을 고르거나 직접 입력하세요</p>
      </div>

      {/* 기간 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {PERIOD_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onPeriodSelect(opt)}
            className={`p-5 rounded-2xl border-2 text-left transition ${
              selectedPeriod === opt.value
                ? 'border-[#0F9B73] bg-green-50'
                : 'border-gray-200 hover:border-green-200'
            }`}
          >
            <p className="font-bold text-gray-800 mb-1">{opt.label}</p>
            <p className="text-xs text-gray-400">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* 날짜 선택 - 시작일/종료일 각각 분리 */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          날짜를 선택해주세요
          {selectedPeriod && (
            <span className="ml-2 text-xs text-[#0F9B73] font-normal">
              (시작일 선택 시 {selectedPeriod} 자동 적용)
            </span>
          )}
        </p>

        <div className="flex items-center gap-3">

          {/* 시작일 */}
          <div className="relative flex-1">
            <div
              onClick={() => { setShowStartCal(prev => !prev); setShowEndCal(false); }}
              className={`border rounded-xl px-4 py-3 bg-gray-50 text-sm text-gray-600 cursor-pointer hover:border-[#0F9B73] transition ${
                showStartCal ? 'border-[#0F9B73]' : 'border-gray-200'
              }`}
            >
              <span className="text-xs text-gray-400 block">시작일</span>
              {startDate || '날짜 선택'}
            </div>
            {showStartCal && (
              <AIPlanCalendar
                mode="start"
                nights={selectedNights}
                onSelect={(start, end) => {
                  onDateSelect(start, end);
                  setShowStartCal(false);
                }}
                onClose={() => setShowStartCal(false)}
              />
            )}
          </div>

          <span className="text-gray-400">~</span>

          {/* 종료일 */}
          <div className="relative flex-1">
            <div
              onClick={() => { setShowEndCal(prev => !prev); setShowStartCal(false); }}
              className={`border rounded-xl px-4 py-3 bg-gray-50 text-sm text-gray-600 cursor-pointer hover:border-[#0F9B73] transition ${
                showEndCal ? 'border-[#0F9B73]' : 'border-gray-200'
              }`}
            >
              <span className="text-xs text-gray-400 block">종료일</span>
              {endDate || '날짜 선택'}
            </div>
            {showEndCal && (
              <AIPlanCalendar
                mode="end"
                startDate={startDate}
                nights={selectedNights}
                onSelect={(start, end) => {
                  onDateSelect(start, end);
                  setShowEndCal(false);
                }}
                onClose={() => setShowEndCal(false)}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIPlanPeriodCard;