// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚧 [수정됨] 프론트엔드 UI 개발을 위해 무조건 로그인된 것으로 강제 설정
    const checkToken = () => {
      // 로컬 스토리지 검사를 잠시 무시하고 강제로 유저 정보를 세팅합니다.
      setUser({ id: 1, name: '홍길동', role: 'USER' });
      setLoading(false);
    };
    
    setTimeout(checkToken, 300);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};