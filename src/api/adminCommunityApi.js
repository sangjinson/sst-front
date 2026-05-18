import api from './axios';

// 🚀 백엔드와 통신하는 API 함수들을 깔끔하게 모아둡니다.
export const getAdminCommunities = async (params) => {
  const response = await api.get('/admin/community/list', { params });
  return response.data.data;
};

export const getAdminCommunityDetail = async (commNo) => {
  const response = await api.get(`/admin/community/${commNo}`);
  return response.data.data;
};

export const updateAdminCommunity = async (commNo, data) => {
  const response = await api.put(`/admin/community/${commNo}`, data);
  return response.data.data;
};

export const toggleAdminCommunityStatus = async (commNo, useYn) => {
  const response = await api.patch(`/admin/community/${commNo}/status`, null, { params: { useYn } });
  return response.data;
};

export const deleteAdminCommunity = async (commNo) => {
  const response = await api.delete(`/admin/community/${commNo}`);
  return response.data;
};

// 🚀 관리자 전용 수정 API 호출 함수
export const updateCommunityByAdmin = async (commNo, data) => {
  // 백엔드의 AdminCommunityController 주소로 요청을 보냅니다.
  const response = await api.put(`/admin/community/${commNo}`, data);
  return response.data;
};