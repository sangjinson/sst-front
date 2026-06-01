// aiAxios.js
import axios from 'axios';

const AI_API_URL = (import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8090').replace(/\/+$/, '');

const aiApi = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const redirectToServerError = () => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/500') return;

  window.location.href = '/500';
};

aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      redirectToServerError();
    }

    return Promise.reject(error);
  }
);

export default aiApi;
