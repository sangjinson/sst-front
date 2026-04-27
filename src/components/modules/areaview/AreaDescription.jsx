import React, { useState } from 'react';

/**
 * AreaDescription - 뷰 페이지 공통 상세 설명 섹션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaDescription from '@components/modules/areaview/AreaDescription';
 *
 * // 2. JSX에서 사용
 * <AreaDescription
 *   description={item.description}
 * />
 * ────────────────────────────────────────────────
 *
 * props:
 * - description : 상세 설명 텍스트
 *                 (item.description 또는 item.desc 사용)
 */
const AreaDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
      <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
        {description}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 block mx-auto text-sm text-[#E8956D] font-medium hover:underline"
      >
        {isExpanded ? '접기 ▲' : '더보기 ▼'}
      </button>
    </div>
  );
};

export default AreaDescription;