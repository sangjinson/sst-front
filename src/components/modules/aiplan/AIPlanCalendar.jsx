import React, { useState } from 'react';
import { addDays, MONTH_NAMES } from './aiPlanUtils';

/**
 * AIPlanCalendar - AI 플랜 달력 컴포넌트
 *
 * 사용 예시:
 * <AIPlanCalendar
 *   onSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
 *   onClose={() => setShowCalendar(false)}
 *   nights={1}
 * />
 *
 * props:
 * - onSelect : 날짜 선택 완료 콜백 (start, end) => void
 * - onClose  : 닫기 콜백
 * - nights   : 박수 (0: 당일, 1: 1박, 2: 2박)
 */
const AIPlanCalendar = ({ onSelect, onClose, nights = 0 }) => {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate]     = useState(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const handleDayClick = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (nights === 0) {
      setStartDate(dateStr);
      setEndDate(dateStr);
    } else {
      setStartDate(dateStr);
      setEndDate(addDays(dateStr, nights));
    }
  };

  const toDateStr = (day) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const d = toDateStr(day);
    return d > startDate && d < endDate;
  };
  const isStart = (day) => startDate === toDateStr(day);
  const isEnd   = (day) => endDate   === toDateStr(day);

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
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            className={`text-xs w-8 h-8 mx-auto rounded-full transition flex items-center justify-center
              ${isStart(day) || isEnd(day) ? 'bg-[#0F9B73] text-white font-bold' : ''}
              ${isInRange(day) ? 'bg-green-100 text-green-700' : ''}
              ${!isStart(day) && !isEnd(day) && !isInRange(day) ? 'hover:bg-gray-100 text-gray-700' : ''}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 선택 범위 표시 */}
      {startDate && (
        <div className="mt-3 text-xs text-center text-gray-500">
          {startDate} {endDate && endDate !== startDate ? `~ ${endDate}` : ''}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2 mt-3">
        <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50">취소</button>
        <button
          onClick={() => startDate && onSelect(startDate, endDate || startDate)}
          disabled={!startDate}
          className="flex-1 py-2 bg-[#0F9B73] text-white rounded-xl text-xs font-medium hover:bg-[#0d8a66] disabled:opacity-40"
        >확인</button>
      </div>
    </div>
  );
};

export default AIPlanCalendar;