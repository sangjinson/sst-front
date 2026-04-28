import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import '@assets/css/common.css';

// ────────────────────────────────────────────
// 경기도 시/군 목록
// ────────────────────────────────────────────
const CITIES_SOUTH = [
  '수원시', '성남시', '용인시', '안양시', '안산시', '과천시',
  '광명시', '광주시', '군포시', '부천시', '시흥시', '안성시',
  '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시',
  '여주시', '양평군',
];
const CITIES_NORTH = [
  '고양시', '구리시', '남양주시', '동두천시', '양주시',
  '의정부시', '파주시', '포천시', '연천군', '가평군',
];

// ────────────────────────────────────────────
// 여행 기간 옵션
// ────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { value: '당일여행', label: '당일여행', desc: '하루 안에 즐기는 가벼운 여행' },
  { value: '1박2일',   label: '1박 2일',  desc: '여유롭게 하루 숙박' },
  { value: '2박3일',   label: '2박 3일',  desc: '알찬 경기도 전통 일정' },
];

// ────────────────────────────────────────────
// 여행 테마 옵션
// ────────────────────────────────────────────
const THEME_OPTIONS = [
  { value: '테마파크', label: '테마파크', emoji: '🎡' },
  { value: '실내여행', label: '실내여행', emoji: '🏛' },
  { value: '문화·역사', label: '문화·역사', emoji: '🏯' },
  { value: '카페',     label: '카페',     emoji: '☕' },
  { value: '해수',     label: '해수',     emoji: '🌊' },
  { value: '캠핑',     label: '캠핑',     emoji: '⛺' },
  { value: '축제',     label: '축제',     emoji: '🎉' },
  { value: '식도락',   label: '식도락',   emoji: '🍽' },
];

// ────────────────────────────────────────────
// 캘린더 컴포넌트
// ────────────────────────────────────────────
const Calendar = ({ onSelect, onClose }) => {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate]     = useState(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const handleDayClick = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const d = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return d > startDate && d < endDate;
  };
  const isStart = (day) => startDate === `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const isEnd   = (day) => endDate   === `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const handleConfirm = () => {
    if (startDate) onSelect(startDate, endDate || startDate);
  };

  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 w-[300px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { if (viewMonth === 0) { setViewYear(y=>y-1); setViewMonth(11); } else setViewMonth(m=>m-1); }}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">‹</button>
        <span className="text-sm font-bold text-gray-800">{viewYear}년 {monthNames[viewMonth]}</span>
        <button onClick={() => { if (viewMonth === 11) { setViewYear(y=>y+1); setViewMonth(0); } else setViewMonth(m=>m+1); }}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-600">›</button>
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
        <button onClick={handleConfirm} disabled={!startDate}
          className="flex-1 py-2 bg-[#0F9B73] text-white rounded-xl text-xs font-medium hover:bg-[#0d8a66] disabled:opacity-40">확인</button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 스텝 인디케이터
// ────────────────────────────────────────────
const StepIndicator = ({ current }) => {
  const steps = ['지역 선택', '여행 기간', '여행 테마'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
              i < current  ? 'bg-[#0F9B73] text-white' :
              i === current ? 'bg-[#0F9B73] text-white ring-4 ring-green-100' :
              'bg-gray-200 text-gray-400'
            }`}>
              {i < current ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs mt-1 ${i === current ? 'text-[#0F9B73] font-semibold' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-20 mx-2 mb-4 transition ${i < current ? 'bg-[#0F9B73]' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
const AIPlanPage = () => {
  const navigate = useNavigate();

  const [step, setStep]                 = useState(0);
  const [activeTab, setActiveTab]       = useState('남부');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [startDate, setStartDate]       = useState('');
  const [endDate, setEndDate]           = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const cities = activeTab === '남부' ? CITIES_SOUTH : CITIES_NORTH;

  // 테마 토글
  const toggleTheme = (theme) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  // 달력 선택 완료
  const handleCalendarSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setShowCalendar(false);
  };

  // 결과 페이지로 이동
  const handleSubmit = () => {
    navigate('/plan/result', {
      state: { region: selectedRegion, period: selectedPeriod, themes: selectedThemes, startDate, endDate }
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto py-8 px-4 max-w-[900px]">

        {/* 브레드크럼 */}
        <Breadcrumb
          paths={[{ label: '홈', to: '/' }, { label: '내거리' }]}
          className="mb-6"
        />

        {/* 스텝 인디케이터 */}
        <StepIndicator current={step} />

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* ── STEP 0: 지역 선택 ── */}
          {step === 0 && (
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h2 className="fs-5 font-bold text-gray-800">어디로 떠나시겠어요?</h2>
                </div>
                <p className="text-sm text-gray-400">경기도 시·군을 선택해주세요</p>
              </div>

              {/* 남부/북부 탭 */}
              <div className="flex justify-center gap-2 mb-5">
                {['남부', '북부'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === tab ? 'bg-[#0F9B73] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    경기 {tab}
                  </button>
                ))}
              </div>

              {/* 도시 그리드 */}
              <div className="grid grid-cols-5 gap-2">
                {cities.map(city => (
                  <button key={city} onClick={() => setSelectedRegion(city)}
                    className={`py-2.5 px-2 rounded-xl text-sm font-medium transition ${
                      selectedRegion === city
                        ? 'bg-[#0F9B73] text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-[#0F9B73] border border-gray-200'
                    }`}>
                    {city}
                  </button>
                ))}
              </div>

              {/* 선택된 지역 표시 */}
              {selectedRegion && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">선택됨: </span>
                  <span className="text-sm font-bold text-[#0F9B73]">{selectedRegion}</span>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: 여행 기간 ── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <h2 className="fs-5 font-bold text-gray-800">여행 기간을 선택해주세요</h2>
                </div>
                <p className="text-sm text-gray-400">원하는 여행 일정 유형을 고르거나 직접 입력하세요</p>
              </div>

              {/* 기간 카드 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {PERIOD_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setSelectedPeriod(opt.value)}
                    className={`p-5 rounded-2xl border-2 text-left transition ${
                      selectedPeriod === opt.value
                        ? 'border-[#0F9B73] bg-green-50'
                        : 'border-gray-200 hover:border-green-200'
                    }`}>
                    <p className="font-bold text-gray-800 mb-1">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* 직접 날짜 선택 */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#0F9B73]" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-sm font-semibold text-gray-700">원하는 일정을 골라주세요</p>
                </div>

                <div className="flex items-center gap-3 relative">
                  <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm text-gray-600">
                    <span className="text-xs text-gray-400 block">시작일</span>
                    {startDate || '날짜 선택'}
                  </div>
                  <span className="text-gray-400">~</span>
                  <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm text-gray-600">
                    <span className="text-xs text-gray-400 block">종료일</span>
                    {endDate || '날짜 선택'}
                  </div>
                  <button
                    onClick={() => setShowCalendar(prev => !prev)}
                    className="w-10 h-10 flex items-center justify-center bg-[#0F9B73] text-white rounded-xl hover:bg-[#0d8a66] transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </button>
                  {showCalendar && (
                    <Calendar onSelect={handleCalendarSelect} onClose={() => setShowCalendar(false)} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: 여행 테마 ── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#0F9B73]" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <h2 className="fs-5 font-bold text-gray-800">어떤 여행을 원하시나요?</h2>
                </div>
                <p className="text-sm text-gray-400">테마는 여러 개 선택 가능합니다</p>
              </div>

              {/* 테마 그리드 */}
              <div className="grid grid-cols-4 gap-4">
                {THEME_OPTIONS.map(theme => (
                  <button key={theme.value} onClick={() => toggleTheme(theme.value)}
                    className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                      selectedThemes.includes(theme.value)
                        ? 'border-[#0F9B73] bg-green-50'
                        : 'border-gray-200 hover:border-green-200'
                    }`}>
                    <span className="text-3xl">{theme.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between mt-6">
          {/* 이전 */}
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-0 transition"
          >
            ← 이전
          </button>

          {/* Step 2: 전체보기 + AI 코스 추천받기 */}
          {step === 2 ? (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                전체보기
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedRegion}
                className="px-6 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-semibold hover:bg-[#0d8a66] disabled:opacity-50 transition"
              >
                AI 코스 추천받기 →
              </button>
            </div>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && !selectedRegion}
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