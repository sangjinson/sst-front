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
  (response) => {
    // 정상 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🚀 에러가 401(만료)이고, 이전에 재시도한 적이 없는 요청일 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지용 플래그

      // 1. 토큰 갱신 중이 아니라면 갱신 요청 시작
      if (!isTokenRefreshing) {
        isTokenRefreshing = true;

        try {
          // 백엔드에 토큰 갱신 요청 (Refresh Token 쿠키가 자동으로 넘어감)
          // 주의: 여기서 api 인스턴스를 쓰면 인터셉터를 또 타게 되므로 기본 axios를 사용합니다.
          await axios.post('/api/auth/refresh', {}, { 
            withCredentials: true 
          });

          // 갱신 성공!
          isTokenRefreshing = false;
          onTokenRefreshed(null); // 기다리던 원본 요청들 재실행
          
        } catch (refreshError) {
          // Refresh Token마저 만료되었거나 갱신 실패 시
          isTokenRefreshing = false;
          onTokenRefreshed(refreshError); 
          
          alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login'; // 로그인 페이지로 튕겨내기
          return Promise.reject(refreshError);
        }
      }

      // 2. 토큰 갱신 중이라면, 갱신이 끝날 때까지 기다렸다가 원본 요청을 다시 실행 (Promise 반환)
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((err) => {
          if (err) {
            reject(err);
          } else {
            // 갱신 완료 후, 실패했던 원래 요청(originalRequest)을 다시 보냄
            resolve(api(originalRequest));
          }
        });
      });
    }

    // 401 에러가 아니거나 재시도해도 안 되는 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default api;