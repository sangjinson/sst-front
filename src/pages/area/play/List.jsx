// src/pages/area/food/List.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getFoodDataByRegion } from './dummydata';
import { toKorRegion } from '@utils/regionMap';
import { AreaListCard, AreaFilterBar, AreaPagination, sortData } from '@components/modules/area/arealist';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import { CATEGORIES } from '../DataSet';

const ITEMS_PER_PAGE = 9;

export default function PlayList() {
  const navigate = useNavigate();
  const { selectedRegion, selectedType } = useOutletContext();
  const regionKor = toKorRegion(selectedRegion);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption]             = useState('reviews');
  const [currentPage, setCurrentPage]           = useState(1);

  const filtered = useMemo(() => {
    const data = getFoodDataByRegion(regionKor);
    let result = [...data];
    if (selectedCategory !== '전체') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    return sortData(result, sortOption);
  }, [regionKor, selectedCategory, sortOption]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen">
      <div className="py-2">

        <AreaFilterBar
          categories={CATEGORIES['play']}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
          selectedSort={sortOption}
          onSortChange={(sort) => { setSortOption(sort); setCurrentPage(1); }}
          totalCount={filtered.length}
          countLabel="먹거리"
        />

        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((item) => (
              <AreaListCard
                key={item.id}
                item={{
                  ...item,
                  categoryIndex: CATEGORIES['play'].filter(c => c !== '전체').indexOf(item.category),
                }}
                onClick={() => navigate(`/${selectedRegion}/${selectedType}/view?id=${item.id}`)}
                renderHeart={() => (
                  <WishlistHeartButton item={item} itemType="food" region={regionKor} />
                )}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-lg font-medium">해당 카테고리의 놀거리가 없습니다</p>
            <p className="text-sm mt-1">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        <AreaPagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(page) => setCurrentPage(page)}
        />

      </div>
    </div>
  );
}