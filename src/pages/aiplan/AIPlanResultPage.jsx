import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  AIResultBreadcrumb,
  AIResultHeader,
  AIResultTags,
  AIResultScheduleList,
  AIResultSearchPanel,
  generateSchedule,
  getSearchResults,
  getDetailPath,
} from '@components/modules/airesult';
import AIResultMapView from '@components/modules/airesult/AIResultMapView';
import '@assets/css/common.css';

const AIPlanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state             = location.state || {};
  const selectedRegion    = state.region    || '수원시';
  const selectedPeriod    = state.period    || '당일여행';
  const selectedThemes    = state.themes    || [];
  const selectedCompanion = state.companion || '';
  const startDate         = state.startDate || '';
  const endDate           = state.endDate   || '';
  const existingId        = state.savedId   || null;

  const dayCount = selectedPeriod === '당일여행' ? 1
                 : selectedPeriod === '1박2일'   ? 2
                 : 3;

  const [activeDay, setActiveDay]           = useState(0);
  const [schedule, setSchedule]             = useState(() =>
    state.schedule || generateSchedule(selectedRegion, dayCount)
  );
  const [dragIndex, setDragIndex]           = useState(null);
  const [showSearch, setShowSearch]         = useState(false);
  const [searchKeyword, setSearchKeyword]   = useState('');
  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchResults, setSearchResults]   = useState([]);
  const [selectedItem, setSelectedItem]     = useState(null);

  const dragOverIndex = useRef(null);

  const handleDelete = (idx) => {
    setSchedule(prev => {
      const next = prev.map(day => [...day]);
      next[activeDay].splice(idx, 1);
      return next;
    });
  };

  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver  = (e, idx) => { e.preventDefault(); dragOverIndex.current = idx; };
  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex.current === null) return;
    setSchedule(prev => {
      const next = prev.map(day => [...day]);
      const items = next[activeDay];
      const dragged = items.splice(dragIndex, 1)[0];
      items.splice(dragOverIndex.current, 0, dragged);
      return next;
    });
    setDragIndex(null);
    dragOverIndex.current = null;
  };

  const handleSave = async () => {
    const { value: tripName, isConfirmed } = await Swal.fire({
      title: existingId ? '여행 이름을 수정할 수 있어요' : '여행 이름을 지어주세요',
      input: 'text',
      inputValue: state.savedName || '',
      inputPlaceholder: '예) 수원 가족 여행',
      inputAttributes: { maxlength: 14 },
      showCancelButton: true,
      confirmButtonText: '저장',
      cancelButtonText: '취소',
      confirmButtonColor: '#0F9B73',
      cancelButtonColor: '#9ca3af',
      inputValidator: (value) => {
        if (!value || value.trim().length < 3) return '최소 3자 이상 입력해주세요.';
        if (value.trim().length >= 15) return '15자 미만으로 입력해주세요.';
      },
    });

    if (isConfirmed && tripName) {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');

      if (existingId) {
        const updated = savedTrips.map(t =>
          t.id === existingId
            ? { ...t, name: tripName.trim(), schedule, updatedAt: new Date().toISOString() }
            : t
        );
        localStorage.setItem('savedTrips', JSON.stringify(updated));
      } else {
        const newTrip = {
          id: Date.now(),
          name: tripName.trim(),
          region: selectedRegion,
          period: selectedPeriod,
          startDate,
          endDate,
          companion: selectedCompanion,
          themes: selectedThemes,
          schedule,
          createdAt: new Date().toISOString(),
        };
        savedTrips.push(newTrip);
        localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
      }

      await Swal.fire({
        icon: 'success',
        title: existingId ? '수정되었습니다!' : '저장되었습니다!',
        text: `"${tripName}" 일정이 마이페이지에 ${existingId ? '수정' : '저장'}되었어요.`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/user/mypage', { state: { tab: 'schedule' } });
    }
  };

  useEffect(() => {
    if (!showSearch) return;
    setSearchResults(getSearchResults(selectedRegion, searchKeyword, searchCategory));
  }, [showSearch, searchKeyword, searchCategory, selectedRegion]);

  const handleAddPlace = (item) => {
    const newItem = {
      id: item.id,
      time: '10:00',
      name: item.name,
      desc: item.description || item.desc || '',
      image: item.image,
      type: item.type,
      region: selectedRegion,
    };
    setSchedule(prev => {
      const next = prev.map(day => [...day]);
      next[activeDay].push(newItem);
      return next;
    });
    Swal.fire({ icon: 'success', title: '추가되었습니다', timer: 1000, showConfirmButton: false });
  };

  const handleGoDetail  = (item) => navigate(getDetailPath(item, selectedRegion));
  const handleDayChange = (i) => { setActiveDay(i); setSelectedItem(null); };
  const currentDayItems = schedule[activeDay] || [];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto py-6 px-4 max-w-[1200px]">

        {/* ✅ 브레드크럼 */}
        <AIResultBreadcrumb existingId={existingId} />

        {/* ✅ 상단 헤더 */}
        <AIResultHeader existingId={existingId} onSave={handleSave} />

        {/* ✅ 선택 조건 태그 */}
        <AIResultTags
          selectedRegion={selectedRegion}
          selectedPeriod={selectedPeriod}
          startDate={startDate}
          endDate={endDate}
          selectedThemes={selectedThemes}
          selectedCompanion={selectedCompanion}
          existingId={existingId}
          savedName={state.savedName}
        />

        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* 좌측: 일정 목록 */}
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

            {/* 우측: 지도 */}
            <AIResultMapView
              selectedRegion={selectedRegion}
              schedule={schedule}
              activeDay={activeDay}
              selectedItem={selectedItem}
              onSelectItem={(item) => setSelectedItem(item)}
            />

          </div>

          {/* 장소 검색 패널 */}
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
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default AIPlanResultPage;