// src/pages/area/food/View.jsx
import React, { useState, useEffect } from 'react';
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

const CATEGORIES = ['전체', '한식', '중식', '일식', '양식'];

const generateReviews = (foodName) => [
  { user: '미식가' + foodName.slice(0, 1) + '123', rating: 5, comment: `${foodName} 진짜 맛있어요! 강력 추천합니다.` },
  { user: '여행중인밥', rating: 4, comment: '분위기도 좋고 음식도 맛있었어요. 또 오고 싶네요.' },
  { user: '동네주민', rating: 5, comment: `${foodName} 단골입니다. 항상 맛이 일정하고 서비스도 좋아요.` },
];

export default function FoodView() {
  const { region } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const currentRegion    = region || '';
  const currentRegionKor = toKorRegion(currentRegion);

  const isLoggedIn = true; // ※ 실제 AuthContext로 교체 필요

  const [item, setItem]                 = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (!id) return;
    const allFoods = getFoodDataByRegion(currentRegionKor);
    const food = allFoods.find((f) => String(f.id) === String(id));
    if (food) {
      setItem(food); // ✅ 원본 그대로 저장
      const related = allFoods
        .filter((f) => f.id !== food.id && f.category === food.category)
        .slice(0, 4);
      setRelatedItems(related);
    }
    window.scrollTo(0, 0);
  }, [id, currentRegionKor]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
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
    <div className='container'>
      <div>
    <div className="min-h-screen">
      <div className="py-5">

        {/* 대표 이미지 + 공유/찜/뒤로가기 */}
        <AreaDetailHero
          image={item.image}
          name={item.name}
          category={item.category}
          categories={CATEGORIES}
          renderHeart={() => (
            <WishlistHeartButton item={item} itemType="food" region={region} />
          )}
        />

        {/* 상세 설명 */}
        <AreaDescription description={item.description} />

        {/* 이용 정보 */}
        <AreaInfoSection
          infoItems={[
            { icon: '📍', label: '주소',     value: item.address },
            { icon: '📞', label: '전화번호', value: '031-000-0000' },
            { icon: '⏰', label: '영업시간', value: '11:00 - 21:00' },
            { icon: '💰', label: '가격대',   value: '10,000원 ~ 30,000원', highlight: true },
          ]}
          tags={item.tags}
          tagLabel="태그"
        />

        {/* 지도 */}
        <AreaMap address={item.address} />

        {/* 평점 & 리뷰 */}
        <AreaReview
          rating={item.rating}
          reviewCount={item.reviews}           // ✅ 숫자 (foodData의 reviews 필드)
          reviews={generateReviews(item.name)} // ✅ 더미 리뷰 배열
          isLoggedIn={isLoggedIn}
          placeholder="음식점에 대한 솔직한 리뷰를 남겨주세요."
        />

        {/* 연관 추천 음식점 */}
        <AreaRelated
          title={`${currentRegionKor} 비슷한 음식점`}
          items={relatedItems}
          onItemClick={(rel) => navigate(`/${currentRegion}/food/view?id=${rel.id}`)}
          nameKey="name"
        />

        {/* 하단 버튼 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/${currentRegion}/food/list`)}
            className="flex-1 py-3 border border-[#E8956D] bg-[#E8956D] rounded-xl text-sm text-white font-medium hover:bg-[#f07e48] transition"
          >
            ← 목록으로
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            title="맨 위로"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
    </div>
    </div>
  );
}