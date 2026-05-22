import { createContext, useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// ────────────────────────────────────────────
// Context 생성
// ────────────────────────────────────────────
const AIPlanContext = createContext(null);

// ────────────────────────────────────────────
// Provider
// ────────────────────────────────────────────
export const AIPlanProvider = () => {

  const [selectedRegion, setSelectedRegion] = useState(
    sessionStorage.getItem('plan_region') || ''
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    sessionStorage.getItem('plan_period') || ''
  );
  const [selectedNights, setSelectedNights] = useState(
    Number(sessionStorage.getItem('plan_nights')) || 0
  );
  const [selectedDays, setSelectedDays] = useState(
    Number(sessionStorage.getItem('plan_days')) || 1
  );
  const [selectedThemes, setSelectedThemes] = useState(
    JSON.parse(sessionStorage.getItem('plan_themes') || '[]')
  );
  const [startDate, setStartDate] = useState(
    sessionStorage.getItem('plan_startDate') || ''
  );
  const [endDate, setEndDate] = useState(
    sessionStorage.getItem('plan_endDate') || ''
  );

  // 값 변경 시 sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem('plan_region',    selectedRegion);
    sessionStorage.setItem('plan_period',    selectedPeriod);
    sessionStorage.setItem('plan_nights',    selectedNights);
    sessionStorage.setItem('plan_days',      selectedDays);
    sessionStorage.setItem('plan_themes',    JSON.stringify(selectedThemes));
    sessionStorage.setItem('plan_startDate', startDate);
    sessionStorage.setItem('plan_endDate',   endDate);
  }, [selectedRegion, selectedPeriod, selectedNights, selectedDays, selectedThemes, startDate, endDate]);

  // 초기화
  const resetPlan = () => {
    setSelectedRegion('');
    setSelectedPeriod('');
    setSelectedNights(0);
    setSelectedDays(1);
    setSelectedThemes([]);
    setStartDate('');
    setEndDate('');
    sessionStorage.removeItem('plan_region');
    sessionStorage.removeItem('plan_period');
    sessionStorage.removeItem('plan_nights');
    sessionStorage.removeItem('plan_days');
    sessionStorage.removeItem('plan_themes');
    sessionStorage.removeItem('plan_startDate');
    sessionStorage.removeItem('plan_endDate');
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