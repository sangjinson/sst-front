import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Breadcrumb from '@components/common/Breadcrumb';
import { ClipButton } from '@components/modules/ActionButtons';
import { getFoodDataByRegion } from '@pages/area/food/foodData';
import { getSeeDataByRegion } from '@pages/area/see/seeData';
import { getSleepDataByRegion } from '@pages/area/sleep/sleepDummyData';
import '@assets/css/common.css';

// ────────────────────────────────────────────
// 더미 일정 생성 함수
// 볼거리 3개, 먹거리 4개, 잘거리 1개
// ────────────────────────────────────────────
const generateSchedule = (region, days) => {
  const regionKor = region || '수원시';
  const see  = getSeeDataByRegion(regionKor.replace('시','').replace('군','')).slice(0, 3);
  const food = getFoodDataByRegion(regionKor).slice(0, 4);
  const sleep = getSleepDataByRegion(regionKor).slice(0, 1);

  const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

  const allItems = [
    ...see.map((item, i) => ({
      id: `see-${item.id}`,
      time: times[i % times.length],
      name: item.title || item.name,
      desc: item.desc || item.description || '',
      image: item.image,
      type: 'see',
      region: regionKor,
    })),
    ...food.map((item, i) => ({
      id: `food-${item.id}`,
      time: times[(i + 2) % times.length],
      name: item.name,
      desc: item.description || '',
      image: item.image,
      type: 'food',
      region: regionKor,
    })),
    ...sleep.map((item) => ({
      id: `sleep-${item.id}`,
      time: '20:00',
      name: item.name,
      desc: item.description || '',
      image: item.image,
      type: 'sleep',
      region: regionKor,
    })),
  ];

  // 일차별로 나누기
  const perDay = Math.ceil(allItems.length / days);
  const schedule = [];
  for (let d = 0; d < days; d++) {
    schedule.push(allItems.slice(d * perDay, (d + 1) * perDay));
  }
  return schedule;
};

// 카테고리 타입 한글
const TYPE_LABEL = { see: '볼거리', food: '먹거리', sleep: '잘거리' };
const TYPE_COLOR = {
  see:   'bg-blue-100 text-blue-700',
  food:  'bg-orange-100 text-orange-700',
  sleep: 'bg-green-100 text-green-700',
};

// 검색용 카테고리
const SEARCH_CATEGORIES = ['전체', '볼거리', '먹거리', '잘거리'];

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
const AIPlanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 선택 조건
  const state = location.state || {};
  const selectedRegion = state.region    || '수원시';
  const selectedPeriod = state.period    || '당일여행';
  const selectedThemes = state.themes    || [];
  const startDate      = state.startDate || '';
  const endDate        = state.endDate   || '';

  // 기간에 따른 일수
  const dayCount = selectedPeriod === '당일여행' ? 1
                 : selectedPeriod === '1박2일'   ? 2
                 : 3;

  // 일정 상태
  const [activeDay, setActiveDay]       = useState(0);
  const [schedule, setSchedule]         = useState(() => generateSchedule(selectedRegion, dayCount));
  const [dragIndex, setDragIndex]       = useState(null);

  // 공유 팝업 상태
  const [isShareOpen, setIsShareOpen]   = useState(false);

  // 장소 추가 검색 상태
  const [showSearch, setShowSearch]     = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchResults, setSearchResults]   = useState([]);

  // 드래그 관련
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
  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: '저장하였습니다',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ── 공유 복사 ──
  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    Swal.fire({
      icon: 'success',
      title: '복사 완료!',
      text: '링크가 클립보드에 복사되었습니다.',
      timer: 1500,
      showConfirmButton: false,
    });
    setIsShareOpen(false);
  };

  // ── 검색 ──
  useEffect(() => {
    if (!showSearch) return;
    const kw = searchKeyword.trim().toLowerCase();

    const seeList  = getSeeDataByRegion(selectedRegion.replace('시','').replace('군',''))
      .map(i => ({ ...i, name: i.title || i.name, type: 'see',  id: `see-${i.id}` }));
    const foodList = getFoodDataByRegion(selectedRegion)
      .map(i => ({ ...i, type: 'food', id: `food-${i.id}` }));
    const sleepList = getSleepDataByRegion(selectedRegion)
      .map(i => ({ ...i, type: 'sleep', id: `sleep-${i.id}` }));

    let all = [...seeList, ...foodList, ...sleepList];

    // 카테고리 필터
    if (searchCategory === '볼거리') all = seeList;
    else if (searchCategory === '먹거리') all = foodList;
    else if (searchCategory === '잘거리') all = sleepList;

    // 키워드 필터
    if (kw) all = all.filter(i => (i.name||'').toLowerCase().includes(kw) || (i.description||i.desc||'').toLowerCase().includes(kw));

    setSearchResults(all.slice(0, 20));
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
    const typeMap = { see: 'see', food: 'food', sleep: 'sleep' };
    const type = typeMap[item.type];
    const rawId = String(item.id).replace(`${type}-`, '');
    const regionEn = selectedRegion.replace('시','').replace('군','').toLowerCase();
    navigate(`/${regionEn}/${type}/view?id=${rawId}`);
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
            {/* 공유 */}
            <div className="relative">
              <button
                onClick={() => setIsShareOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                공유
              </button>
              {isShareOpen && (
                <div className="absolute top-10 right-0 w-[280px] rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl z-10 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">페이지 링크</p>
                  <div className="flex gap-2">
                    <input
                      value={window.location.href}
                      readOnly
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F9B73] transition cursor-pointer"
                    >
                      복사
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* 인쇄/PDF */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
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
            <div className="w-[320px] shrink-0 border-r border-gray-100">

              {/* 일차 탭 */}
              <div className="flex border-b border-gray-100">
                {schedule.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`flex-1 py-3 text-sm font-medium transition ${
                      activeDay === i
                        ? 'text-[#0F9B73] border-b-2 border-[#0F9B73]'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {i + 1}일차
                  </button>
                ))}
              </div>

              {/* 일정 리스트 */}
              <div className="p-3 space-y-2 max-h-[520px] overflow-y-auto">
                {currentDayItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">일정이 없습니다</div>
                ) : (
                  currentDayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={handleDrop}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-grab ${
                        dragIndex === idx ? 'opacity-50 border-[#0F9B73]' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {/* 순서 번호 */}
                      <div className="w-6 h-6 rounded-full bg-[#0F9B73] text-white text-xs flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </div>

                      {/* 이미지 */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-xs text-gray-400">{item.time}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TYPE_COLOR[item.type]}`}>
                            {TYPE_LABEL[item.type]}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex flex-col gap-1 shrink-0">
                        {/* 바로가기 */}
                        <button
                          onClick={() => handleGoDetail(item)}
                          className="p-1 rounded text-gray-400 hover:text-[#0F9B73] hover:bg-gray-50 transition"
                          title="상세보기"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </button>
                        {/* 삭제 */}
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="삭제"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                        {/* 드래그 핸들 */}
                        <button className="p-1 rounded text-gray-300 cursor-grab" title="순서 변경">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
                            <line x1="3" y1="7" x2="21" y2="7"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="17" x2="21" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 저장 / 추가 버튼 */}
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-[#0F9B73] text-white text-sm font-medium rounded-xl hover:bg-[#0d8a66] transition"
                >
                  저장
                </button>
                <button
                  onClick={() => setShowSearch(prev => !prev)}
                  className="flex-1 py-2 border border-[#E8956D] text-[#E8956D] text-sm font-medium rounded-xl hover:bg-orange-50 transition"
                >
                  {showSearch ? '닫기' : '+ 추가'}
                </button>
              </div>
            </div>

            {/* 우측: 지도 영역 */}
            <div className="flex-1 relative">
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                <iframe
                  title="지도"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRegion)}&z=12&output=embed`}
                />
              </div>
              {/* 큰 지도로 보기 */}
              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent(selectedRegion)}`}
                target="_blank"
                rel="noreferrer"
                className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-gray-600 shadow hover:bg-white transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                큰 지도로 보기
              </a>
            </div>
          </div>

          {/* 장소 검색 패널 */}
          {showSearch && (
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">장소 검색</h3>
                <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* 검색창 */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-gray-400" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="장소명을 검색하세요"
                    className="flex-1 bg-transparent text-sm outline-none text-gray-700"
                  />
                </div>
              </div>

              {/* 카테고리 필터 */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {SEARCH_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSearchCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      searchCategory === cat
                        ? 'bg-[#E8956D] text-white border-[#E8956D]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#E8956D] hover:text-[#E8956D]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 검색 결과 */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">검색 결과가 없습니다</div>
                ) : (
                  searchResults.map((item) => {
                    const isAdded = currentDayItems.some(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                      >
                        {/* 찜 아이콘 */}
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />

                        {/* 이미지 */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* 정보 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400 truncate">{item.description || item.desc}</p>
                        </div>

                        {/* 추가 버튼 */}
                        <button
                          onClick={() => !isAdded && handleAddPlace(item)}
                          disabled={isAdded}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            isAdded
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#0F9B73] text-white hover:bg-[#0d8a66]'
                          }`}
                        >
                          {isAdded ? '추가됨' : '+ 선택'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlanResultPage;