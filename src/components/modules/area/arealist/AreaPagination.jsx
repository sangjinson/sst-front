import React from 'react';

const AreaPagination = ({ currentPage, totalPages, onPageChange }) => {
  const PAGES_PER_GROUP = 10;

  const currentGroup  = Math.ceil(currentPage / PAGES_PER_GROUP);
  const startPage     = (currentGroup - 1) * PAGES_PER_GROUP + 1;
  const endPage       = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);

  const pages       = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const hasPrevGroup = currentGroup > 1;
  const hasNextGroup = endPage < totalPages;

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

      {/* 이전 그룹 */}
      {hasPrevGroup && (
        <button
          onClick={() => onPageChange(startPage - 1)}
          className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          ...
        </button>
      )}

      {/* 페이지 번호 버튼 */}
      {pages.map((page) => (
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

      {/* 다음 그룹 */}
      {hasNextGroup && (
        <button
          onClick={() => onPageChange(endPage + 1)}
          className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          ...
        </button>
      )}

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