import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaFilterBar, AreaListCard, AreaPagination, sortData } from '@components/modules/area/arealist';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import EyesFollow from '@components/modules/anim/EyesFollow';

const pageLabel = "볼거리";

const List = ({ rows, wishedPlcNos = [] }) => {
  const { region, type } = useParams();
  const navigate = useNavigate();

  const CATEGORIES = rows?.['categories'] ?? [];
  const items = rows?.['items'] ?? [];

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption] = useState('reviews');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const data = items.map((item) => ({ ...item }));
    let result = [...data];
    if (selectedCategory !== '전체') {
      result = result.filter((item) => item.tag === selectedCategory);
    }
    return sortData(result, sortOption);
  }, [items, selectedCategory, sortOption]);

  const ITEMS_PER_PAGE = rows?.['perPage'] ?? 12;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToDetail = (id) => { navigate(`/${region}/${type}/view?id=${id}`); };

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <div className="py-2">
        <AreaFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
          selectedSort={sortOption}
          onSortChange={(sort) => { setSortOption(sort); setCurrentPage(1); }}
          totalCount={filtered.length}
          countLabel={pageLabel}
        />
        <hr className="h-[2px] bg-gray-200 border-0 mb-6" />
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {paginated.map((item) => (
              <AreaListCard
                key={item.id}
                item={{
                  ...item,
                  categoryIndex: CATEGORIES.filter((c) => c !== '전체').indexOf(item.tag),
                }}
                categories={CATEGORIES}
                onClick={() => goToDetail(item.id)}
                renderHeart={() => (
                  <WishlistHeartButton
                    item={item}
                    itemType="see"
                    region={region}
                    initialWished={wishedPlcNos.includes(item.id)}
                  />
                )}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-15 text-gray-400">
            <EyesFollow />
            <p className="fs-up-7 font-bold mt-7">죄송합니다.</p>
            <p className="fs-up-3 mt-5">해당 {pageLabel} 컨텐츠는 현재 준비 중입니다.</p>
          </div>
        )}
        <hr className="h-[2px] bg-gray-200 border-0 mt-6" />
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