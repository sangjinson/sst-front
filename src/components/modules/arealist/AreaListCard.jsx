import React from 'react';
import { GridCard, GridCardHeader, GridCardBody, GridCardFooter } from '@components/modules/GridCard';
import StarRating from '@components/modules/StarRating';
import { BADGE_COLORS } from '@components/modules/arealist/areaListUtils';

/**
 * AreaListCard - 볼거리/먹거리/잘거리/놀거리 공통 리스트 카드
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaListCard from '@components/modules/AreaListCard';
 *
 * // 2. 찜 상태 선언
 * const [likedItems, setLikedItems] = useState({});
 * const handleLike = (e, id) => {
 *   e.stopPropagation();
 *   setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
 * };
 *
 * // 3. 카테고리 목록 선언 (전체 제외한 순서대로 색상 배정됨)
 * const CATEGORIES = ['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스'];
 *
 * // 4. JSX에서 사용
 * <AreaListCard
 *   item={{
 *     ...item,
 *     // 카테고리 인덱스: CATEGORIES에서 '전체' 제외 후 해당 카테고리 순서
 *     categoryIndex: CATEGORIES.filter(c => c !== '전체').indexOf(item.category),
 *   }}
 *   liked={!!likedItems[item.id]}
 *   onLike={(e) => handleLike(e, item.id)}
 *   onClick={() => goToDetail(item.id)}
 * />
 * ────────────────────────────────────────────────
 *
 * item 필드 규격 (카테고리별 필드명이 달라도 자동 호환):
 * - image              : 썸네일 이미지 URL
 * - name | title       : 장소명
 * - category | tag     : 카테고리
 * - rating             : 평점 (숫자)
 * - reviewCount | reviews : 리뷰 수
 * - description | desc : 장소 소개
 * - address | location : 주소
 * - categoryIndex      : 배지 색상 순서 (0부터 시작, BADGE_COLORS 팔레트 순환)
 */


const AreaListCard = ({ item, liked, onLike, onClick }) => {
  const name        = item.name        || item.title    || '';
  const category    = item.category    || item.tag      || '';
  const description = item.description || item.desc     || '';
  const address     = item.address     || item.location || '';
  const reviewCount = item.reviewCount ?? item.reviews  ?? 0;

  // 카테고리 목록에서 인덱스 찾아서 순서대로 색상 배정
  const categoryIndex = item.categoryIndex ?? 0;
  const badgeColor = BADGE_COLORS[categoryIndex % BADGE_COLORS.length];

  return (
    <GridCard onClick={onClick}>

      {/* 썸네일 */}
      <GridCardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* 좌측 상단: 카테고리 배지 */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {category}
          </span>

          {/* 우측 상단: 찜 버튼 */}
          <button
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            onClick={onLike}
          >
            <svg
              className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-500'}`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </GridCardHeader>

      {/* 카드 본문 */}
      <GridCardBody className="px-4 py-3">

        {/* 이름 */}
        <h3 className="font-bold text-gray-900 text-base mb-2 truncate group-hover:text-[#E8956D] transition-colors">
          {name}
        </h3>

        {/* 평점 + 리뷰수 */}
        <div className="flex items-center gap-3 mb-2">

          {/* 평점: 별 1개 + 숫자 */}
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-yellow-400">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              {Number(item.rating).toFixed(1)}
            </span>
          </div>

          {/* 리뷰수: 댓글 아이콘 + 숫자 */}
          <div className="flex items-center gap-1 text-gray-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            <span className="text-xs">{reviewCount}</span>
          </div>
        </div>

        {/* 장소 소개 */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {description}
        </p>

      </GridCardBody>

      {/* 주소 */}
      <GridCardFooter className="flex items-center gap-1">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-none stroke-[#E8956D]" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="text-xs text-gray-800 truncate">{address}</span>
      </GridCardFooter>

    </GridCard>
  );
};

export default AreaListCard;