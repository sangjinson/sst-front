import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '@components/common/Breadcrumb';
import {
  AIResultScheduleList,
  AIResultSearchPanel,
  AIResultShareButton,
  generateSchedule,
  getSearchResults,
  getDetailPath,
} from '@components/modules/airesult';
import AIResultMapView from '@components/modules/airesult/AIResultMapView';
import { ClipButton } from '@components/modules/ActionButtons';
import { getFoodDataByRegion } from '@pages/area/food/foodData';
import { getSeeDataByRegion } from '@pages/area/see/seeData';
import { getSleepDataByRegion } from '@pages/area/sleep/sleepDummyData';
import '@assets/css/common.css';

const AIPlanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state          = location.state || {};
  const selectedRegion = state.region    || '수원시';
  const selectedPeriod = state.period    || '당일여행';
  const selectedThemes = state.themes    || [];
  const startDate      = state.startDate || '';
  const endDate        = state.endDate   || '';

  const dayCount = selectedPeriod === '당일여행' ? 1
                 : selectedPeriod === '1박2일'   ? 2
                 : 3;

  const [activeDay, setActiveDay]           = useState(0);
  const [schedule, setSchedule]             = useState(() => generateSchedule(selectedRegion, dayCount));
  const [dragIndex, setDragIndex]           = useState(null);
  const [showSearch, setShowSearch]         = useState(false);
  const [searchKeyword, setSearchKeyword]   = useState('');
  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchResults, setSearchResults]   = useState([]);
  const [selectedItem, setSelectedItem]     = useState(null);

  const dragOverIndex = useRef(null);

  // ── 삭제 ──
  const handleDelete = (idx) => {
    setSchedule(prev => {
      const next = prev.map(day => [...day]);
      next[activeDay].splice(idx, 1);
      return next;
    });
  };

  // ── 드래그 정렬 ──
  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver  = (e, idx) => {
    e.preventDefault();
    dragOverIndex.current = idx;
  };
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

  // ── 저장 ──
  const handleSave = async () => {
    const { value: tripName, isConfirmed } = await Swal.fire({
      title: '여행 이름을 지어주세요',
      input: 'text',
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
      const newTrip = {
        id: Date.now(),
        name: tripName.trim(),
        region: selectedRegion,
        period: selectedPeriod,
        startDate,
        endDate,
        themes: selectedThemes,
        schedule,
        createdAt: new Date().toISOString(),
      };
      savedTrips.push(newTrip);
      localStorage.setItem('savedTrips', JSON.stringify(savedTrips));

      await Swal.fire({
        icon: 'success',
        title: '저장되었습니다!',
        text: `"${tripName}" 일정이 마이페이지에 저장되었어요.`,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/user/mypage', { state: { tab: 'schedule' } });
    }
  };

  // ── 검색 ──
  useEffect(() => {
    if (!showSearch) return;
    setSearchResults(getSearchResults(selectedRegion, searchKeyword, searchCategory));
  }, [showSearch, searchKeyword, searchCategory, selectedRegion]);

  // ── 장소 추가 ──
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

  // ── 바로가기 ──
  const handleGoDetail = (item) => {
    navigate(getDetailPath(item, selectedRegion));
  };

  // ── 일차 변경 시 선택 아이템 초기화 ──
  const handleDayChange = (i) => {
    setActiveDay(i);
    setSelectedItem(null);
  };

  const currentDayItems = schedule[activeDay] || [];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="container mx-auto py-6 px-4 max-w-[1200px]">

        {/* 브레드크럼 */}
        <Breadcrumb
          paths={[
            { label: '홈', to: '/' },
            { label: '내거리', to: '/plan' },
            { label: '추천거리' },
          ]}
          className="mb-4"
        />

        {/* 상단 액션 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/plan')}
            className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
          >
            ← 다시 선택하기
          </button>
          <div className="flex items-center gap-2">
            <AIResultShareButton />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              인쇄/PDF 저장
            </button>
          </div>
        </div>

        {/* 선택 조건 태그 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-semibold text-gray-700">🗺 여행코스</span>
          <span className="px-3 py-1 bg-[#E8956D] text-white text-xs rounded-full font-medium">{selectedRegion}</span>
          <span className="px-3 py-1 bg-[#0F9B73] text-white text-xs rounded-full font-medium">{selectedPeriod}</span>
          {startDate && endDate && (
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">{startDate} ~ {endDate}</span>
          )}
          {selectedThemes.map(t => (
            <span key={t} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{t}</span>
          ))}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex">

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