import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import {
  AIPlanStepIndicator,
  AIPlanCityGrid,
  AIPlanPeriodCard,
  AIPlanThemeGrid,
} from '@components/modules/aiplan';
import '@assets/css/common.css';

const AIPlanPage = () => {
  const navigate = useNavigate();

  const [step, setStep]                     = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedNights, setSelectedNights] = useState(0);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [startDate, setStartDate]           = useState('');
  const [endDate, setEndDate]               = useState('');

  const toggleTheme = (theme) => {
    setSelectedThemes(prev => {
      if (prev.includes(theme)) return prev.filter(t => t !== theme);
      if (prev.length >= 2) {
        alert('테마는 최대 2개까지 선택 가능합니다.');
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

  const handleSkip = () => {
    navigate('/plan/result', {
      state: {
        region: selectedRegion,
        period: selectedPeriod,
        themes: [],
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

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {step === 0 && (
            <AIPlanCityGrid
              selectedRegion={selectedRegion}
              onSelect={(city) => setSelectedRegion(city)}
            />
          )}

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

          {step === 2 && (
            <AIPlanThemeGrid
              selectedThemes={selectedThemes}
              onToggle={toggleTheme}
            />
          )}

        </div>

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
              <button
                onClick={handleSkip}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                건너뛰기
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedRegion || selectedThemes.length === 0}
                className="px-6 py-2.5 bg-[#0F9B73] text-white rounded-xl text-sm font-semibold hover:bg-[#0d8a66] disabled:opacity-50 transition"
              >
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