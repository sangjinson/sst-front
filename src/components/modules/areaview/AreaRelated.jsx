import React from 'react';

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
}) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((rel) => (
          <div
            key={rel.id}
            onClick={() => onItemClick?.(rel)}
            className="cursor-pointer group"
          >
            <div className="h-28 rounded-xl overflow-hidden mb-2">
              <img
                src={rel.image}
                alt={rel[nameKey] || rel.name || rel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-[#0F9B73] transition-colors">
              {rel[nameKey] || rel.name || rel.title}
            </p>
            <p className="text-xs text-gray-400">{rel.category || rel.tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaRelated;