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
      <div className="mb-9 text-center md:mb-11">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#0F9B73]" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h2 className="text-2xl font-black text-gray-900 md:text-3xl">여행 기간을 선택해주세요</h2>
        </div>
        <p className="text-base font-semibold text-gray-400">원하는 여행 일정 유형을 고르거나 직접 입력하세요</p>
      </div>

      {/* 기간 카드 */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PERIOD_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onPeriodSelect(opt)}
            className={`min-h-[96px] rounded-2xl border p-5 text-left transition-all duration-200 active:scale-[0.98] ${
              selectedPeriod === opt.value
                ? 'border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-[#0F9B73]/20'
                : 'border-gray-200 bg-gray-50 hover:-translate-y-0.5 hover:border-[#0F9B73]/30 hover:bg-white hover:shadow-sm'
            }`}
          >
            <p className={`mb-1 text-lg font-bold transition-colors duration-200 ${selectedPeriod === opt.value ? 'text-[#0F9B73]' : 'text-gray-900'}`}>{opt.label}</p>
            <p className="text-sm font-medium text-gray-400">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* 날짜 선택 - 시작일/종료일 각각 분리 */}
      <div className="border-t border-gray-100 pt-7">
        <p className="mb-4 text-base font-bold text-gray-800">
          날짜를 선택해주세요
          {selectedPeriod && (
            <span className="ml-2 text-xs text-[#0F9B73] font-normal">
              시작일 선택 시 {selectedPeriod} 자동 적용
            </span>
          )}
        </p>

        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">

          {/* 시작일 */}
          <div className="relative flex-1">
            <div
              onClick={() => { setShowStartCal(prev => !prev); setShowEndCal(false); }}
              className={`cursor-pointer rounded-2xl border bg-gray-50 px-5 py-4 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-[#0F9B73]/70 ${
                showStartCal ? 'border-[#0F9B73]/70 bg-white shadow-sm' : 'border-gray-200'
              }`}
            >
              <span className="mb-1 block text-sm font-semibold text-gray-400">시작일</span>
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

          <span className="text-center text-gray-400">~</span>

          {/* 종료일 */}
          <div className="relative flex-1">
            <div
              onClick={() => { setShowEndCal(prev => !prev); setShowStartCal(false); }}
              className={`cursor-pointer rounded-2xl border bg-gray-50 px-5 py-4 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-[#0F9B73]/70 ${
                showEndCal ? 'border-[#0F9B73]/70 bg-white shadow-sm' : 'border-gray-200'
              }`}
            >
              <span className="mb-1 block text-sm font-semibold text-gray-400">종료일</span>
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