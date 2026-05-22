import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('인증이 만료되었거나 유효하지 않습니다. 로그인 페이지로 유도합니다.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;