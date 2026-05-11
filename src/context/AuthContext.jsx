import React, { createContext, useState, useEffect } from 'react';
import api from '@api/axios'; // 🚀 위에서 세팅한 인터셉터가 달린 axios 인스턴스

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🚀 1. 로컬 스토리지 의존성 완전 제거. 초기값은 무조건 null로 시작합니다.
  const [user, setUser] = useState(null);
  
  // 🚀 2. 로딩 상태를 true로 두어, 백엔드 검증이 끝나기 전까지 UI 렌더링을 멈춥니다 (깜빡임 방지).
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 백엔드에 쿠키 검증 요청 (만료 시 인터셉터가 조용히 연장 시도)
        const response = await api.get('/auth/me'); 
        setUser(response.data.data); 
      } catch (error) {
        // 🚀 인터셉터에서 '/auth/me'의 갱신 실패를 조용히 에러로 던지면 여기로 떨어집니다.
        // 즉, 게스트이거나 완전히 로그아웃된 사용자이므로 user를 null로 둡니다.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData) => {
    // 🚀 로그인 성공 시 백엔드에서 쿠키는 이미 구워졌으므로, 전역 상태만 꽂아줍니다.
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 🚀 백엔드에 요청해 브라우저의 JWT 쿠키를 만료(Max-Age=0)시킵니다.
      await api.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setUser(null);
      window.location.href = '/'; // 메인 페이지로 이동
    }
  };

  const localLogout = () => {
    localStorage.removeItem('isLogin');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout,localLogout }}>
      {/* 🚀 검증 중일 때는 빈 화면이나 로딩 바를 보여주어 잘못된 라우트 튕김을 막습니다. */}
      {loading ? <div className="h-screen flex items-center justify-center font-bold text-gray-500">인증 정보를 확인 중입니다...</div> : children}
    </AuthContext.Provider>
  );
};