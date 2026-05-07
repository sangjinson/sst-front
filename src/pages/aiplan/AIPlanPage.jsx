import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import {
  AIPlanStepIndicator,
  AIPlanCityGrid,
  AIPlanThemeGrid,
  AIPlanPeriodCard,
} from '@components/modules/aiplan';
import '@assets/css/common.css';

// ────────────────────────────────────────────
// 선택 요약 배너
// ────────────────────────────────────────────
const SelectionSummary = ({ selectedRegion, selectedPeriod, startDate, endDate, selectedThemes }) => {
  const items = [
    selectedRegion && { label: '지역', value: selectedRegion },
    selectedPeriod && { label: '기간', value: selectedPeriod },
    startDate && { label: '날짜', value: `${startDate}${endDate && endDate !== startDate ? ` ~ ${endDate}` : ''}` },
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
  const [selectedThemes, setSelectedThemes]       = useState([]);
  const [startDate, setStartDate]                 = useState('');
  const [endDate, setEndDate]                     = useState('');

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
            <AIPlanPeriodCard
              selectedPeriod={selectedPeriod}
              selectedNights={selectedNights}
              startDate={startDate}
              endDate={endDate}
              onPeriodSelect={handlePeriodSelect}
              onDateSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
            />
          )}

          {/* STEP 2: 동행 유형 + 여행 테마 */}
          {step === 2 && (
            <div>

              {/* 🚀 여행 테마 - AIPlanThemeGrid 컴포넌트 */}
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