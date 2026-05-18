import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  AIResultBreadcrumb,
  AIResultHeader,
  AIResultTags,
  AIResultScheduleList,
  AIResultSearchPanel,
  getSearchResults,
  getDetailPath,
} from '@components/modules/airesult';
import AIResultMapView from '@components/modules/airesult/AIResultMapView';
import AIPlanLoading from '@components/modules/aiplan/AIPlanLoading';
import { useAIPlan } from '@pages/aiplan/AIPlanContext';
import '@assets/css/common.css';
import api from '@api/axios';
import { CAT_LABEL_MAP, TYPE_LABEL } from '@components/modules/airesult/aiResultUtils';

const AIPlanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const aisNo    = location.state?.aisNo;

  const {
    selectedRegion,
    selectedPeriod,
    selectedDays,
    selectedThemes,
    startDate,
    endDate,
    resetPlan,
  } = useAIPlan();

  const [activeDay, setActiveDay]             = useState(0);
  const [schedule, setSchedule]               = useState([]);
  const [dragIndex, setDragIndex]             = useState(null);
  const [showSearch, setShowSearch]           = useState(false);
  const [searchKeyword, setSearchKeyword]     = useState('');
  const [searchCategory, setSearchCategory]   = useState('전체');
  const [searchResults, setSearchResults]     = useState([]);
  const [selectedItem, setSelectedItem]       = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(() => typeof window !== 'undefined' && !sessionStorage.getItem('currentSchedule'));
  const [loadingFinishing, setLoadingFinishing] = useState(false);

  const [savedRegion, setSavedRegion]         = useState(null);
  const [savedThemes, setSavedThemes]         = useState([]);
  const [savedStartDate, setSavedStartDate]   = useState(null);
  const [savedEndDate, setSavedEndDate]       = useState(null);
  const [savedTotalDays, setSavedTotalDays]   = useState(null);

  const dragOverIndex = useRef(null);
  const loadingFinishTimer = useRef(null);

  const currentRegion    = savedRegion    || selectedRegion;
  const currentThemes    = savedThemes.length > 0 ? savedThemes : selectedThemes;
  const currentStartDate = savedStartDate || startDate;
  const currentEndDate   = savedEndDate   || endDate;
  const currentTotalDays = savedTotalDays || selectedDays;

  const handleRestart = () => {
    sessionStorage.removeItem('currentSchedule');
    sessionStorage.removeItem('scheduleMetaData');
    resetPlan();
    navigate('/plan');
  };

  const finishScheduleLoading = () => {
    setLoadingFinishing(true);
    window.clearTimeout(loadingFinishTimer.current);

    loadingFinishTimer.current = window.setTimeout(() => {
      setScheduleLoading(false);
      setLoadingFinishing(false);
    }, 1600);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(loadingFinishTimer.current);
    };
  }, []);


  useEffect(() => {
    if (schedule.length > 0) {
      sessionStorage.setItem('currentSchedule', JSON.stringify(schedule));
      if (schedule[activeDay]?.plans?.length > 0) {
        setSelectedItem(schedule[activeDay].plans[0]);
      }
    }
  }, [schedule]);

  useEffect(() => {
    const saved = sessionStorage.getItem('currentSchedule');

    if (aisNo && !saved) {
      const fetchSavedSchedule = async () => {
        setScheduleLoading(true);
        setLoadingFinishing(false);
        window.clearTimeout(loadingFinishTimer.current);
        try {
          const res  = await api.get('/ai/schedule/detail', { params: { aisNo } });
          const data = res.data;
          setSchedule(data.schedule ?? []);
          setSavedRegion(data.rgnName);
          setSavedThemes(data.themes ?? []);
          setSavedStartDate(data.aisBeginDate);
          setSavedEndDate(data.aisEndDate);
          setSavedTotalDays(data.aisTotDays);
          sessionStorage.setItem('currentSchedule', JSON.stringify(data.schedule ?? []));
          sessionStorage.setItem('scheduleMetaData', JSON.stringify({
            rgnName     : data.rgnName,
            themes      : data.themes,
            aisBeginDate: data.aisBeginDate,
            aisEndDate  : data.aisEndDate,
            aisTotDays  : data.aisTotDays,
          }));
        } catch (err) {
          console.error('일정 불러오기 실패:', err);
          setSchedule([]);
        } finally {
          finishScheduleLoading();
        }
      };
      fetchSavedSchedule();
      return;
    }

    if (saved) {
      setSchedule(JSON.parse(saved));
      const meta = sessionStorage.getItem('scheduleMetaData');
      if (meta) {
        const m = JSON.parse(meta);
        setSavedRegion(m.rgnName);
        setSavedThemes(m.themes ?? []);
        setSavedStartDate(m.aisBeginDate);
        setSavedEndDate(m.aisEndDate);
        setSavedTotalDays(m.aisTotDays);
      }
      return;
    }

    if (!selectedRegion) {
      navigate('/plan');
      return;
    }

    const fetchSchedule = async () => {
      setScheduleLoading(true);
      setLoadingFinishing(false);
      window.clearTimeout(loadingFinishTimer.current);
      try {
        const params = new URLSearchParams({
          region    : selectedRegion,
          days      : selectedDays,
          start_date: startDate,
          end_date  : endDate,
          themes    : selectedThemes.join(','),
        });

        const res  = await fetch(`${import.meta.env.VITE_FASTAPI_URL}/travel/plan?${params}`);
        const json = await res.json();

        if (json.success) {
          setSchedule(json.data.schedule);
        } else {
          console.error('일정 생성 실패:', json.message);
          setSchedule([]);
        }
      } catch (err) {
        console.error('FastAPI 호출 실패:', err);
        setSchedule([]);
      } finally {
        finishScheduleLoading();
      }
    };

    fetchSchedule();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      sessionStorage.setItem('selectedRegion', selectedRegion);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (!showSearch) return;

    const fetchSearch = async () => {
      try {
        const results = await getSearchResults(currentRegion, searchKeyword, searchCategory);
        setSearchResults(results);
      } catch (err) {
        console.error('장소 검색 실패:', err);
        setSearchResults([]);
      }
    };

    fetchSearch();
  }, [showSearch, searchKeyword, searchCategory, currentRegion]);

  const handleDelete = (idx) => {
    setSchedule(prev => {
      const next = prev.map(day => ({ ...day, plans: [...day.plans] }));
      next[activeDay].plans.splice(idx, 1);
      return next;
    });
  };

  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver  = (e, idx) => { e.preventDefault(); dragOverIndex.current = idx; };
  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    setSchedule(prev => {
      const next  = prev.map(day => ({ ...day, plans: [...day.plans] }));
      const items = next[activeDay].plans;
      const dragged = items.splice(dragIndex, 1)[0];
      items.splice(dragOverIndex.current, 0, dragged);
      return next;
    });
    setDragIndex(null);
    dragOverIndex.current = null;
  };

  const handleSave = async () => {
    const { value: tripName, isConfirmed } = await Swal.fire({
      title: aisNo ? '일정 이름을 수정하세요' : '여행 이름을 지어주세요',
      input: 'text',
      inputPlaceholder: '예) 수원 가족 여행',
      inputAttributes: { maxlength: 14 },
      showCancelButton: true,
      confirmButtonText: aisNo ? '수정' : '저장',
      cancelButtonText: '취소',
      confirmButtonColor: '#0F9B73',
      cancelButtonColor: '#9ca3af',
      inputValidator: (value) => {
        if (!value || value.trim().length < 3) return '최소 3자 이상 입력해주세요.';
        if (value.trim().length >= 15) return '15자 미만으로 입력해주세요.';
      },
    });

    if (isConfirmed && tripName) {
      try {
        const requestBody = {
        scheduleName: tripName.trim(),
        startDate   : (currentStartDate && currentStartDate !== '') ? currentStartDate : null,
        endDate     : (currentEndDate && currentEndDate !== '') ? currentEndDate : null,
        totalDays   : currentTotalDays ?? schedule.length,
        rgnName     : currentRegion    ?? '',
        themes      : currentThemes    ?? [],
        schedule,
      };

        if (aisNo) {
          await api.put('/ai/schedule/update', requestBody, { params: { aisNo } });
        } else {
          await api.post('/ai/schedule/save', requestBody);
        }

        sessionStorage.removeItem('currentSchedule');
        sessionStorage.removeItem('scheduleMetaData');

        // ✅ navigate 제거 — 현재 화면 유지
        await Swal.fire({
          icon : 'success',
          title: aisNo ? '수정되었습니다!' : '저장되었습니다!',
          text : `"${tripName}" 일정이 마이페이지에 저장되었어요.`,
          timer: 1500,
          showConfirmButton: false,
        });

      } catch (err) {
        console.error('저장 실패:', err);
        Swal.fire({ icon: 'error', title: '저장 실패', text: '다시 시도해주세요.' });
      }
    }
  };

  const handleAddPlace = (item) => {
    const rawId   = String(item.id || '');
    const placeId = rawId.includes('-')
      ? Number(rawId.split('-')[1])
      : Number(rawId);

    const currentPlans = schedule[activeDay]?.plans || [];
    const isDuplicate  = currentPlans.some(p => p.placeId === placeId);
    if (isDuplicate) {
      Swal.fire({ icon: 'warning', title: '이미 추가된 장소입니다.', timer: 1000, showConfirmButton: false });
      return;
    }

    const newItem = {
      placeId  : placeId,
      placeName: item.name,
      category : CAT_LABEL_MAP[item.category] ?? TYPE_LABEL[item.type] ?? item.category,
      overview : item.description || item.desc || '',
      imgUrl   : item.image || '',
      lat      : item.lat ? String(item.lat) : null,
      lng      : item.lng ? String(item.lng) : null,
    };

    setSchedule(prev => {
      const next = prev.map(day => ({ ...day, plans: [...day.plans] }));
      next[activeDay].plans.push(newItem);
      sessionStorage.setItem('currentSchedule', JSON.stringify(next));
      return next;
    });
    Swal.fire({ icon: 'success', title: '추가되었습니다', timer: 1000, showConfirmButton: false });
  };

  const handleGoDetail  = (item) => navigate(getDetailPath(item, currentRegion));
  const currentDayItems = schedule[activeDay]?.plans || [];

  const handleDayChange = (i) => {
    setActiveDay(i);
    if (schedule[i]?.plans?.length > 0) {
      setSelectedItem(schedule[i].plans[0]);
    } else {
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto py-6 px-4 max-w-[1200px]">

        <AIResultBreadcrumb />

        <AIResultHeader onSave={handleSave} onRestart={handleRestart} />

        <AIResultTags
          selectedRegion={currentRegion}
          selectedPeriod={selectedPeriod}
          startDate={currentStartDate}
          endDate={currentEndDate}
          selectedThemes={currentThemes}
          onDateChange={async (start, end) => {
          setSavedStartDate(start);
          setSavedEndDate(end);

          // aisNo 있으면 DB도 업데이트
            if (aisNo) {
                try {
                    await api.put('/ai/schedule/date', null, {
                        params: { aisNo, startDate: start, endDate: end }
                    });
                } catch (err) {
                    console.error('날짜 업데이트 실패:', err);
                }
            }
        }}
        />

        {scheduleLoading ? (
          <AIPlanLoading isFinishing={loadingFinishing} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">

              <AIResultScheduleList
                schedule={schedule}
                activeDay={activeDay}
                dragIndex={dragIndex}
                dragOverIndex={dragOverIndex}
                onDayChange={handleDayChange}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDelete={handleDelete}
                onGoDetail={handleGoDetail}
                onSave={handleSave}
                onToggleSearch={() => setShowSearch(prev => !prev)}
                showSearch={showSearch}
                onItemClick={(item) => setSelectedItem(item)}
                selectedItem={selectedItem}
              />

              <AIResultMapView
                selectedRegion={currentRegion}
                schedule={schedule}
                activeDay={activeDay}
                selectedItem={selectedItem}
                onSelectItem={(item) => setSelectedItem(item)}
              />

            </div>

            {showSearch && (
              <AIResultSearchPanel
                searchKeyword={searchKeyword}
                searchCategory={searchCategory}
                searchResults={searchResults}
                currentDayItems={currentDayItems}
                onKeywordChange={(kw) => setSearchKeyword(kw)}
                onCategoryChange={(cat) => setSearchCategory(cat)}
                onAddPlace={handleAddPlace}
                onClose={() => setShowSearch(false)}
                selectedRegion={currentRegion}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AIPlanResultPage;  