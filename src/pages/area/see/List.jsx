import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaFilterBar, AreaListCard, AreaPagination, sortData } from '@components/modules/area/arealist';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import EyesFollow from '@components/modules/anim/EyesFollow';


/**
 * 목록 페이지 컴포넌트
 * - 지역별 목록을 필터링, 정렬, 페이지네이션하여 표시
 * - 카테고리별 필터링 및 좋아요 기능 지원
 */
const pageLabel = "볼거리";

const List = ({rows}) => {
  // URL 파라미터에서 region 정보 가져오기
  const { region, type } = useParams();
  const navigate = useNavigate();
  // 카테고리 목록
  const CATEGORIES = rows?.['categories'] ?? [];
  const items = rows?.['items'] ?? [];


  // 선택된 카테고리 상태 (기본값: '전체')
  const [selectedCategory, setSelectedCategory] = useState('전체');
  // 정렬 옵션 상태 (기본값: 리뷰순)
  const [sortOption, setSortOption] = useState('reviews');
  // 현재 페이지 번호 상태 (기본값: 1)
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링 및 정렬된 데이터 계산 (useMemo로 최적화)
  const filtered = useMemo(() => {
    // 템플릿에서 내려준 현재 지역의 볼거리 데이터 사용
    const data = items.map((item) => ({
      ...item,
    }));

    let result = [...data];

    // '전체'가 아닌 경우 카테고리 필터링 적용
    if (selectedCategory !== '전체') {
      result = result.filter((item) => item.tag === selectedCategory);
    }

    // 정렬 옵션에 따라 데이터 정렬
    return sortData(result, sortOption);
  }, [items, selectedCategory, sortOption]);


  // 페이지당 표시할 아이템 개수
  const ITEMS_PER_PAGE = rows?.['perPage'] ?? 12;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  
  // 현재 페이지에 해당하는 데이터만 추출 (페이지네이션)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * 상세 페이지로 이동하는 함수
   * @param {string|number} id - 아이템 ID
   */
  const goToDetail = (id) => { navigate(`/${region}/${type}/view?id=${id}`); };

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <div className="py-2">

        {/* 필터 및 정렬 바 */}
        <AreaFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          // 카테고리 변경 시 첫 페이지로 리셋
          onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
          selectedSort={sortOption}
          // 정렬 변경 시 첫 페이지로 리셋
          onSortChange={(sort) => { setSortOption(sort); setCurrentPage(1); }}
          totalCount={filtered.length}
          countLabel={pageLabel}
        />

        <hr className="h-[2px] bg-gray-200 border-0 mb-6" />

        {/* 데이터가 있는 경우 그리드 형태로 카드 표시 */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {paginated.map((item) => (
              <AreaListCard
                key={item.id}
                item={{
                  ...item,
                  // 카테고리 인덱스 계산 (전체 제외)
                  categoryIndex: CATEGORIES.filter((c) => c !== '전체').indexOf(item.tag),
                }}
                categories={CATEGORIES}
                onClick={() => goToDetail(item.id)}
                renderHeart={() => (
                  <WishlistHeartButton item={item} itemType="see" region={region} />
                )}
              />
            ))}
          </div>
        ) : (
          // 데이터가 없는 경우 빈 상태 UI 표시
          <div className="flex flex-col items-center justify-center py-15 text-gray-400">
            <EyesFollow />
            <p className="fs-up-7 font-bold mt-7">죄송합니다.</p>
            <p className="fs-up-3 mt-5">해당 {pageLabel} 컨텐츠는 현재 준비 중입니다.</p>
          </div>
        )}

        <hr className="h-[2px] bg-gray-200 border-0 mt-6" />


        {/* 페이지네이션 컴포넌트 */}
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
