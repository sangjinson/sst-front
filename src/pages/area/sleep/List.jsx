import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSleepDataByRegion } from './sleepDummyData';
import { toKorRegion } from '@utils/regionMap';
import { AreaListCard, AreaFilterBar, AreaPagination, sortData } from '@components/modules/area/arealist';
import { WishlistHeartButton } from '@components/modules/ActionButtons';

// 페이지당 카드 수
const ITEMS_PER_PAGE = 6;

// 카테고리 목록
const CATEGORIES = ['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스'];

const List = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const regionKor = toKorRegion(region);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption]             = useState('reviews');
  const [currentPage, setCurrentPage]           = useState(1);

  // 필터 & 정렬 (useMemo)
  const filtered = useMemo(() => {
    const data = getSleepDataByRegion(regionKor);
    let result = [...data];

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 공통 sortData 함수 사용 (리뷰순 / 평점순)
    return sortData(result, sortOption);
  }, [regionKor, selectedCategory, sortOption]);

  // 페이지네이션
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 상세 페이지 이동
  const goToDetail = (id) => {
    navigate(`/${region}/sleep/view?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <div className="py-2">

        {/* 공통 필터/정렬 바 */}
        <AreaFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
          selectedSort={sortOption}
          onSortChange={(sort) => { setSortOption(sort); setCurrentPage(1); }}
          totalCount={filtered.length}
          countLabel="숙소"
        />

        {/* 카드 그리드 */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((item) => (
              <AreaListCard
                key={item.id}
                item={{
                  ...item,
                  categoryIndex: CATEGORIES.filter(c => c !== '전체').indexOf(item.category),
                }}
                onClick={() => goToDetail(item.id)}
                renderHeart={() => (
                  <WishlistHeartButton item={item} itemType="sleep" region={region} />
                )}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🏨</span>
            <p className="text-lg font-medium">해당 카테고리의 숙소가 없습니다</p>
            <p className="text-sm mt-1">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        {/* 공통 페이지네이션 - 페이지가 1개여도 표시 */}
        <AreaPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </div>
    </div>
  );
};

export default List;