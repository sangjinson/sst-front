// reviewApi.js
import api from './axios';  // ← axios.js 기준 상대경로


// 프론트에서 백엔드 API를 호출하는 함수 모음

/**
 * 리뷰 등록
 * POST /api/reviews
 */
export const createReview = (payload) =>
  api.post('/reviews', payload).then((res) => res.data);

/**
 * 리뷰 수정
 * PUT /api/reviews/{rvwNo}
 */
export const updateReview = (rvwNo, payload) =>
  api.put(`/reviews/${rvwNo}`, payload).then((res) => res.data);

/**
 * 리뷰 삭제
 * DELETE /api/reviews/{rvwNo}
 */
export const deleteReview = (rvwNo, payload) =>
  api.delete(`/reviews/${rvwNo}`, { data: payload }).then((res) => res.data);

// 리뷰 목록 조회
// GET /api/reviews?plcNo={plcNo}
export const getReviews = (plcNo) =>
  api.get('/reviews', { params: { plcNo } }).then((res) => res.data);

/**
 * 장소 이미지 목록 조회
 * GET /api/place/{plcNo}/images
 */
export const getPlaceImages = (plcNo) =>
  api.get(`/place/${plcNo}/images`).then((res) => res.data);