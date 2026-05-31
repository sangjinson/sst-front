// api.js
import axiosInstance from './axiosInstance';

// 백엔드 엔드포인트 관리
export const travelApi = {
  // AI 기반 여행 일정 생성
  generateItinerary: (preferences) => axiosInstance.post('/itinerary/generate', preferences),
  // 여행지 목록 조회
  getPlaces: () => axiosInstance.get('/places'),
  // 사용자 정보 조회
  getUserProfile: () => axiosInstance.get('/user/profile'),
};