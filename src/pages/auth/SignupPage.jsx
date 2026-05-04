// src/pages/auth/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api/axios'; 
// 🚀 1. Daum 우편번호 컴포넌트 임포트
import DaumPostcode from 'react-daum-postcode'; 

export default function SignupPage() {
  const navigate = useNavigate();

  // 🚀 프론트엔드 상태 관리를 위한 직관적인 변수명
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  
  // 🚀 백엔드 필수값 대응을 위한 주소 상태
  const [zip, setZip] = useState('');
  const [addr, setAddr] = useState('');
  const [daddr, setDaddr] = useState('');

  // UI 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 🚀 주소 검색 모달 표시 여부 상태
  const [isOpenPost, setIsOpenPost] = useState(false);

  // 전체 동의 체크박스 핸들러
  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeService(checked);
    setAgreePrivacy(checked);
  };

  // 개별 체크박스 변동 시 전체 동의 상태 업데이트
  const handleSingleAgree = (setter, checked) => {
    setter(checked);
    if (!checked) setAgreeAll(false);
  };

  // 🚀 Daum 우편번호 검색 완료 핸들러
  const handleComplete = (data) => {
    let fullAddress = data.address; 
    let extraAddress = ''; 

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) extraAddress += (extraAddress ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress ? ` (${extraAddress})` : '');
    }

    setZip(data.zonecode);
    setAddr(fullAddress);
    setIsOpenPost(false); // 선택 후 모달 닫기
  };

  // 🚀 회원가입 처리 로직
  const handleSignup = async () => {
    // 프론트엔드 단 유효성 검사 (주소 필수값 포함)
    if (!email || !password || !name || !nickname || !phone || !zip || !addr) {
      alert('모든 필수 항목을 입력해주세요.');
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

    try {
      // 🚀 백엔드 SignUpRequest.java 필드명에 완벽하게 맞춰서 payload 맵핑
      const payload = {
        mbrEmail: email,
        mbrPassword: password,
        mbrNm: name,
        mbrNickname: nickname,
        telno: phone,
        zip: zip,
        addr: addr,
        daddr: daddr
      };

      await api.post('/auth/signup', payload);

      alert('회원가입이 완료되었습니다. 로그인해주세요!');
      navigate('/login'); 

    } catch (error) {
      // 백엔드 GlobalException 처리
      if (error.response) {
        if (error.response.status === 409) { 
          alert('이미 사용 중인 이메일입니다.');
        } else if (error.response.status === 400) { 
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 relative">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm p-10">
        
        {/* 헤더 로고 영역 */}
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="font-griun text-4xl text-gray-900 cursor-pointer hover:opacity-80 transition">
              거리에섯
            </h1>
          </Link>
          <p className="text-gray-500 mt-2">회원가입하고 나만의 여행 일정을 짜보세요</p>
        </div>

        {/* 이메일 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="email"
            placeholder="이메일 (예: user@sst.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-4 border-b border-gray-300 flex items-center pb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 (8~20자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
            {showPassword ? '숨김' : '보기'}
          </button>
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-4 border-b border-gray-300 flex items-center pb-3">
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
        {passwordConfirm && password !== passwordConfirm && (
          <p className="text-red-500 text-xs mb-4 -mt-2">비밀번호가 일치하지 않습니다.</p>
        )}

        {/* 이름 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="이름 (실명)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 닉네임 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="닉네임 (2~10자)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 전화번호 */}
        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 🚀 주소 입력 영역 (Daum 연동) */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="우편번호"
            value={zip}
            readOnly // 🚀 수동 입력 방지
            onClick={() => setIsOpenPost(true)}
            className="flex-1 border-b border-gray-300 outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent pb-3 cursor-pointer"
          />
          <button 
            onClick={() => setIsOpenPost(true)} 
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            우편번호 찾기
          </button>
        </div>

        <div className="mb-4 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="기본 주소"
            value={addr}
            readOnly // 🚀 수동 입력 방지
            onClick={() => setIsOpenPost(true)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent cursor-pointer"
          />
        </div>

        <div className="mb-8 border-b border-gray-300 pb-3">
          <input
            type="text"
            placeholder="상세 주소 (직접 입력)"
            value={daddr}
            onChange={(e) => setDaddr(e.target.value)}
            className="w-full outline-none text-base text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* 약관 동의 */}
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

        {/* 가입 버튼 */}
        <button 
          onClick={handleSignup} 
          className="w-full py-4 bg-[#0F9B73] rounded-xl text-white font-bold text-base hover:bg-[#0d8a66] transition"
        >
          가입하기
        </button>

        {/* 로그인 링크 */}
        <p className="text-center text-sm text-gray-400 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-[#0F9B73] font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>

      {/* 🚀 Daum Postcode 모달 */}
      {isOpenPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl relative animate-[slideDown_0.3s_ease-out_forwards]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">주소 검색</h3>
              <button 
                onClick={() => setIsOpenPost(false)}
                className="text-gray-400 hover:text-gray-800 text-2xl font-bold p-1 leading-none transition"
              >
                ✕
              </button>
            </div>
            <DaumPostcode 
              onComplete={handleComplete} 
              className="w-full h-[500px]" 
            />
          </div>
        </div>
      )}
    </div>
  );
}