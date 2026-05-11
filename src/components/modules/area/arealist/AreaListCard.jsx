import React from 'react';
import { GridCard, GridCardHeader, GridCardBody, GridCardFooter } from '@components/modules/gridcard';
import StarRating from '@components/modules/StarRating';
import { BADGE_COLORS } from '@components/modules/area/arealist/areaListUtils';
import { HeartButton } from '@components/modules/ActionButtons';

import IconSVG from "@components/Icon/IconSVG";

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
 *   onClick={() => goToDetail(item.id)}
 *   renderHeart={() => (
      <WishlistHeartButton item={item} itemType="food" region={regionKor} />
     )}
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

const AreaListCard = ({ item, categories, liked, onLike, onClick, renderHeart }) => {
  const name        = item.name        || item.title    || '';
  const category    = item.category    || item.tag      || '';
  const description = item.description || item.desc     || '';
  const location     = item.location     || item.address || '';
  const reviewCount = item.reviewCount ?? item.reviews  ?? 0;

  
  const badgeColorIdx =
    (Array.isArray(categories)
      ? categories.filter((c) => c !== '전체').indexOf(category)
      : 0);

  const safeBadgeColorIdx = badgeColorIdx >= 0 ? badgeColorIdx : 0;
  const badgeColor = BADGE_COLORS[safeBadgeColorIdx % BADGE_COLORS.length];




  return (
    <GridCard onClick={onClick}>
      <GridCardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={name}
            className="w-full h-full aspect-[3/4] sm:aspect-[4/4] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className={`absolute top-3 left-3 px-4 py-1 rounded-full fs-up-1 font-semibold ${badgeColor}`}>
            {category}
          </span>
          <div className="absolute top-2 right-2">
            {renderHeart ? renderHeart() : <HeartButton liked={liked} onClick={onLike} />}
          </div>
        </div>
      </GridCardHeader>

      <GridCardBody className="px-4 py-3">
        <h3 className="font-bold text-gray-900 fs-up-3 truncate group-hover:text-[#E8956D] transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 mt-2 py-1 fs-up-1">
          {/* 리스트 카드 위치 마크: "수원시 팔달구" 앞 아이콘 */}
          <IconSVG name="location" size={17} className=" shrink-0 fill-none stroke-[#E8956D]" strokeWidth={2}/>
          <span className="text-gray-800 truncate">{location}</span>
        </div>
        <div className="flex items-center gap-3 py-1 mb-2 fs-up-1">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-yellow-400">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </svg>
            <span className="font-semibold text-gray-700">
              {Number(item.rating).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            <span className="">{reviewCount}</span>
          </div>
        </div>
        
        
        
      </GridCardBody>

      <GridCardFooter className="flex items-center gap-1 fs-up-1">
        
        <p className="text-gray-500 line-clamp-2">{description}</p>
      </GridCardFooter>
    </GridCard>
  );
};

export default AreaListCard;
