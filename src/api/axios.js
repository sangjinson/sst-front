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

let isRefreshing = false;
let failedQueue = [];

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
    
    // 인증 처리 일때 실패한다면 에러 발생으로 중지.
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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
          localStorage.removeItem('isLogin');
          window.location.href = '/login'; 
        }
        
        // React Query의 fetchUser나 mutation이 catch 블록으로 넘어갈 수 있도록 반드시 Reject
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;