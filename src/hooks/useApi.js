import { useState, useCallback, useMemo } from 'react';
import api from '@api/axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, fullResponse = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall();
      return fullResponse ? res : res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // useMemo를 사용하여 참조값을 고정!
  const services = useMemo(() => ({
    // 로그인 인증 관련
    fetchMe: () => execute(() => api.get('/auth/me')),
    // 로그인
    login: (creds) => execute(() => api.post('/auth/login', creds), false),
    logout: () => execute(() => api.post('/auth/logout'), false),

    // 먹거리 리스트 불러오기
    //getFoodList: (rgnCd) => execute(() => api.get('/api/food/list', { params: { rgnCd } })),

    // ----------------------------------------
    // 프로필 관련 API
    // ----------------------------------------
    
    // 프로필 정보 불러오기
    getProfile : () => execute(() => api.get('/member/me')), 

    // 닉네임 중복 확인
    checkNickname: (nickname) => execute(() => api.get('/auth/check-nickname', { params: { nickname } })),

    // 프로필 정보 업데이트
    updateProfile: (formData) => execute(() => api.post('/member/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }), true),

    // 회원 탈퇴
    withdrawMember: (payload) => execute(() => api.delete('/member/me', { data: payload })),

    // ----------------------------------------
    // 리뷰 관련 API
    // ----------------------------------------
    // 리뷰 목록 조회 (GET /reviews?plcNo={plcNo})
    getReviews: (plcNo) => execute(() => api.get('/reviews', { params: { plcNo } })),

    // 리뷰 등록 (POST /reviews)
    createReview: (payload) => execute(() => api.post('/reviews', payload)),

    // 리뷰 수정 (PUT /reviews/{rvwNo})
    updateReview: (rvwNo, payload) => execute(() => api.put(`/reviews/${rvwNo}`, payload)),

    // 리뷰 삭제 (DELETE /reviews/{rvwNo})
    deleteReview: (rvwNo, payload) => execute(() => api.delete(`/reviews/${rvwNo}`, { data: payload })),

    // ----------------------------------------
    // 커뮤니티 관련 API
    // ----------------------------------------
    // 커뮤니티 상세 조회 (GET /community/{id})
    getCommunityDetail: (id) => execute(() => api.get(`/community/${id}`), true),


  }), [execute]);

  return { loading, error, ...services };
};