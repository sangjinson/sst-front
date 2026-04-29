import React from 'react';
import { AREA_SORT_OPTIONS } from '@components/modules/area/arealist/areaListUtils';

/**
 * AreaFilterBar - 볼거리/먹거리/잘거리/놀거리 공통 필터/정렬 바
 *
 * 사용 예시:
 * <AreaFilterBar
 *   categories={['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스']}
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
 *   selectedSort={sortOption}
 *   onSortChange={(sort) => { setSortOption(sort); setCurrentPage(1); }}
 *   totalCount={filtered.length}
 *   countLabel="숙소"
 * />
 */
const AreaFilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  totalCount,
  countLabel = '장소',
}) => {
  return (
    <div>
      {/* 카테고리 + 정렬 버튼 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">

        {/* 카테고리 버튼 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#E8956D] text-white border-[#E8956D]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#E8956D] hover:text-[#E8956D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 정렬 버튼 */}
        <div className="flex gap-2">
          {AREA_SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedSort === opt.value
                  ? 'bg-[#E8956D] text-white border-[#E8956D]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#E8956D] hover:text-[#E8956D]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 수 */}
      <p className="text-sm text-gray-500 mb-4">
        총 <span className="font-semibold text-gray-800">{totalCount}</span>개의 {countLabel}
      </p>
    </div>
  );
};

export default AreaFilterBar;