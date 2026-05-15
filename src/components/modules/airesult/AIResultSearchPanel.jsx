import React from 'react';
import { SEARCH_CATEGORIES, CAT_KOR_COLOR_MAP, TYPE_LABEL, CAT_LABEL_MAP, TYPE_COLOR } from './aiResultUtils';

const AIResultSearchPanel = ({
  searchKeyword,
  searchCategory,
  searchResults,
  currentDayItems,
  onKeywordChange,
  onCategoryChange,
  onAddPlace,
  onClose,
}) => {
  return (
    <div className="border-t border-gray-100 p-4 h-[400px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800">장소 검색</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition ${
              searchCategory === cat
                ? 'bg-[#0F9B73] text-white border-[#0F9B73]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 결과 */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto">
        {searchResults.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">검색 결과가 없습니다</div>
        ) : (
          searchResults.map((item) => {
            const isAdded = currentDayItems.some(i =>
              i.placeId === item.id ||
              i.placeId === item.placeId ||
              String(i.placeId) === String(item.id)
            );
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-6 py-4 rounded-xl border border-gray-100 hover:border-gray-200 transition"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="text-gray-300 hover:text-red-400 transition shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      TYPE_COLOR[item.type] ?? 'bg-green-100 text-[#0F9B73]'
                    }`}>
                      {TYPE_LABEL[item.type] ?? item.type}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{item.description || item.desc}</p>
                </div>
                <button
                  onClick={() => !isAdded && onAddPlace({
                    ...item,
                    category: CAT_LABEL_MAP[item.category] ?? item.category,
                  })}
                  disabled={isAdded}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
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
  );
};

export default AIResultSearchPanel;