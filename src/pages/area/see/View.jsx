import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSeeDataByRegion } from './seeData';
import { toKorRegion } from '@utils/regionMap';
import { WishlistHeartButton } from '@components/modules/AreaActionButtons';
import {
  AreaDescription,
  AreaDetailHero,
  AreaInfoSection,
  AreaMap,
  AreaRelated,
  AreaReview,
} from '@components/modules/areaview';

// 카테고리 목록 (List.jsx와 동일)
const CATEGORIES = ['전체', '박물관', '도서관', '지역명소', '공원'];

// 기본 리뷰 데이터 (데이터가 없을 때 표시할 샘플 리뷰)
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

/**
 * 볼거리 상세 페이지 컴포넌트
 * - 선택된 볼거리의 상세 정보를 표시
 * - 연관 추천 목록, 리뷰, 지도 등을 포함
 */
const View = () => {
  // URL 파라미터에서 region 정보 가져오기
  const { region } = useParams();
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터에서 id 가져오기
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  // region을 한글 지역명으로 변환
  const regionKor = toKorRegion(region || '수원');
  const regionName = regionKor.replace(/[시군]$/, '');

  // 로그인 상태 (임시로 true 설정 - 실제 인증으로 대체 필요)
  const isLoggedIn = true;

  // 선택된 아이템 상태
  const [item, setItem] = useState(null);
  // 연관 추천 아이템 목록 상태
  const [relatedItems, setRelatedItems] = useState([]);

  // id 또는 regionName이 변경되면 데이터 로드
  useEffect(() => {
    // id가 없으면 실행하지 않음
    if (!id) return;

    // 해당 지역의 모든 볼거리 데이터 가져오기
    const all = getSeeDataByRegion(regionName);
    // id가 일치하는 아이템 찾기 (타입 비교를 위해 문자열로 변환)
    const data = all.find((seeItem) => String(seeItem.id) === String(id));

    // 아이템 상태 업데이트 (없으면 null)
    setItem(data || null);

    // 데이터가 있으면 연관 추천 아이템 계산
    if (data) {
      // 같은 카테고리면서 현재 아이템 제외하고 최대 4개까지
      const related = all
        .filter((seeItem) => seeItem.id !== data.id && seeItem.tag === data.tag)
        .slice(0, 4);
      setRelatedItems(related);
    }
  }, [id, regionName]);

  // 아이템이 없는 경우 빈 상태 UI 표시
  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
        <div className="text-center">
          <p className="text-5xl mb-4">👀</p>
          <p className="text-lg">볼거리 정보를 찾을 수 없습니다.</p>
          {/* 이전 페이지로 이동 */}
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

      {/* 상세 페이지 히어로 섹션 (이미지, 이름, 카테고리, 찜 버튼) */}
      <AreaDetailHero
        image={item.image}
        name={item.title}
        category={item.tag}
        categories={CATEGORIES}
        renderHeart={() => (
          <WishlistHeartButton item={item} itemType="see" region={region} />
        )}
      />

      {/* 상세 설명 섹션 */}
      <AreaDescription description={item.desc} />

      {/* 정보 섹션 (주소, 이용시간, 전화번호, 이용요금, 해시태그) */}
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

      {/* 지도 섹션 (주소 기반 지도 표시) */}
      <AreaMap address={item.location} />

      {/* 리뷰 섹션 (평점, 리뷰 목록, 리뷰 작성) */}
      <AreaReview
        rating={item.rating ?? 0}
        reviewCount={item.reviewCount ?? item.likes ?? DEFAULT_REVIEWS.length}
        reviews={item.reviews ?? DEFAULT_REVIEWS}
        isLoggedIn={isLoggedIn}
        placeholder="볼거리에 대한 솔직한 리뷰를 남겨주세요."
      />

      {/* 연관 추천 섹션 (같은 카테고리의 다른 볼거리) */}
      <AreaRelated
        title="연관 추천 볼거리"
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${region}/see/view?id=${rel.id}`)}
        nameKey="title"
      />

      {/* 하단 액션 버튼 영역 (목록으로, 맨 위로) */}
      <div className="flex items-center gap-3 mb-6">
        {/* 목록으로 이동 버튼 */}
        <button
          onClick={() => navigate(`/${region}/see/list`)}
          className="flex-1 py-3 border border-gray-300 bg-[#E8956D] rounded-xl text-sm text-white font-medium hover:bg-[#f07e48] transition"
        >
          ← 목록으로
        </button>

        {/* 맨 위로 스크롤 이동 버튼 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          title="맨 위로"
        >
          {/* 화살표 아이콘 (SVG) */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default View;