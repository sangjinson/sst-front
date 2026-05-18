import React from 'react';
import { SEARCH_CATEGORIES, CAT_KOR_COLOR_MAP, TYPE_LABEL, CAT_LABEL_MAP, TYPE_COLOR } from './aiResultUtils';
import { WishlistHeartButton } from '@components/modules/ActionButtons';

const AIResultSearchPanel = ({
  searchKeyword,
  searchCategory,
  searchResults,
  currentDayItems,
  onKeywordChange,
  onCategoryChange,
  onAddPlace,
  onClose,
  selectedRegion,
  showSearch, // 모바일 하단 시트 애니메이션용
}) => {

  // 검색 결과 내부 공통 컨텐츠
  const SearchContent = () => (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800">장소 검색</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 검색창 */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-gray-400" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onKeywordChange(e.target.value)}
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
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition focus:outline-none ${
              searchCategory === cat
                ? 'bg-[#4CAF8C] text-white border-[#4CAF8C] hover:bg-[#0d8a66]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#0d8a66] hover:text-[#0d8a66]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 결과 */}
      <div className="space-y-3 overflow-y-auto max-h-[280px] md:max-h-[280px]">
        {searchResults.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">검색 결과가 없습니다</div>
        ) : (
          searchResults.map((item) => {
            // id에서 숫자만 추출 (예: "see-123" → 123)
            const rawId   = String(item.id || '');
            const placeId = rawId.includes('-') ? Number(rawId.split('-')[1]) : Number(rawId);
            const isAdded = currentDayItems.some(i => Number(i.placeId) === placeId);

            return (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2 md:gap-4 md:px-4 py-4 rounded-xl border border-gray-100 hover:border-gray-200 transition h-28"
              >
                {/* 하트 버튼 */}
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <WishlistHeartButton
                    item={{
                      id      : placeId,
                      name    : item.name,
                      image   : item.image,
                      category: item.category || item.tag,
                      address : item.address || item.location || '',
                    }}
                    itemType={item.type ?? 'see'}
                    region={selectedRegion}
                  />
                </div>

                {/* 이미지 */}
                <div className="w-22 h-22 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* 텍스트 영역 - 이미지 높이에 맞게 제한 */}
                <div className="flex-1 min-w-0 h-22 overflow-hidden flex flex-col justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] px-1.5 rounded-full ${
                      TYPE_COLOR[item.type] ?? 'bg-green-100 text-[#0F9B73]'
                    }`}>
                      {TYPE_LABEL[item.type] ?? item.type}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500 truncate">{item.address || item.location}</p>
                  <p className="text-sm text-gray-400 truncate">{item.description || item.desc}</p>
                </div>

                {/* 선택 버튼 */}
                <button
                  onClick={() => !isAdded && onAddPlace({
                    ...item,
                    category: CAT_LABEL_MAP[item.category] ?? item.category,
                  })}
                  disabled={isAdded}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none ${
                    isAdded
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#4CAF8C] text-white hover:bg-[#0d8a66]'
                  }`}
                >
                  {isAdded ? '추가됨' : '+ 선택'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      {/* PC 전용 - 기존 하단 패널 */}
      <div className="hidden md:block border-t border-gray-100 p-4 h-[400px]">
        <SearchContent />
      </div>

      {/* 모바일 전용 - 하단 시트 */}
      <div className={`
        fixed inset-0 z-50 md:hidden
        transition-opacity duration-300
        ${showSearch ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* 배경 딤처리 - 클릭시 닫힘 */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* 시트 본체 - 아래에서 위로 슬라이드 */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl
            transition-transform duration-300 ease-out
            ${showSearch ? 'translate-y-0' : 'translate-y-full'}
          `}
          style={{ maxHeight: '70vh' }}
        >
          {/* 핸들 바 */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* 내용 영역 */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 32px)' }}>
            <SearchContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIResultSearchPanel;