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
      <div className="bg-white rounded-lg p-5 mb-4 shadow-sm flex flex-col md:flex-row md:flex-wrap md:items-center">
        {/* 1. 제목: 항상 가장 먼저 등장 */}
        <h2 className="fs-up-3 font-bold text-gray-900 order-1">
          상세 설명
        </h2>

        {/* 2. PC용 스페이서: PC에서 제목과 버튼 사이를 벌려줌 */}
        <div className="hidden md:block md:flex-1 md:order-2"></div>

        {/* 3. 구분선 */}
        <hr className="w-full border-b border-t-0 border-gray-200 mt-3 mb-5 order-2 md:order-4" />

        {/* 4. 본문 */}
        <p className={`w-full fs-up-2 text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''} order-3 md:order-5`}>
          {description}
        </p>

        {/* 5. 버튼  */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fs-up-2 text-[#E8956D] font-medium hover:underline order-4 md:order-3 mt-5 md:mt-0 pt-5 md:pt-0 border-t md:border-none border-gray-100 block w-full md:w-auto text-center md:text-right"
        >
          {isExpanded ? '접기 ▲' : '더보기 ▼'}
        </button>
      </div>
  );
};

export default AreaDescription;