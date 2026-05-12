import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

// ────────────────────────────────────────────
// Context 생성
// ────────────────────────────────────────────
const AIPlanContext = createContext(null);

// ────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────
export const AIPlanProvider = () => {

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedNights, setSelectedNights] = useState(0);
  const [selectedDays,   setSelectedDays]   = useState(1); // 실제 여행 일수
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [startDate,      setStartDate]      = useState('');
  const [endDate,        setEndDate]        = useState('');

  // 초기화
  const resetPlan = () => {
    setSelectedRegion('');
    setSelectedPeriod('');
    setSelectedNights(0);
    setSelectedDays(1);
    setSelectedThemes([]);
    setStartDate('');
    setEndDate('');
  };

  return (
    <AIPlanContext.Provider value={{
      selectedRegion, setSelectedRegion,
      selectedPeriod, setSelectedPeriod,
      selectedNights, setSelectedNights,
      selectedDays,   setSelectedDays,
      selectedThemes, setSelectedThemes,
      startDate,      setStartDate,
      endDate,        setEndDate,
      resetPlan,
    }}>
      <Outlet />
    </AIPlanContext.Provider>
  );
};

// ────────────────────────────────────────────
// 커스텀 훅
// ────────────────────────────────────────────
export const useAIPlan = () => {
  const ctx = useContext(AIPlanContext);
  if (!ctx) throw new Error('AIPlanProvider 외부에서 사용 불가');
  return ctx;
};