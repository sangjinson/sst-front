import api from './axios';

// 🚀 페이징 및 필터링을 포함한 리뷰 목록 조회
// 백엔드의 PageRequest(page, size, keyword) 및 useYn 파라미터를 그대로 전달합니다.
export const getAdminReviews = async (params) => {
  const response = await api.get('/admin/reviews', { params });
  return response.data.data; // ApiResponse<T> 규격에 맞춤
};

// 🚀 리뷰 상태 토글 (숨김/복구)
// PATCH /api/admin/reviews/{rvwNo}/status?useYn={useYn}
export const toggleAdminReviewStatus = async (rvwNo, useYn) => {
  const response = await api.patch(`/admin/reviews/${rvwNo}/status`, null, {
    params: { useYn }
  });
  return response.data;
};