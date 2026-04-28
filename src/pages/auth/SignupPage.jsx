// src/pages/auth/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const handleAgreeAll = (checked) => {
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  const handleSignup = () => {
    if (!email || !password || !passwordConfirm || !nickname || !name || !birthdate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreeService || !agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#0F9B73] transition-colors placeholder-gray-400";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap');
        .signup-wrap { font-family: 'Pretendard', sans-serif; }
      `}</style>

      <div className="signup-wrap min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm p-8">

          {/* ✅ 로고 - 클릭하면 랜딩페이지로 */}
          <div className="text-center mb-6">
            <Link to="/">
              <h1 className="font-griun text-4xl font-black text-gray-900 cursor-pointer hover:opacity-80 transition">
                거리에섯
              </h1>
            </Link>
          </div>

          {/* 회원가입 타이틀 */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#0F9B73] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
          </div>

          {/* 이메일 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">이메일</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button className="w-full mt-2 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              인증요청
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={() => setShowPasswordConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPasswordConfirm
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* 닉네임 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">닉네임</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button className="shrink-0 px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition whitespace-nowrap">
                중복 인증
              </button>
            </div>
          </div>

          {/* 성별 + 내/외국인 */}
          <div className="mb-3 flex gap-2">
            {['남', '여'].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border transition ${
                  gender === g
                    ? 'bg-[#0F9B73] text-white border-[#0F9B73]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0F9B73]'
                }`}
              >
                {g}
              </button>
            ))}
            {['내국인', '외국인'].map((n) => (
              <button
                key={n}
                onClick={() => setNationality(n)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border transition ${
                  nationality === n
                    ? 'bg-[#0F9B73] text-white border-[#0F9B73]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#0F9B73]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* 이름 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">이름</label>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* 생년월일 */}
          <div className="mb-6">
            <label className="text-xs text-gray-500 mb-1 block">생년월일 8자리</label>
            <input
              type="text"
              placeholder="생년월일 8자리"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              maxLength={8}
              className={inputClass}
            />
          </div>

          {/* 약관 동의 */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="border border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={agreeService} onChange={(e) => setAgreeService(e.target.checked)} className="w-4 h-4 accent-[#0F9B73]" />
                <span className="text-sm font-semibold text-gray-700">서비스 이용약관 <span className="text-red-500">필수</span></span>
              </label>
              <p className="text-xs text-gray-400 ml-6">수집 목적: 서비스 이용, 계정 관리, 부정 이용 방지, 동의 고객에 한합니다.</p>
              <button className="text-xs text-gray-400 ml-6 mt-1 underline bg-transparent border-none cursor-pointer">동의</button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="w-4 h-4 accent-[#0F9B73]" />
                <span className="text-sm font-semibold text-gray-700">개인정보 수집 및 이용 동의 <span className="text-red-500">필수</span></span>
              </label>
              <p className="text-xs text-gray-400 ml-6">수집 항목: 이름, 이메일, 닉네임, 생년월일, 이용내역 등</p>
              <button className="text-xs text-gray-400 ml-6 mt-1 underline bg-transparent border-none cursor-pointer">동의</button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} className="w-4 h-4 accent-[#0F9B73]" />
                <span className="text-sm font-semibold text-gray-700">마케팅 수신 동의 <span className="text-gray-400 font-normal">선택</span></span>
              </label>
              <p className="text-xs text-gray-400 ml-6">이용목적: 할인 쿠폰이나 이벤트 등의 마케팅 정보를 발송합니다.</p>
              <div className="flex items-center gap-3 ml-6 mt-1">
                <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                </label>
                <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
                className="w-4 h-4 accent-[#0F9B73]"
              />
              <span className="text-sm font-semibold text-gray-700">약관 전체 동의하기</span>
            </label>
          </div>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSignup}
            className="w-full py-4 bg-[#0F9B73] text-white rounded-xl text-base font-bold hover:bg-[#0d8a66] transition"
          >
            회원가입 완료
          </button>

        </div>
      </div>
    </>
  );
}