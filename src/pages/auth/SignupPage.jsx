// src/pages/auth/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api/axios'; // 🚀 Axios 인스턴스 임포트

export default function SignupPage() {
  const navigate = useNavigate();

  // 🚀 수정: 백엔드 SignUpRequest.java DTO와 완벽하게 필드명을 일치시킴
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberNickname, setMemberNickname] = useState('');
  const [memberPhone, setMemberPhone] = useState(''); // phone -> memberPhone으로 변경

  // UI 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 🚀 전체 동의 체크박스 핸들러
  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
  };

  // 🚀 개별 체크박스 변동 시 전체 동의 상태 업데이트
  const handleSingleAgree = (setter, checked) => {
    setter(checked);
    if (!checked) setAgreeAll(false);
  };

  // 🚀 회원가입 처리 로직
  const handleSignup = async () => {
    // 1. 프론트엔드 단 유효성 검사
    if (!memberEmail || !memberPassword || !memberName || !memberNickname || !memberPhone) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (memberPassword !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreeService || !agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    try {
      // 🚀 백엔드로 POST 요청. DTO 필드명과 일치하는 JSON 객체 전송
      await api.post('/auth/signup', {
        memberEmail,
        memberPassword,
        memberName,
        memberNickname,
        memberPhone
      });

      alert('회원가입이 완료되었습니다. 로그인해주세요!');
      navigate('/login'); // 가입 성공 시 로그인 페이지로 이동

    } catch (error) {
      // 🚀 백엔드의 GlobalException.java에서 넘어오는 에러 메시지 처리
      if (error.response) {
        if (error.response.status === 409) { // ErrorCode.DUPLICATE_EMAIL
          alert('이미 사용 중인 이메일입니다.');
        } else if (error.response.status === 400) { // @Valid 유효성 검사 실패
          // Validation 에러의 경우 배열 형태로 올 수 있으므로 첫 번째 에러 메시지 출력
          const msg = error.response.data.data?.[0]?.message || error.response.data.message;
          alert(`입력값을 확인해주세요: ${msg}`);
        } else {
          alert(error.response.data.message || '회원가입 중 오류가 발생했습니다.');
        }
      } else {
        alert('서버와 통신할 수 없습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm p-10">
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="font-griun text-4xl text-gray-900 cursor-pointer hover:opacity-80 transition">
              거리에섯
            </h1>
          </Link>
          <p className="text-gray-500 mt-2">회원가입하고 나만의 여행 일정을 짜보세요</p>
        </div>

        {/* 🚀 이메일 입력 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="email"
            placeholder="이메일 (예: user@sst.com)"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 🚀 비밀번호 입력 */}
        <div className="mb-4 border-b border-gray-300 flex items-center pb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 (8~20자)"
            value={memberPassword}
            onChange={(e) => setMemberPassword(e.target.value)}
            className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
            {showPassword ? '숨김' : '보기'}
          </button>
        </div>

        {/* 🚀 비밀번호 확인 */}
        <div className="mb-4 border-b border-gray-300 flex items-center pb-3">
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
        {passwordConfirm && memberPassword !== passwordConfirm && (
          <p className="text-red-500 text-xs mb-4 -mt-2">비밀번호가 일치하지 않습니다.</p>
        )}

        {/* 🚀 이름 입력 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="이름 (실명)"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 🚀 닉네임 입력 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="닉네임 (2~10자)"
            value={memberNickname}
            onChange={(e) => setMemberNickname(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 🚀 전화번호 입력 */}
        <div className="mb-8 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={memberPhone}
            onChange={(e) => setMemberPhone(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 🚀 약관 동의 */}
        <div className="bg-gray-50 p-4 rounded-xl mb-8 space-y-3">
          <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer">
            <input type="checkbox" checked={agreeAll} onChange={handleAgreeAll} className="w-4 h-4 accent-[#0F9B73]" />
            전체 약관에 동의합니다.
          </label>
          <hr className="border-gray-200" />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={agreeService} onChange={(e) => handleSingleAgree(setAgreeService, e.target.checked)} className="w-4 h-4 accent-[#0F9B73]" />
            [필수] 서비스 이용약관 동의
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={agreePrivacy} onChange={(e) => handleSingleAgree(setAgreePrivacy, e.target.checked)} className="w-4 h-4 accent-[#0F9B73]" />
            [필수] 개인정보 수집 및 이용 동의
          </label>
        </div>

        <button 
          onClick={handleSignup} 
          className="w-full py-4 bg-[#0F9B73] rounded-xl text-white font-bold text-base hover:bg-[#0d8a66] transition"
        >
          가입하기
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[#0F9B73] font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}