import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // 1페이지 이하면 숨김 처리

  // 🚀 1. 한 화면에 보여줄 페이지 버튼의 최대 개수 (5개 단위로 끊기)
  const PAGE_BTN_LIMIT = 5;

  // 🚀 2. 현재 페이지가 속한 블록 계산 (예: page가 3이면 1블록(1~5), 7이면 2블록(6~10))
  const currentBlock = Math.ceil(page / PAGE_BTN_LIMIT);

  // 🚀 3. 화면에 그릴 시작 페이지와 끝 페이지 번호 계산
  const startPage = (currentBlock - 1) * PAGE_BTN_LIMIT + 1;
  const endPage = Math.min(startPage + PAGE_BTN_LIMIT - 1, totalPages);

  // 🚀 4. startPage부터 endPage까지의 번호만 배열로 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-7 flex-wrap">
      
      {/* 🚀 5. 맨 처음 / 이전 블록 이동 (옵션이지만 UX상 넣어주면 좋습니다) */}
      <button 
        onClick={() => onPageChange(1)} 
        disabled={page === 1}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-400 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
      >
        &lt;&lt;
      </button>

      {/* 한 칸 이전 페이지로 이동 */}
      <button 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        disabled={page === 1}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        &lt;
      </button>

      {/* 🚀 6. 전체가 아닌 '계산된 블록(pageNumbers)'만 렌더링 */}
      {pageNumbers.map((p) => (
        <button 
          key={p} 
          onClick={() => onPageChange(p)} 
          className={`w-[34px] h-[34px] rounded-full text-sm transition-colors flex items-center justify-center ${
            p === page 
              ? 'bg-[#0F9B73] text-white font-bold border-none' 
              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      {/* 한 칸 다음 페이지로 이동 */}
      <button 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))} 
        disabled={page === totalPages}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        &gt;
      </button>

      {/* 🚀 7. 맨 끝 블록 이동 */}
      <button 
        onClick={() => onPageChange(totalPages)} 
        disabled={page === totalPages}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-400 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;