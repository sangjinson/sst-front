// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '@api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🚀 포인트 1: 초기값을 localStorage에서 읽어옵니다.
  // 이렇게 하면 새로고침 직후에도 'isLogin' 값만큼은 즉시 살아납니다.
  const [user, setUser] = useState(() => {
    const savedLogin = localStorage.getItem('isLogin');
    return savedLogin === 'true' ? { role: 'USER' } : null; 
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 🚀 포인트 2: 새로고침 시 백엔드에 쿠키가 유효한지 물어봅니다. (/auth/me 또는 /auth/refresh)
        const response = await api.get('/auth/me'); 
        setUser(response.data); // 서버에 저장된 실제 유저 정보로 업데이트
        localStorage.setItem('isLogin', 'true');
      } catch (error) {
        // 토큰이 만료되었거나 없다면 로그아웃 처리
        setUser(null);
        localStorage.removeItem('isLogin');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem('isLogin', 'true');
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('isLogin');
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};