import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@themeadmin/icons";

const AdminPagination = ({ page, size, totalCount, totalPages, onPageChange }) => {
  // 'Showing X to Y' 계산 로직
  const startItem = totalCount === 0 ? 0 : ((page - 1) * size) + 1;
  const endItem = Math.min(page * size, totalCount);

  // 🚀 1. 화면에 한 번에 보여줄 페이지 버튼의 개수 (예: 5개 단위로 끊어서 보여줌)
  const PAGE_BTN_LIMIT = 5;

  // 🚀 2. 현재 페이지가 속한 블록 계산
  // 예: page가 3이면 1블록(1~5), page가 7이면 2블록(6~10)
  const currentBlock = Math.ceil(page / PAGE_BTN_LIMIT);

  // 🚀 3. 화면에 그릴 시작 페이지와 끝 페이지 번호 계산
  const startPage = (currentBlock - 1) * PAGE_BTN_LIMIT + 1;
  const endPage = Math.min(startPage + PAGE_BTN_LIMIT - 1, totalPages);

  // 🚀 4. startPage부터 endPage까지의 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05] pt-5 mt-5">
      <p className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {totalCount} entries
      </p>
      
      <div className="flex items-center gap-2">
        {/* 이전 페이지로 이동 */}
        <button 
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* 🚀 5. 기존의 전체 totalPages 배열 대신, 계산된 블록(pageNumbers)만 렌더링 */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
              page === num 
              ? "bg-blue-600 text-white" 
              : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        {/* 다음 페이지로 이동 */}
        <button 
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;