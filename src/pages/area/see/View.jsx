import React, { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSeeDataById, getSeeDataByRegion } from './seeData';
import { toKorRegion } from '@utils/regionMap';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import {
  AreaDescription,
  AreaDetailHero,
  AreaInfoSection,
  AreaMap,
  AreaRelated,
  AreaReview,
} from '@components/modules/area/areaview';

import IconSVG from "@components/Icon/IconSVG";

// 카테고리 목록 (List.jsx와 동일)
const CATEGORIES = ['전체', '박물관', '도서관', '지역명소', '공원'];

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

  // 로그인 상태 (임시로 true 설정 - 실제 인증으로 대체 필요)
  const isLoggedIn = true;

  // 선택된 아이템
  const item = useMemo(() => {
    if (!id) return null;
    return getSeeDataById(id, regionKor);
  }, [id, regionKor]);

  // 연관 추천 아이템 목록
  const relatedItems = useMemo(() => {
    if (!item) return [];

    return getSeeDataByRegion(item.region)
      .filter((seeItem) => seeItem.id !== item.id && seeItem.category === item.category)
      .slice(0, 4);
  }, [item]);

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
        name={item.name}
        category={item.category}
        categories={CATEGORIES}
        renderHeart={() => (
          <WishlistHeartButton item={item} itemType="see" region={region} />
        )}
      />

      {/* 상세 설명 섹션 */}
      <AreaDescription description={item.description} />

      {/* 정보 섹션 (주소, 이용시간, 전화번호, 이용요금, 해시태그) */}
      <AreaInfoSection
        infoItems={[
          { icon: <IconSVG name="location" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4}/>, label: '주소', value: item.address },
          { icon: <IconSVG name="time" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4}/>, label: '이용시간', value: item.hours },
          { icon: <IconSVG name="phone" size={18} className=" shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={2} />, label: '전화번호', value: item.phone },
          { icon: <IconSVG name="circleprice" size={18} className=" shrink-0 fill-none stroke-[#E8956D]" strokeWidth={4} />, label: '이용요금', value: item.price, highlight: true },

          
        ]}
        tags={item.tags}
        tagLabel="해시태그"
      />

      {/* 지도 섹션 (주소 기반 지도 표시) */}
      <AreaMap lat={item.lat} lng={item.lng} address={item.address} />

      {/* 리뷰 섹션 (평점, 리뷰 목록, 리뷰 작성) */}
      <AreaReview
        rating={item.rating}
        reviewCount={item.reviewCount}
        reviews={item.reviews}
        isLoggedIn={isLoggedIn}
        placeholder="볼거리에 대한 솔직한 리뷰를 남겨주세요."
      />

      {/* 연관 추천 섹션 (같은 카테고리의 다른 볼거리) */}
      <AreaRelated
        title="연관 추천 볼거리"
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${region}/see/view?id=${rel.id}`)}
        nameKey="name"
        categories={CATEGORIES}
      />

      {/* 하단 액션 버튼 영역 (목록으로, 맨 위로) */}
      <div className="flex items-center justify-between gap-3 mb-6">
        {/* 목록으로 이동 버튼: 이제 왼쪽 끝에 붙습니다 */}
        <button
          onClick={() => navigate(`/${region}/see/list`)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-xl fs-up-2 font-semibold shadow-lg shadow-black/5 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200"
        >
          <span className="mb-0.5 text-lg">←</span> 목록으로
        </button>

        {/* 맨 위로 스크롤 이동 버튼: 이제 오른쪽 끝에 붙습니다 */}
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

export default View;
