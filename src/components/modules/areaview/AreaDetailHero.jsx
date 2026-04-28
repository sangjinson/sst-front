import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipButton, HeartButton } from '@components/modules/AreaActionButtons';
import { getBadgeColor } from '@components/modules/arealist/areaListUtils';

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
 *   categories={['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스']}
 *   isWished={isWished}
 *   onWish={() => setIsWished((prev) => !prev)}
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
  isWished,
  onWish,
}) => {
  const badgeColor = getBadgeColor(categories, category);
  const navigate = useNavigate();

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-96">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />

      {/* 이름 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${badgeColor}`}>
          {category}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{name}</h1>
      </div>

      {/* 공유 & 찜 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <ClipButton />
        <HeartButton liked={isWished} onClick={onWish} />
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white transition"
      >
        ← 목록으로
      </button>
    </div>
  );
};

export default AreaDetailHero;