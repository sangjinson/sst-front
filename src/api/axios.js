import axios from 'axios';


const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 자동 전송 허용
});

// 토큰 갱신 진행 여부를 판별하는 플래그
let isTokenRefreshing = false;
// 토큰 갱신을 기다리는 요청들의 대기열(Queue)
let refreshSubscribers = [];

// 대기열에 있는 요청들을 실행하는 함수
const onTokenRefreshed = (error) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = []; // 실행 후 대기열 초기화
};

// 갱신 중일 때 들어온 요청을 대기열에 추가하는 함수
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚀 수정: '/auth/me'는 제외하고, 오직 로그인 시도와 리프레시 요청 자체에서 난 에러만 reject 처리
    // URL에 '/auth/login' 이나 '/auth/refresh'가 포함되어 있을 때만 방어막 작동
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // 🚀 백엔드 GlobalException을 수정했으므로, 이제 여기서 401을 정상적으로 캐치해서 재발급 로직을 탑니다.
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 1. 토큰 갱신 중이 아니라면 갱신 요청 시작
      if (!isTokenRefreshing) {
        isTokenRefreshing = true;

        try {
          // 🚀 백엔드에 토큰 갱신 요청 (Refresh Token 쿠키가 자동으로 넘어감)
          await axios.post('/api/auth/refresh', {}, { 
            withCredentials: true 
          });

          // 갱신 성공!
          isTokenRefreshing = false;
          onTokenRefreshed(null); // 기다리던 원본 요청들 재실행
          
        } catch (refreshError) {
          isTokenRefreshing = false;
          onTokenRefreshed(refreshError); 
          
          alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      }

      // 2. 토큰 갱신 중이라면 대기
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(api(originalRequest));
          }
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;