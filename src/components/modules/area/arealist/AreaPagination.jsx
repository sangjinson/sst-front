import React from 'react';

/**
 * AreaPagination - 볼거리/먹거리/잘거리/놀거리 공통 페이지네이션
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import AreaPagination from '@components/modules/AreaPagination';
 *
 * // 2. 페이지 상태 선언
 * const [currentPage, setCurrentPage] = useState(1);
 * const ITEMS_PER_PAGE = 6;
 *
 * // 3. 페이지 계산
 * const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
 * const paginated = filtered.slice(
 *   (currentPage - 1) * ITEMS_PER_PAGE,
 *   currentPage * ITEMS_PER_PAGE
 * );
 *
 * // 4. JSX에서 사용
 * <AreaPagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ────────────────────────────────────────────────
 *
 * props:
 * - currentPage  : 현재 페이지 번호 (1부터 시작)
 * - totalPages   : 전체 페이지 수
 * - onPageChange : 페이지 변경 콜백 (page: number) => void
 */
const AreaPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-10">

      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        이전
      </button>

      {/* 페이지 번호 버튼 */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            currentPage === page
              ? 'bg-[#E8956D] text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        다음
      </button>

    </div>
  );
};

export default AreaPagination;