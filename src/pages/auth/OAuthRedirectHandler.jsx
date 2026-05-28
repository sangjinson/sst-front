// src/pages/auth/OAuthRedirectHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값

export default function OAuthRedirectHandler() {

  const {getConfig, setConfig} = useConfig();   // Config 값 가져오기
  const navigate = useNavigate();
  // 🚀 비동기 통신 없이 전역 상태를 업데이트하기 위해 AuthContext의 login을 가져옴
  const { login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // 🚀 백엔드가 쿠키를 성공적으로 구웠다면, 이 페이지로 넘어왔을 때 
    // 로컬 스토리지 상태를 'true'로 만들고 강제로 새로고침 효과를 주어 
    // AuthContext의 초기화 로직(api.get('/auth/me'))이 돌게 만들거나,
    // 혹은 백엔드에서 쿼리파라미터로 넘겨준 최소 정보를 login() 함수에 넣어줄 수 있어.
    
    // 가장 깔끔한 방법: isLogin만 켜주고 메인으로 보낸다.
    // AuthContext가 알아서 백엔드의 /auth/me 를 찔러 정확한 유저 정보(memberRole 등)를 세팅함.
    localStorage.setItem('isLogin', 'true');
    // setConfig('user.isAuth', true); // 사이트의 로그인 처리
    
    // 혹시 백엔드에서 실패했을 때 ?error=true 같은 걸 달고 왔다면 예외 처리
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('error')) {
      alert('소셜 로그인 중 오류가 발생했습니다.');
      navigate('/login', { replace: true });
      return;
    }

    // 성공 처리: 메인 페이지로 이동하면서 이 정거장 페이지는 뒤로가기 기록에서 삭제(replace)
    navigate('/', { replace: true });
    
    // navigate 직후 window.location.reload()를 해주는 것도 좋은 방법이야.
    // AuthContext의 useEffect가 새로 마운트되면서 가장 확실하게 /auth/me를 호출하거든.
    window.location.reload(); 
    
  }, [navigate, location]);

  // 잠깐 스쳐 지나가는 페이지이므로 간단한 로딩 바나 스켈레톤을 보여줌
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 font-semibold">카카오 로그인 처리 중입니다...</p>
    </div>
  );
}