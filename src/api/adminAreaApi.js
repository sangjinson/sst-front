// adminAreaApi.js
import api from './axios'; // 🚀 HttpOnly 쿠키 인증이 포함된(인터셉터 적용) axios 인스턴스 필수

// 1. 상세 데이터 불러오기
export const getAdminSeeDetail = async (plcNo) => {
  const response = await api.get(`/admin/see/${plcNo}`);
  // 🚀 백엔드의 ApiResponse 규격에 맞춰서 .data.data 로 꺼내줌
  return response.data.data;
};

// 2. 수정 데이터 전송 (태그 배열 포함)
export const updateAdminSee = async (plcNo, data) => {
  // 🚀 data 객체 안에는 폼 데이터(plcName 등)와 tagCodes(배열)가 합쳐져서 JSON으로 날아감
  const response = await api.put(`/admin/see/${plcNo}`, data);
  return response.data;
};

// 3. 삭제 데이터 전송 (소프트 삭제)
export const deleteAdminPlace = async (type, plcNo) => {
  // 🚀 type이 'see'로 넘어오면 /api/admin/see/123 으로 DELETE 요청 전송
  const response = await api.delete(`/admin/${type}/${plcNo}`);
  return response.data;
};