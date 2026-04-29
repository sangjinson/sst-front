import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSleepDataById, getSleepDataByRegion } from './sleepDummyData';
// [원복 방법] useWishlist 복구, WishlistHeartButton import 제거
import { WishlistHeartButton } from '@components/modules/AreaActionButtons';
import {
  AreaDetailHero,
  AreaDescription,
  AreaInfoSection,
  AreaMap,
  AreaReview,
  AreaRelated,
} from '@components/modules/areaview';

// ※ 프로젝트의 실제 AuthContext import로 교체하세요
// import { useAuth } from '@context/AuthContext';

// ※ 임시 로그인 상태 (실제 AuthContext로 교체 필요)
// const { user } = useAuth();
// const isLoggedIn = !!user;

// 리스트 페이지와 동일한 카테고리 배열 (배지 색상 순서 기준)
const CATEGORIES = ['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스'];

const View = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const isLoggedIn = true; // ※ 실제 AuthContext로 교체 필요

  const [item, setItem]                = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  // [원복 방법] 아래 줄 복구: const { isWished, toggleWish } = useWishlist(id, 'sleep');


  useEffect(() => {
    if (!id) return;
    const data = getSleepDataById(id);
    setItem(data);
    if (data) {
      const all = getSleepDataByRegion(data.region);
      const related = all.filter((d) => d.id !== data.id).slice(0, 4);
      setRelatedItems(related);
    }
  }, [id]);

  // 데이터 없을 때
  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
        <div className="text-center">
          <p className="text-5xl mb-4">🏨</p>
          <p className="text-lg">숙소 정보를 찾을 수 없습니다.</p>
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

      {/* 대표 이미지 + 공유/찜/뒤로가기 */}
      {/* [원복 방법] renderHeart 제거 후 isWished, onWish props 복구 */}
      <AreaDetailHero
        image={item.image}
        name={item.name}
        category={item.category}
        categories={CATEGORIES}
        renderHeart={() => (
          <WishlistHeartButton item={item} itemType="sleep" region={region} />
        )}
      />

      {/* 상세 설명 */}
      <AreaDescription description={item.description} />

      {/* 이용 정보 */}
      <AreaInfoSection
        infoItems={[
          { icon: '📍', label: '주소',           value: item.address },
          { icon: '📞', label: '전화번호',        value: item.phone },
          { icon: '🕐', label: '체크인/체크아웃', value: `체크인 ${item.checkIn} / 체크아웃 ${item.checkOut}` },
          { icon: '💰', label: '요금',            value: item.price, highlight: true },
        ]}
        tags={item.facilities}
        tagLabel="편의시설"
      />

      {/* 지도 */}
      <AreaMap lat={item.lat} lng={item.lng} address={item.address} />

      {/* 평점 & 리뷰 */}
      <AreaReview
        rating={item.rating}
        reviewCount={item.reviewCount}
        reviews={item.reviews}
        isLoggedIn={isLoggedIn}
        placeholder="숙소에 대한 솔직한 리뷰를 남겨주세요."
      />

      {/* 연관 추천 숙소 */}
      <AreaRelated
        title="연관 추천 숙소"
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${region}/sleep/view?id=${rel.id}`)}
        nameKey="name"
      />

      {/* 하단 버튼 영역 */}
      <div className="flex items-center gap-3 mb-6">
        {/* 목록으로 버튼 */}
        <button
          onClick={() => navigate(`/${region}/sleep/list`)}
          className="flex-1 py-3 border border-gray-300 bg-[#E8956D] rounded-xl text-sm text-white font-medium hover:bg-[#f07e48] transition"
        >
          ← 목록으로
        </button>

        {/* TOP 버튼 */}
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
  );
};

export default View;