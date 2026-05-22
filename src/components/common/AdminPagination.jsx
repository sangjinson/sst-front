import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // 1페이지 이하면 숨김 처리

  // 🚀 1. 한 번에 화면에 보여줄 최대 페이지 버튼 개수 (홀수 권장)
  const MAX_VISIBLE = 5;

  // 🚀 2. 현재 페이지가 항상 중앙에 오도록 계산
  let startPage = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
  let endPage = startPage + MAX_VISIBLE - 1;

  // 🚀 3. 끝 페이지가 실제 전체 페이지 수를 넘어가면 보정
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
  }

  // 🚀 4. 계산된 범위로 렌더링할 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    // 🚀 멘티님이 요청하신 컨테이너 스타일 적용
    <div className="mt-4 flex items-center justify-center gap-2">
      
      {/* 🚀 이전 버튼: 요청하신 스타일 100% 반영 */}
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          page === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        이전
      </button>

      {/* 🚀 페이지 번호 버튼: 이전/다음 버튼의 디자인 톤앤매너에 맞춤 */}
      {pageNumbers.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            p === page
              ? 'bg-gray-900 text-white cursor-default' // 현재 페이지는 어두운 색으로 강조
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' // 비활성 페이지는 테두리만 있는 밝은 색
          }`}
        >
          {p}
        </button>
      ))}

      {/* 🚀 다음 버튼: 이전 버튼과 동일한 규격으로 대칭 적용 */}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          page === totalPages
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        다음
      </button>
      
    </div>
  );
};

export default Pagination;