import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import {
  AIPlanStepIndicator,
  AIPlanCityGrid,
  AIPlanThemeGrid,
} from '@components/modules/aiplan';
import '@assets/css/common.css';

// ────────────────────────────────────────────
// 여행 기간 옵션
// ────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { value: '당일여행', label: '당일여행', desc: '하루 안에 즐기는 가벼운 여행', nights: 0 },
  { value: '1박2일',   label: '1박 2일',  desc: '여유롭게 하루 숙박',           nights: 1 },
  { value: '2박3일',   label: '2박 3일',  desc: '알찬 경기도 전통 일정',         nights: 2 },
];

// ────────────────────────────────────────────
// 동행 유형
// ────────────────────────────────────────────
const COMPANION_OPTIONS = [
  { value: '1인',  label: '1인',    emoji: '🙋' },
  { value: '반려', label: '반려동물', emoji: '🐾' },
  { value: '커플', label: '커플',    emoji: '💑' },
  { value: '가족', label: '가족',    emoji: '👨‍👩‍👧' },
  { value: '친구', label: '친구',    emoji: '👫' },
];

// ────────────────────────────────────────────
// 달력 컴포넌트
// ────────────────────────────────────────────
const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const Calendar = ({ onSelect, onClose, nights = 0, mode = 'start', startDate = null }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
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
      const endStr = nights > 0 ? addDays(dateStr, nights) : dateStr;
      onSelect(dateStr, endStr);
    } else {
      if (nights > 0) {
        const autoStart = addDays(dateStr, -nights);
        onSelect(autoStart, dateStr);
      } else {
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
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">‹</button>
        <span className="text-sm font-bold text-gray-800">{viewYear}년 {MONTH_NAMES[viewMonth]}</span>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {['일','월','화','수','목','금','토'].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPast = toDateStr(day) < new Date().toISOString().slice(0, 10);
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
      <div className="flex justify-end mt-3">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50">닫기</button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 선택 요약 배너
// ────────────────────────────────────────────
const SelectionSummary = ({ selectedRegion, selectedPeriod, startDate, endDate, selectedCompanion, selectedThemes }) => {
  const items = [
    selectedRegion && { label: '지역', value: selectedRegion },
    selectedPeriod && { label: '기간', value: selectedPeriod },
    startDate && { label: '날짜', value: `${startDate}${endDate && endDate !== startDate ? ` ~ ${endDate}` : ''}` },
    selectedCompanion && { label: '동행', value: selectedCompanion },
    selectedThemes.length > 0 && { label: '테마', value: selectedThemes.join(', ') },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
      <span className="text-xs font-semibold text-gray-400 mr-1">선택됨</span>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-[#0F9B73] text-xs font-semibold rounded-full">
          <span className="text-gray-400">{item.label}:</span> {item.value}
        </span>
      ))}
    </div>
  );
};

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
const AIPlanPage = () => {
  const navigate = useNavigate();

  const [step, setStep]                           = useState(0);
  const [selectedRegion, setSelectedRegion]       = useState('');
  const [selectedPeriod, setSelectedPeriod]       = useState('');
  const [selectedNights, setSelectedNights]       = useState(0);
  const [selectedCompanion, setSelectedCompanion] = useState('');
  const [selectedThemes, setSelectedThemes]       = useState([]);
  const [startDate, setStartDate]                 = useState('');
  const [endDate, setEndDate]                     = useState('');
  const [showStartCal, setShowStartCal]           = useState(false);
  const [showEndCal, setShowEndCal]               = useState(false);

  const handleCompanion = (val) => {
    setSelectedCompanion(prev => prev === val ? '' : val);
  };

  // 🚀 toggleTheme을 AIPlanThemeGrid의 onToggle prop으로 그대로 전달
  const toggleTheme = (theme) => {
    setSelectedThemes(prev => {
      if (prev.includes(theme)) return prev.filter(t => t !== theme);
      if (prev.length >= 3) {
        alert('테마는 최대 3개까지 선택 가능합니다.');
        return prev;
      }
      return [...prev, theme];
    });
  };

  const handlePeriodSelect = (opt) => {
    setSelectedPeriod(opt.value);
    setSelectedNights(opt.nights);
    setStartDate('');
    setEndDate('');
  };

  const handleSubmit = () => {
    navigate('/plan/result', {
      state: {
        region: selectedRegion,
        period: selectedPeriod,
        themes: selectedThemes,
        companion: selectedCompanion,
        startDate,
        endDate,
      }
    });
  };

  const handleSkip = () => {
    navigate('/plan/result', {
      state: {
        region: selectedRegion,
        period: selectedPeriod,
        themes: [],
        companion: selectedCompanion,
        startDate,
        endDate,
      }
    });
  };

  const isNextDisabled =
    (step === 0 && !selectedRegion) ||
    (step === 1 && (!selectedPeriod || !startDate));

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto py-8 px-4 max-w-[900px]">

        <Breadcrumb
          paths={[{ label: '홈', to: '/' }, { label: '내거리' }]}
          className="mb-6"
        />

        <AIPlanStepIndicator current={step} />

        <SelectionSummary
          selectedRegion={selectedRegion}
          selectedPeriod={selectedPeriod}
          startDate={startDate}
          endDate={endDate}
          selectedCompanion={selectedCompanion}
          selectedThemes={selectedThemes}
        />

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* STEP 0: 지역 선택 */}
          {step === 0 && (
            <AIPlanCityGrid
              selectedRegion={selectedRegion}
              onSelect={(city) => setSelectedRegion(city)}
            />
          )}

          {/* STEP 1: 여행 기간 */}
          {step === 1 && (
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
                  <button key={opt.value} onClick={() => handlePeriodSelect(opt)}
                    className={`p-5 rounded-2xl border-2 text-left transition ${
                      selectedPeriod === opt.value ? 'border-[#0F9B73] bg-green-50' : 'border-gray-200 hover:border-green-200'
                    }`}>
                    <p className="font-bold text-gray-800 mb-1">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* 날짜 선택 */}
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
                      <Calendar
                        mode="start"
                        nights={selectedNights}
                        onSelect={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
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
                      <Calendar
                        mode="end"
                        startDate={startDate}
                        nights={selectedNights}
                        onSelect={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                          setShowEndCal(false);
                        }}
                        onClose={() => setShowEndCal(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 동행 유형 + 여행 테마 */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <h2 className="text-lg font-bold text-gray-800">어떤 여행을 원하시나요?</h2>
                </div>
                <p className="text-sm text-gray-400">동행 유형을 선택하고 테마를 골라주세요</p>
              </div>

              {/* 동행 유형 - 단일 선택 */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  동행 유형
                  <span className="ml-2 text-xs text-gray-400 font-normal">1개 선택</span>
                </p>
                <div className="grid grid-cols-5 gap-3">
                  {COMPANION_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => handleCompanion(opt.value)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition ${
                        selectedCompanion === opt.value
                          ? 'border-[#0F9B73] bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
                      }`}>
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-xs font-medium text-gray-700">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 🚀 여행 테마 - 인라인 코드 제거하고 AIPlanThemeGrid 컴포넌트로 교체 */}
              <AIPlanThemeGrid
                selectedThemes={selectedThemes}
                onToggle={toggleTheme}
              />
            </div>
          )}

        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-0 transition"
          >
            ← 이전
          </button>

          {step === 2 ? (
            <div className="flex gap-3">
              <button onClick={handleSkip}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                건너뛰기
              </button>
              <button onClick={handleSubmit}
                disabled={!selectedRegion || selectedThemes.length === 0}
                className="px-6 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-semibold hover:bg-[#0d8a66] disabled:opacity-50 transition">
                AI 코스 추천받기 →
              </button>
            </div>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={isNextDisabled}
              className="px-6 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-semibold hover:bg-[#0d8a66] disabled:opacity-50 transition"
            >
              다음 →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIPlanPage;