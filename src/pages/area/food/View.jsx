// src/pages/area/food/View.jsx
import React, { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getFoodDataByRegion } from './foodData';
import { toKorRegion } from '@utils/regionMap';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import {
  AreaDetailHero,
  AreaDescription,
  AreaInfoSection,
  AreaMap,
  AreaReview,
  AreaRelated,
} from '@components/modules/area/areaview';
import IconSVG from '@components/Icon/IconSVG';

const CATEGORIES = ['전체', '한식', '중식', '일식', '양식'];

const generateReviews = (foodName) => [
  { user: '미식가' + foodName.slice(0, 1) + '123', rating: 5, comment: `${foodName} 진짜 맛있어요! 강력 추천합니다.` },
  { user: '여행중인밥', rating: 4, comment: '분위기도 좋고 음식도 맛있었어요. 또 오고 싶네요.' },
  { user: '동네주민', rating: 5, comment: `${foodName} 단골입니다. 항상 맛이 일정하고 서비스도 좋아요.` },
];

const FoodView = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const currentRegion = region || '';
  const currentRegionKor = toKorRegion(currentRegion);
  const isLoggedIn = true;

  const allItems = useMemo(
    () => getFoodDataByRegion(currentRegionKor),
    [currentRegionKor]
  );

  const item = useMemo(() => {
    if (!id) return null;
    return allItems.find((entry) => String(entry.id) === String(id)) || null;
  }, [allItems, id]);

  const relatedItems = useMemo(() => {
    if (!item) return [];

    return allItems
      .filter((entry) => entry.id !== item.id && entry.category === item.category)
      .slice(0, 4);
  }, [allItems, item]);

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
        <div className="text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg">음식점 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2 bg-[#0F9B73] text-white rounded-lg text-sm"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AreaDetailHero
        image={item.image}
        name={item.name}
        category={item.category}
        categories={CATEGORIES}
        renderHeart={() => (
          <WishlistHeartButton item={item} itemType="food" region={region} />
        )}
      />

      <AreaDescription description={item.description} />

      <AreaInfoSection
        infoItems={[
          { icon: <IconSVG name="location" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4} />, label: '주소', value: item.address },
          { icon: <IconSVG name="phone" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={2} />, label: '전화번호', value: item.phone || '031-000-0000' },
          { icon: <IconSVG name="time" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4} />, label: '영업시간', value: item.hours || '11:00 - 21:00' },
          { icon: <IconSVG name="circleprice" size={18} className=" shrink-0 fill-none stroke-[#E8956D]" strokeWidth={4} />, label: '가격대', value: item.price || '10,000원 ~ 30,000원', highlight: true },
        ]}
        tags={item.tags}
        tagLabel="태그"
      />

      <AreaMap lat={item.lat} lng={item.lng} address={item.address} />

      <AreaReview
        rating={item.rating}
        reviewCount={item.reviewCount || item.reviews}
        reviews={item.reviewList || generateReviews(item.name)}
        isLoggedIn={isLoggedIn}
        placeholder="음식점에 대한 솔직한 리뷰를 남겨주세요."
      />

      <AreaRelated
        title={`${currentRegionKor} 비슷한 음식점`}
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${currentRegion}/food/view?id=${rel.id}`)}
        nameKey="name"
        categories={CATEGORIES}
      />

      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => navigate(`/${currentRegion}/food/list`)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-xl fs-up-2 font-semibold shadow-lg shadow-black/5 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200"
        >
          <span className="mb-0.5 text-lg">←</span> 목록으로
        </button>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md border border-white/20 rounded-xl text-gray-800 shadow-lg shadow-black/5 hover:bg-white hover:shadow-xl transition-all duration-200"
          title="맨 위로"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FoodView;
