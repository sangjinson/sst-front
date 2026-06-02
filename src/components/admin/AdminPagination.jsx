import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // 1페이지 이하면 숨김 처리

  //  한 번에 화면에 보여줄 최대 페이지 버튼 개수 (홀수 권장)
  const MAX_VISIBLE = 5;

  //  현재 페이지가 항상 중앙에 오도록 계산
  let startPage = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
  let endPage = startPage + MAX_VISIBLE - 1;

  //  끝 페이지가 실제 전체 페이지 수를 넘어가면 보정
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
  }

  //  계산된 범위로 렌더링할 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    // 컨테이너 스타일 (다크모드 엇박자 방지를 위해 transition 제거)
    <div className="mt-6 flex items-center justify-center gap-2">
      
      {/*  이전 버튼: 활성 시 청록색(#0F9B73) 적용, 다크모드 대응 */}
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`rounded-lg px-3.5 py-2 text-sm font-semibold shadow-sm ${
          page === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            : 'bg-[#0F9B73] text-white hover:bg-[#0c8261]'
        }`}
      >
        이전
      </button>

      {/*  페이지 번호 버튼 */}
      {pageNumbers.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`rounded-lg px-3.5 py-2 text-sm font-semibold border ${
            p === page
              ? 'bg-[#0F9B73] text-white border-[#0F9B73] cursor-default' //  현재 페이지: 청록색 채우기
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800' //  비활성 페이지: 다크모드 솔리드 컬러 적용
          }`}
        >
          {p}
        </button>
      ))}

      {/*  다음 버튼: 활성 시 청록색(#0F9B73) 적용, 다크모드 대응 */}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`rounded-lg px-3.5 py-2 text-sm font-semibold shadow-sm ${
          page === totalPages
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            : 'bg-[#0F9B73] text-white hover:bg-[#0c8261]'
        }`}
      >
        다음
      </button>
      
    </div>
  );
};

export default Pagination;