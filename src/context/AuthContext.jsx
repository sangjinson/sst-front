// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '@api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  // 🚀 수정 1: 초기값의 권한 이름을 백엔드 DTO와 ProtectedRoute에 맞춰 'memberRole'로 변경!
  const [user, setUser] = useState(() => {
    const savedLogin = localStorage.getItem('isLogin');
    // 🚀 수정: 백엔드가 주는 실제 데이터 형태와 완벽히 맞추기 위해 'ROLE_USER'로 변경
    return savedLogin === 'true' ? { memberRole: 'ROLE_USER' } : null; 
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      // 🚀 방어막 1: 애초에 로그인한 적이 없으면 백엔드에 /me 요청 자체를 안 함!
      if (localStorage.getItem('isLogin') !== 'true') {
        setUser(null);
        setLoading(false);
        return; // 여기서 함수 종료
      }

      try {
        const response = await api.get('/auth/me'); 
        setUser(response.data.data); 
        localStorage.setItem('isLogin', 'true');
      } catch (error) {
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