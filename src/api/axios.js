// axios.js
import axios from 'axios';

// 🚀 1. Vite 환경변수 적용 (CRA의 process.env 대신 import.meta.env 사용)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`, // 🚀 직접 백엔드를 찌르도록 수정
  withCredentials: true, // 🚀 쿠키 전송 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// 서버 장애 계열 응답은 공통 500 에러 페이지로 보낸다.
// 이미 /500 페이지에 있는 경우에는 무한 리다이렉트를 막기 위해 아무 것도 하지 않는다.
const redirectToServerError = () => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/500') return;

  window.location.href = '/500';
};

// access token 만료로 여러 요청이 동시에 401을 받았을 때,
// refresh 요청은 한 번만 보내고 나머지 요청은 큐에 대기시킨다.
let isRefreshing = false;
let failedQueue = [];

// refresh 성공/실패 후 대기 중이던 요청들을 한꺼번에 재개하거나 실패 처리한다.
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => config, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 로그인/토큰 재발급 요청 자체가 실패한 경우에는 여기서 다시 refresh를 시도하지 않는다.
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // 401 응답은 access token 만료로 보고 refresh 후 원래 요청을 한 번만 재시도한다.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 중이면 현재 요청은 큐에 넣고 refresh 완료 후 다시 실행한다.
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest)).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // 만료 알럿 띄우기 및 로컬 플래그 강제 삭제
        if (!originalRequest.url?.includes('/auth/me')) {
          alert('보안을 위해 로그인이 만료되었습니다. 다시 로그인해 주세요.');
          localStorage.removeItem('isLogin'); // 🚀 React Query가 다음번엔 찌르지 않도록 차단
          window.location.href = '/login'; 
        }
        
        // React Query의 fetchUser나 mutation이 catch 블록으로 넘어갈 수 있도록 반드시 Reject
        return Promise.reject(refreshError);
      }
    }

    // 400 계열은 각 화면의 폼 검증/토스트에서 처리하고,
    // 500 이상 서버 오류만 공통 에러 페이지로 이동시킨다.
    if (error.response?.status >= 500) {
      redirectToServerError();
    }

    return Promise.reject(error);
  }
);

export default api;

