// usePagination.js
import { useState } from 'react';

export const usePagination = (initialPage = 1, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalCount, setTotalCount] = useState(0);

  // 🚀 백엔드에서 totalPages를 안 줄 경우를 대비해 프론트에서 안전하게 계산
  const totalPages = Math.ceil(totalCount / size) || 1;

  // 🚀 페이지 이동 방어 로직 (범위 밖 이동 방지)
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    page,
    size,
    totalCount,
    totalPages,
    setPage: changePage, // 🚀 상태 변경 함수 대신 안전한 changePage를 노출
    setSize,
    setTotalCount
  };
};