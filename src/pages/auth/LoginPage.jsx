// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api/axios'; 

export default function LoginPage() {
  const navigate = useNavigate();
  
  // 🚀 DTO 필드명과 일치하도록 상태명 변경
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // 간단한 프론트엔드 유효성 검사
    if (!memberEmail.trim() || !memberPassword.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 🚀 백엔드 LoginRequest DTO 구조에 정확히 맞춰서 전송
      const response = await api.post('/auth/login', {
        memberEmail: memberEmail,
        memberPassword: memberPassword
      });

      console.log('로그인 성공:', response.data);
      navigate('/');
      
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response && error.response.status === 401) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.response && error.response.data.message) {
        // 백엔드에서 보낸 validation 메시지가 있을 경우 출력
        alert(error.response.data.message);
      } else {
        alert('로그인 처리 중 에러가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap');
        .login-wrap { font-family: 'Pretendard', sans-serif; }
      `}</style>

      <div className="login-wrap min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm p-10">

          {/* 로고 */}
          <div className="text-center mb-10">
            <Link to="/">
              <h1 className="font-griun text-5xl text-gray-900 cursor-pointer hover:opacity-80 transition" style={{ fontWeight: 'normal' }}>
                거리에섯
              </h1>
            </Link>
          </div>

          {/* 이메일 입력 (DTO: memberEmail) */}
          <div className="mb-6 border-b border-gray-300 flex items-center pb-3">
            <input
              type="email" // 🚀 이메일 형식으로 변경
              placeholder="이메일 주소"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          {/* 비밀번호 입력 (DTO: memberPassword) */}
          <div className="mb-4 border-b border-gray-300 flex items-center pb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={memberPassword}
              onChange={(e) => setMemberPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button onClick={() => setShowPassword((prev) => !prev)} className="text-gray-400 hover:text-gray-600 transition">
              {showPassword ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 shadow-none" />
              로그인 상태 유지
            </label>
            <button className="text-sm text-gray-500 hover:text-gray-700">비밀번호 찾기</button>
          </div>

          <button className="w-full py-4 bg-[#FEE500] rounded-xl text-gray-900 font-bold text-base flex items-center justify-center gap-2 mb-3 hover:bg-[#f0d800] transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.6 4.2-2.8c.9.2 1.8.3 2.8.3 5.52 0 10-3.48 10-7.7S17.52 3 12 3z"/>
            </svg>
            카카오로 로그인
          </button>

          <button onClick={handleLogin} className="w-full py-4 bg-gray-100 rounded-xl text-gray-700 font-bold text-base hover:bg-gray-200 transition mb-6">
            로그인
          </button>

          <p className="text-center text-sm text-gray-400">
            계정이 없으신가요?{' '}
            <Link to="/login/signup" className="text-[#0F9B73] font-semibold hover:underline">
              회원가입
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}