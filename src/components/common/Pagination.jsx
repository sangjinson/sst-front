import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // 1페이지 이하면 숨김 처리

  return (
    <div className="flex justify-center gap-2 mt-7 flex-wrap">
      <button 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        disabled={page === 1}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
      <button 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))} 
        disabled={page === totalPages}
        className="w-[34px] h-[34px] rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;