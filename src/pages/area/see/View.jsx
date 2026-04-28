import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSeeDataByRegion } from './seeData';
import { toKorRegion } from '@utils/regionMap';
import {
  AreaDescription,
  AreaDetailHero,
  AreaInfoSection,
  AreaMap,
  AreaRelated,
  AreaReview,
} from '@components/modules/areaview';

const CATEGORIES = ['전체', '박물관', '도서관', '지역명소', '공원'];

const DEFAULT_REVIEWS = [
  {
    user: '5스틴',
    rating: 5,
    comment: '분위기 최고예요.',
  },
  {
    user: '여행가 영훈',
    rating: 4,
    comment: '가볍게 둘러보기 좋았습니다.',
  },
];

const View = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const regionKor = toKorRegion(region || '수원');
  const regionName = regionKor.replace(/[시군]$/, '');

  const isLoggedIn = true;

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    if (!id) return;

    const all = getSeeDataByRegion(regionName);
    const data = all.find((seeItem) => String(seeItem.id) === String(id));

    setItem(data || null);

    if (data) {
      const related = all
        .filter((seeItem) => seeItem.id !== data.id && seeItem.tag === data.tag)
        .slice(0, 4);
      setRelatedItems(related);
    }
  }, [id, regionName]);

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
        <div className="text-center">
          <p className="text-5xl mb-4">👀</p>
          <p className="text-lg">볼거리 정보를 찾을 수 없습니다.</p>
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
        name={item.title}
        category={item.tag}
        categories={CATEGORIES}
        isWished={isWished}
        onWish={() => setIsWished((prev) => !prev)}
      />

      <AreaDescription description={item.desc} />

      <AreaInfoSection
        infoItems={[
          { icon: '📍', label: '주소', value: item.location },
          { icon: '🕐', label: '이용시간', value: '09:00 - 18:00' },
          { icon: '📞', label: '전화번호', value: '031-290-3600' },
          { icon: '💰', label: '이용요금', value: '현장 확인', highlight: true },
        ]}
        tags={item.hashtags}
        tagLabel="해시태그"
      />

      <AreaMap address={item.location} />

      <AreaReview
        rating={item.rating ?? 0}
        reviewCount={item.reviewCount ?? item.likes ?? DEFAULT_REVIEWS.length}
        reviews={item.reviews ?? DEFAULT_REVIEWS}
        isLoggedIn={isLoggedIn}
        placeholder="볼거리에 대한 솔직한 리뷰를 남겨주세요."
      />

      <AreaRelated
        title="연관 추천 볼거리"
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${region}/see/view?id=${rel.id}`)}
        nameKey="title"
      />

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/${region}/see/list`)}
          className="flex-1 py-3 border border-gray-300 bg-[#E8956D] rounded-xl text-sm text-white font-medium hover:bg-[#f07e48] transition"
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
  );
};

export default View;
