import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import {
  AIPlanStepIndicator,
  AIPlanCityGrid,
  AIPlanThemeGrid,
  AIPlanPeriodCard,
} from '@components/modules/aiplan';
import { useAIPlan } from '@pages/aiplan/AIPlanContext';
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
    <div className="mb-7 rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="shrink-0 text-sm font-bold text-gray-500">내 여행 조건</span>
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0F9B73]" />
            <span className="font-semibold text-gray-500">{item.label}</span>
            <span>{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
const AIPlanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);

  // Context에서 상태 가져오기
  const {
    selectedRegion, setSelectedRegion,
    selectedPeriod, setSelectedPeriod,
    selectedNights, setSelectedNights,
    selectedDays,   setSelectedDays,
    selectedThemes, setSelectedThemes,
    startDate,      setStartDate,
    endDate,        setEndDate,
    resetPlan
  } = useAIPlan();

  useEffect(() => {
    resetPlan();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    setSelectedDays(opt.days);
    setStartDate('');
    setEndDate('');
  };

  // FastAPI로 값 전송 후 결과 페이지로 이동
  const handleSubmit = () => {
    sessionStorage.removeItem('currentSchedule');
    navigate('/plan/result');
  };

  const isNextDisabled =
    (step === 0 && !selectedRegion) ||
    (step === 1 && (!selectedPeriod || !startDate));

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto max-w-[1040px] px-4 py-10 md:py-14">

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

        <div className="min-h-[500px] rounded-3xl border border-gray-100 bg-white px-6 py-12 shadow-sm md:px-12 md:py-16">

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

          {/* STEP 2: 여행 테마 */}
          {step === 2 && (
            <div>
              <AIPlanThemeGrid
                selectedThemes={selectedThemes}
                onToggle={toggleTheme}
              />
            </div>
          )}

        </div>

        {/* 하단 버튼 */}
        <div className="mt-9 flex items-center justify-between md:mt-10">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="rounded-2xl border border-gray-300 bg-white px-7 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98] disabled:opacity-0"
          >
            ← 이전
          </button>

          {step === 2 ? (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!selectedRegion || selectedThemes.length === 0}
                className="rounded-2xl bg-[#0F9B73] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0d8a66] hover:shadow-[0_10px_24px_rgba(15,155,115,0.22)] active:scale-[0.98] disabled:opacity-50"
              >
                AI 코스 추천받기 →
              </button>
            </div>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={isNextDisabled}
              className="rounded-2xl bg-[#0F9B73] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0d8a66] hover:shadow-[0_10px_24px_rgba(15,155,115,0.22)] active:scale-[0.98] disabled:opacity-50"
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