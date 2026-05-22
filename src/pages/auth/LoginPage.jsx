// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import api from '@api/axios'; 
import { useAuth } from '@hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // (기존 { memberEmail, memberPassword } 는 { memberEmail: memberEmail, memberPassword: memberPassword } 와 같아서 에러 발생)
      const payload = {
        mbrEmail: email,
        mbrPassword: password
      };

      const userData = await login(payload); 
      
      if (userData.memberRole === 'ROLE_ADMIN') {
        navigate('/admin'); // 🚀 관리자면 회원 목록 페이지(또는 대시보드)로 바로 이동
      } else {
        navigate('/'); // 🚀 일반 유저면 메인 페이지로 이동
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response && error.response.status === 401) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('로그인 처리 중 에러가 발생했습니다.');
      }
    }
  };

  // 🚀 추가: 카카오 로그인 버튼 클릭 핸들러
  const handleKakaoLogin = () => {
    // 🚀 주의: 백엔드 Spring Security 설정에 따라 주소가 다를 수 있어. 
    // 보통 Spring Security 기본값은 아래와 같아. 백엔드 코드 확인 후 맞춰줘!
    // 백엔드 주소로 아예 브라우저를 이동시킴 (CORS 이슈 없음)
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'; 
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap');
        .login-wrap { font-family: 'Pretendard', sans-serif; }
        @keyframes routeLine {
          0% { stroke-dashoffset: 720; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes routeDot {
          0% { transform: translateY(-18px) scale(0.65); opacity: 0; }
          55% { transform: translateY(0) scale(1.25); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes routeDotPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        @keyframes routeFlag {
          0% { transform: translateY(-18px) scale(0.92); opacity: 0; }
          70% { transform: translateY(3px) scale(1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-routeLine { animation: routeLine 1.4s ease-out 1.75s forwards; }
        .animate-routeDot { opacity: 0; animation: routeDot 0.45s ease-out forwards, routeDotPulse 1.6s ease-in-out 2.3s infinite; }
        .animate-routeFlag { opacity: 0; animation: routeFlag 0.45s ease-out 3.15s forwards; }
      `}</style>

      <div className="login-wrap min-h-screen bg-[#f8f6f0] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[1100px] min-h-[680px] rounded-[28px] overflow-hidden bg-white shadow-[0_24px_80px_rgba(43,74,72,0.14)] border border-white/70 flex">

          {/* 왼쪽: AI 코스 애니메이션 */}
          <div className="relative hidden md:flex w-[52%] bg-[#5cc7b2] items-center justify-center overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-px bg-white/20" />
            <div className="absolute left-12 top-28 w-24 h-24 border border-white/18 rounded-2xl" />
            <div className="absolute right-16 bottom-16 w-32 h-32 border border-white/16 rounded-2xl" />
            <div className="absolute left-16 bottom-28 w-16 h-16 bg-white/8 rounded-xl" />

            <Link to="/" className="absolute left-14 top-12 text-white/95 font-griun text-4xl drop-shadow-sm">
              거리에섯
            </Link>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-[360px] h-[180px] mb-12">
                <svg
                  viewBox="0 0 360 180"
                  className="absolute inset-0 w-full h-full"
                  fill="none"
                >
                  <path
                    d="M180 8 L300 66 L72 118 L270 164"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="720"
                    strokeDashoffset="720"
                    className="animate-routeLine"
                  />
                </svg>

                {[
                  { left: '172px', top: '0px', delay: '0s' },
                  { left: '292px', top: '58px', delay: '.45s' },
                  { left: '64px', top: '110px', delay: '.9s' },
                  { left: '262px', top: '156px', delay: '1.35s' },
                ].map((dot, index) => (
                  <div
                    key={index}
                    className="absolute w-4 h-4 rounded-full bg-white shadow-md animate-routeDot"
                    style={{
                      left: dot.left,
                      top: dot.top,
                      animationDelay: dot.delay,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-white opacity-40 animate-ping" />
                  </div>
                ))}

                <div className="absolute left-[264px] top-[119px] text-white animate-routeFlag">
                  <svg
                    viewBox="0 0 28 40"
                    className="h-14 w-10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6v28"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 7h15l-3.5 5L22 17H7V7z"
                      fill="currentColor"
                    />
                    <circle cx="6" cy="34" r="3" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div className="text-center text-white">
                <p className="text-4xl font-extrabold mb-4">AI Course Planner</p>
                <p className="text-base font-medium text-white/90">
                  저장한 장소를 이어서 나만의 여행 코스로 완성하세요
                </p>
              </div>
            </div>
          </div>

          {/* 오른쪽 로그인 */}
          <div className="w-full md:w-[48%] bg-white flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-[360px]">
              <div className="text-center mb-10">
                <Link to="/" className="inline-block md:hidden mb-7">
                  <h1 className="font-griun text-4xl text-gray-900" style={{ fontWeight: 'normal' }}>
                    거리에섯
                  </h1>
                </Link>
                <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
                  Login
                </h2>
                <p className="text-base text-gray-500">
                  로그인 후 저장한 일정을 AI 코스로 이어가세요
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[52px] rounded-full bg-[#f8f6f0] px-5 pr-12 text-base outline-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#0F9B73]/25"
                  />
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F9B73]/60" />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full h-[52px] rounded-full bg-[#f8f6f0] px-5 pr-12 text-base outline-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#0F9B73]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0F9B73]/60 hover:text-[#0F9B73] transition cursor-pointer"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-[#0F9B73]"
                    />
                    로그인 상태 유지
                  </label>
                  <button className="hover:text-[#0F9B73] transition cursor-pointer">
                    비밀번호 찾기
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full h-[52px] rounded-full bg-[#24B99F] text-white text-base font-bold ring-1 ring-[#24B99F]/20 hover:bg-[#5cc7b2] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  로그인
                </button>

                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  onClick={handleKakaoLogin}
                  className="w-full h-[52px] rounded-full bg-[#FEE500] text-gray-900 font-semibold text-base hover:brightness-95 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.6 4.2-2.8c.9.2 1.8.3 2.8.3 5.52 0 10-3.48 10-7.7S17.52 3 12 3z"/>
                  </svg>
                  카카오 로그인
                </button>

                <p className="text-center text-sm text-gray-400 pt-3">
                  계정이 없으신가요?{' '}
                  <Link to="/login/signup" className="text-gray-600 hover:text-[#0F9B73] font-semibold">
                    회원가입
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
