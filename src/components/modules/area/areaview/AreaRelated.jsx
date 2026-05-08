import React from 'react';
import { getBadgeColor } from '@components/modules/area/arealist/areaListUtils';

/**
 * AreaRelated - 뷰 페이지 공통 연관 추천 섹션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaRelated from '@components/modules/areaview/AreaRelated';
 *
 * // 2. JSX에서 사용 (잘거리)
 * <AreaRelated
 *   title="연관 추천 숙소"
 *   items={relatedItems}
 *   onItemClick={(rel) => navigate(`/${region}/sleep/view?id=${rel.id}`)}
 *   nameKey="name"
 * />
 *
 * // 먹거리 예시
 * <AreaRelated
 *   title="비슷한 음식점"
 *   items={relatedItems}
 *   onItemClick={(rel) => navigate(`/${region}/food/view?id=${rel.id}`)}
 *   nameKey="name"
 * />
 *
 * // 볼거리 예시 (title 필드명이 다를 경우)
 * <AreaRelated
 *   title="연관 추천 볼거리"
 *   items={relatedItems}
 *   onItemClick={(rel) => navigate(`/${region}/see/view?id=${rel.id}`)}
 *   nameKey="title"
 * />
 * ────────────────────────────────────────────────
 *
 * props:
 * - title      : 섹션 제목 (기본: '연관 추천')
 * - items      : 연관 아이템 배열 [{ id, image, name|title, category|tag }]
 * - onItemClick: 아이템 클릭 핸들러 (rel) => void
 * - nameKey    : 이름 필드명 ('name' 또는 'title', 기본: 'name')
 */
const AreaRelated = ({
  title = '연관 추천',
  items = [],
  onItemClick,
  nameKey = 'name',
  categories = [],
}) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg p-5 mb-6 shadow-sm">
      <h2 className="fs-up-3 font-bold text-gray-900 mb-3">{title}</h2>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-3 mb-5 order-2 md:order-4" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {items.map((rel) => {
          const category = rel.category || rel.tag;
          const badgeColor = getBadgeColor(categories, category);

          return (
            <div
            key={rel.id}
            onClick={() => onItemClick?.(rel)}
            className="cursor-pointer group"
          >
            <div className="relative aspect-[7/3] md:aspect-[7/5] rounded-xl overflow-hidden">
              <img
                src={rel.image}
                alt={rel[nameKey] || rel.name || rel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
                {category && (
                  <span className={`mb-1 inline-block rounded-full px-3 py-1 fs-up-1 font-semibold ${badgeColor}`}>
                    {category}
                  </span>
                )}
                <p className="fs-up-4 font-bold text-white truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)]">
                  {rel[nameKey] || rel.name || rel.title}
                </p>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AreaRelated;