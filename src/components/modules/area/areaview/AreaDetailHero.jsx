//import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// [원복 방법] HeartButton 다시 추가, WishlistHeartButton 제거
import { ClipButton } from '@components/modules/ActionButtons';
import { getBadgeColor } from '@components/modules/area/arealist/areaListUtils';

/**
 * AreaDetailHero - 뷰 페이지 공통 대표 이미지 섹션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaDetailHero from '@components/modules/areaview/AreaDetailHero';
 *
 * // 2. 찜 상태 선언
 * const [isWished, setIsWished] = useState(false);
 *
 * // 3. JSX에서 사용 (categories는 리스트페이지와 동일한 배열 사용)
 * <AreaDetailHero
 *   image={item.image}
 *   name={item.name}
 *   category={item.category}
 *   categories={[선언된 카테고리]}
 *   renderHeart={() => (
      <WishlistHeartButton item={item} itemType="해당타입" region={region} />
     )}
 * />
 * ────────────────────────────────────────────────
 *
 * props:
 * - image      : 대표 이미지 URL
 * - name       : 장소명 (오버레이 표시)
 * - category   : 카테고리명 (배지 표시)
 * - categories : 카테고리 배열 (리스트페이지와 동일하게 전달 - 색상 순서 기준)
 * - isWished   : 찜 상태 (boolean)
 * - onWish     : 찜 토글 핸들러
 */

const AreaDetailHero = ({
  image,
  name,
  category,
  categories = [],
  renderHeart,
}) => {
  const badgeColor = getBadgeColor(categories, category);
  const navigate = useNavigate();

  return (
    <div className="relative rounded-lg overflow-hidden mb-6 
                aspect-[3/4] md:aspect-[16/4] 
                w-full h-auto">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* 이름 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
        <span className={`inline-block px-4 py-1 rounded-full fs-up-2 font-semibold mb-1 ${badgeColor}`}>
          {category}
        </span>
        <h1 className="fs-up-7 font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {name}
        </h1>
      </div>

      {/* 공유 & 찜 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <ClipButton />
        {renderHeart && renderHeart()}
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-800 px-5 py-2 rounded-xl fs-up-2 font-semibold shadow-lg shadow-black/5 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200"
      >
        <span className="mb-0.5">←</span> 목록으로
      </button>
    </div>
  );
};

export default AreaDetailHero;