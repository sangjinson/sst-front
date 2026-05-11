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

    // 무한 루프 방지: 로그인이나 리프레시 API 자체의 401은 가로채지 않음
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
        // 🚀 명시적인 백엔드 주소로 리프레시 요청
        await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });

        isRefreshing = false;
        processQueue(null);

        // 성공하면 원래 실패했던 API 재요청
        return api(originalRequest);
        
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // 🚀 2. 핵심 수정: 원래 요청이 '/auth/me'(초기 로드 검증)였다면, 
        // 이 사용자는 단순 비로그인(게스트)이므로 알럿을 띄우거나 로그인 창으로 강제 이동시키지 않습니다!
        if (!originalRequest.url?.includes('/auth/me')) {
          alert('보안을 위해 로그인이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login'; 
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;