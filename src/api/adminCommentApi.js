// adminCommentApi.js
import api from './axios';

// 🚀 관리자: 댓글 목록 조회 (페이징, 필터, 검색 포함)
export const getAdminComments = async (params) => {
  const response = await api.get('/admin/comments', { params });
  return response.data.data;
};

// 🚀 관리자: 댓글 상태 변경 (숨김/복구)
export const toggleAdminCommentStatus = async (cmntNo, useYn) => {
  const response = await api.patch(`/admin/comments/${cmntNo}/status`, null, {
    params: { useYn }
  });
  return response.data;
};