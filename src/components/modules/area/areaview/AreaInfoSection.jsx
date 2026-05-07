import React from 'react';

/**
 * AreaInfoSection - 뷰 페이지 공통 이용 정보 섹션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaInfoSection from '@components/modules/areaview/AreaInfoSection';
 *
 * // 2. JSX에서 사용 (잘거리)
 * <AreaInfoSection
 *   infoItems={[
 *     { icon: '📍', label: '주소',            value: item.address },
 *     { icon: '📞', label: '전화번호',         value: item.phone },
 *     { icon: '🕐', label: '체크인/체크아웃',  value: `체크인 ${item.checkIn} / 체크아웃 ${item.checkOut}` },
 *     { icon: '💰', label: '요금',             value: item.price, highlight: true },
 *   ]}
 *   tags={item.facilities}
 *   tagLabel="편의시설"
 * />
 *
 * // 먹거리 예시
 * <AreaInfoSection
 *   infoItems={[
 *     { icon: '📍', label: '주소',     value: item.address },
 *     { icon: '📞', label: '전화번호', value: item.phone },
 *     { icon: '⏰', label: '영업시간', value: item.hours },
 *     { icon: '💰', label: '가격대',   value: item.price, highlight: true },
 *   ]}
 *   tags={item.tags}
 *   tagLabel="태그"
 * />
 * ────────────────────────────────────────────────
 *
 * props:
 * - infoItems : 이용정보 배열
 *   - icon      : 이모지 아이콘
 *   - label     : 항목명
 *   - value     : 값
 *   - highlight : true면 초록색 강조 텍스트
 * - tags      : 하단 태그 배열 (편의시설, 해시태그 등) - 선택
 * - tagLabel  : 태그 섹션 제목 (기본: '태그') - 선택
 */
const AreaInfoSection = ({ infoItems = [], tags = [], tagLabel = '태그' }) => {
  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
      <h2 className="fs-up-3 font-bold text-gray-900 mb-4">이용 정보</h2>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-3 mb-5 order-2 md:order-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems.map((info, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="fs-3">{info.icon}</span>
            <div>
              <p className="fs-up-2 font-semibold text-gray-400 mb-0.5">{info.label}</p>
              <p className={`fs-up-2 ${info.highlight ? 'font-semibold text-[#E8956D]' : 'text-gray-700'}`}>
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 태그 영역 - tags가 있을 때만 표시 */}
      {tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="fs-up-1 font-semibold text-gray-500 mb-2">{tagLabel}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 fs-up-1 font-semibold rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaInfoSection;