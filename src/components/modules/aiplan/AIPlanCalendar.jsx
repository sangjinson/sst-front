import React, { useState } from 'react';
import { MONTH_NAMES } from './aiPlanUtils';

/**
 * AIPlanCalendar - AI 플랜 달력 컴포넌트
 *
 * 사용 예시:
 * // 시작일 선택
 * <AIPlanCalendar
 *   mode="start"
 *   nights={1}
 *   onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
 *   onClose={() => setShowStartCal(false)}
 * />
 *
 * // 종료일 선택
 * <AIPlanCalendar
 *   mode="end"
 *   startDate={startDate}
 *   nights={1}
 *   onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
 *   onClose={() => setShowEndCal(false)}
 * />
 *
 * props:
 * - mode      : 'start' | 'end' — 시작일 선택 or 종료일 선택
 * - nights    : 박수 (0: 당일, 1: 1박, 2: 2박)
 * - startDate : mode='end'일 때 기준이 되는 시작일 (YYYY-MM-DD)
 * - onSelect  : 날짜 선택 완료 콜백 (start, end) => void
 * - onClose   : 닫기 콜백
 */
const AIPlanCalendar = ({ onSelect, onClose, nights = 0, mode = 'start', startDate = null }) => {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const toDateStr = (day) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const handleDayClick = (day) => {
    const dateStr = toDateStr(day);
    if (mode === 'start') {
      // 시작일 클릭 → nights만큼 종료일 자동 계산
      const endStr = nights > 0 ? addDays(dateStr, nights) : dateStr;
      onSelect(dateStr, endStr);
    } else {
      // 종료일 클릭 → nights만큼 역산해서 시작일 자동 계산
      if (nights > 0) {
        const autoStart = addDays(dateStr, -nights);
        onSelect(autoStart, dateStr);
      } else {
        // 당일여행이면 시작일 = 종료일
        onSelect(dateStr, dateStr);
      }
    }
  };

  const isStart = (day) => startDate === toDateStr(day);
  const isInRange = (day) => {
    if (!startDate || mode === 'start') return false;
    const d = toDateStr(day);
    return d > startDate;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 w-[300px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">‹</button>
        <span className="text-sm font-bold text-gray-800">{viewYear}년 {MONTH_NAMES[viewMonth]}</span>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">›</button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 mb-1">
        {['일','월','화','수','목','금','토'].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPast        = toDateStr(day) < new Date().toISOString().slice(0, 10);
          const isBeforeStart = mode === 'end' && startDate && toDateStr(day) < startDate;
          return (
            <button
              key={day}
              onClick={() => !isPast && !isBeforeStart && handleDayClick(day)}
              disabled={isPast || isBeforeStart}
              className={`text-xs w-8 h-8 mx-auto rounded-full transition flex items-center justify-center
                ${isStart(day) ? 'bg-[#0F9B73] text-white font-bold' : ''}
                ${isInRange(day) ? 'bg-green-100 text-green-700' : ''}
                ${!isStart(day) && !isInRange(day) && !isPast && !isBeforeStart ? 'hover:bg-gray-100 text-gray-700' : ''}
                ${isPast || isBeforeStart ? 'text-gray-300 cursor-not-allowed' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 닫기 */}
      <div className="flex justify-end mt-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AIPlanCalendar;