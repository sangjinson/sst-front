import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@api/axios'; 
import DaumPostcode from 'react-daum-postcode'; 
import ReqTextInput from '@components/modules/form/ReqTextInput';

const autoHyphenPhone = (value) => {
  const onlyNums = value.replace(/[^0-9]/g, '');
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7) return onlyNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
  return onlyNums.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
};

export default function SignupPage() {
  const navigate = useNavigate();

  // 1. 상태 통합 관리
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '', name: '', nickname: '', phone: '', zip: '', addr: '', daddr: ''
  });
  
  // 🚀 추가: 각 필드별 메시지(에러/성공) 상태 관리
  const [msg, setMsg] = useState({ email: '', nickname: '', password: '', global: '' });
  const [check, setCheck] = useState({ email: false, nickname: false });
  const [terms, setTerms] = useState({ all: false, service: false, privacy: false });
  
  // 🚀 추가: 비밀번호 보기 토글 상태
  const [showPw, setShowPw] = useState({ pw: false, confirm: false });
  const [isOpenPost, setIsOpenPost] = useState(false);

  // 🚀 추가: 비밀번호 일치 실시간 검사
  useEffect(() => {
    if (form.passwordConfirm) {
      if (form.password !== form.passwordConfirm) {
        setMsg(prev => ({ ...prev, password: '비밀번호가 일치하지 않습니다.' }));
      } else {
        setMsg(prev => ({ ...prev, password: '비밀번호가 일치합니다.' }));
      }
    } else {
      setMsg(prev => ({ ...prev, password: '' }));
    }
  }, [form.password, form.passwordConfirm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'phone' ? autoHyphenPhone(value) : value;

    setForm(prev => ({ ...prev, [name]: finalValue }));

    // 글자가 바뀌면 중복 확인 상태 초기화
    if (name === 'email' || name === 'nickname') {
      setCheck(prev => ({ ...prev, [name]: false }));
      setMsg(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheck = async (type) => {
    const value = form[type].trim();
    if (!value) {
      setMsg(prev => ({ ...prev, [type]: `${type === 'email' ? '이메일' : '닉네임'}을 입력해주세요.` }));
      return;
    }
    
    try {
      const response = await api.get(`/auth/check-${type}`, { params: { [type]: value } });
      const isDuplicate = response.data.data; 

      if (isDuplicate) {
        setMsg(prev => ({ ...prev, [type]: `이미 사용 중인 ${type === 'email' ? '이메일' : '닉네임'}입니다.` }));
        setCheck(prev => ({ ...prev, [type]: false }));
      } else {
        setMsg(prev => ({ ...prev, [type]: `사용 가능한 ${type === 'email' ? '이메일' : '닉네임'}입니다.` }));
        setCheck(prev => ({ ...prev, [type]: true }));
      }
    } catch (error) {
      setMsg(prev => ({ ...prev, [type]: '중복 확인 중 서버 에러가 발생했습니다.' }));
    }
  };

  const handleComplete = (data) => {
    let fullAddress = data.address; 
    let extraAddress = ''; 
    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) extraAddress += (extraAddress ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress ? ` (${extraAddress})` : '');
    }
    setForm(prev => ({ ...prev, zip: data.zonecode, addr: fullAddress }));
    setIsOpenPost(false);
  };

  const handleSignup = async () => {
    if (form.password !== form.passwordConfirm) return alert('비밀번호를 확인해주세요.');
    if (!check.email || !check.nickname) return alert('중복 확인을 진행해주세요.');
    if (!terms.service || !terms.privacy) return alert('필수 약관에 동의해주세요.');

    try {
      await api.post('/auth/signup', {
        mbrEmail: form.email,
        mbrPassword: form.password,
        mbrName: form.name,
        mbrNickname: form.nickname,
        mbrTelno: form.phone,
        mbrZip: form.zip,
        mbrAddr: form.addr,
        mbrDaddr: form.daddr
      });
      alert('회원가입 완료! 로그인해주세요.');
      navigate('/login'); 
    } catch (error) {
      // 🚀 백엔드 유효성 검사(@Valid) 실패 시 넘어오는 메시지를 매핑
      if (error.response?.status === 400 && error.response.data?.data) {
        const fieldErrors = error.response.data.data; // [{field: "mbrEmail", message: "이메일형식..."}]
        alert(`입력값을 확인해주세요: \n${fieldErrors.map(e => e.message).join('\n')}`);
      } else {
        setMsg(prev => ({ ...prev, global: error.response?.data?.message || '회원가입 실패' }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-[500px] bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-griun text-4xl cursor-pointer" onClick={() => navigate('/')}>거리에섯</h1>
          <p className="text-gray-500 mt-2 text-sm">회원가입하고 나만의 여행 일정을 짜보세요</p>
        </div>
        
        <div className="space-y-4">
          {/* 이메일 */}
          <div>
            <div className="flex gap-2">
              <ReqTextInput name="email" value={form.email} onChange={handleChange} placeholder="이메일" />
              <button onClick={() => handleCheck('email')} className="bg-[#0F9B73] text-white px-4 rounded-lg text-sm shrink-0">중복확인</button>
            </div>
            {/* 🚀 에러/성공 메시지 출력부 */}
            {msg.email && <p className={`text-xs mt-1 ${check.email ? 'text-[#0F9B73]' : 'text-red-500'}`}>{msg.email}</p>}
          </div>
          
          {/* 비밀번호 */}
          <div className="relative">
            <ReqTextInput type={showPw.pw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="비밀번호 (8~20자)" inputClassName="pr-12" />
            <button type="button" onClick={() => setShowPw(p => ({ ...p, pw: !p.pw }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {showPw.pw ? '숨김' : '보기'}
            </button>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <div className="relative">
              <ReqTextInput type={showPw.confirm ? 'text' : 'password'} name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} placeholder="비밀번호 확인" inputClassName="pr-12" />
              <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {showPw.confirm ? '숨김' : '보기'}
              </button>
            </div>
            {/* 🚀 비밀번호 일치 검사 결과 */}
            {msg.password && <p className={`text-xs mt-1 ${form.password === form.passwordConfirm ? 'text-[#0F9B73]' : 'text-red-500'}`}>{msg.password}</p>}
          </div>

          <ReqTextInput name="name" value={form.name} onChange={handleChange} placeholder="이름 (실명)" />

          {/* 닉네임 */}
          <div>
            <div className="flex gap-2">
              <ReqTextInput name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임 (2~10자)" />
              <button onClick={() => handleCheck('nickname')} className="bg-[#0F9B73] text-white px-4 rounded-lg text-sm shrink-0">중복확인</button>
            </div>
            {msg.nickname && <p className={`text-xs mt-1 ${check.nickname ? 'text-[#0F9B73]' : 'text-red-500'}`}>{msg.nickname}</p>}
          </div>

          <ReqTextInput name="phone" value={form.phone} onChange={handleChange} placeholder="전화번호 (숫자만 입력)" maxLength={13} />

          {/* 주소 (readOnly 적용 완료) */}
          <div className="flex gap-2">
            <ReqTextInput name="zip" value={form.zip} readOnly onClick={() => setIsOpenPost(true)} placeholder="우편번호" inputClassName="cursor-pointer bg-gray-50" />
            <button onClick={() => setIsOpenPost(true)} className="bg-gray-100 text-gray-700 px-4 rounded-lg text-sm font-semibold shrink-0">우편번호 찾기</button>
          </div>
          <ReqTextInput name="addr" value={form.addr} readOnly onClick={() => setIsOpenPost(true)} placeholder="기본 주소" inputClassName="cursor-pointer bg-gray-50" />
          <ReqTextInput name="daddr" value={form.daddr} onChange={handleChange} placeholder="상세 주소 (직접 입력)" />
        </div>

        {msg.global && <p className="text-red-500 text-sm mt-4 text-center">{msg.global}</p>}

        {/* 약관 동의 */}
        <div className="bg-gray-50 p-4 rounded-xl mt-6 mb-8 space-y-3">
          <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer">
            <input type="checkbox" checked={terms.all} onChange={(e) => {
              const c = e.target.checked; setTerms({ all: c, service: c, privacy: c });
            }} className="w-4 h-4 accent-[#0F9B73]" /> 전체 약관에 동의합니다.
          </label>
          <hr className="border-gray-200" />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={terms.service} onChange={(e) => setTerms(p => ({ ...p, service: e.target.checked, all: e.target.checked && p.privacy }))} className="w-4 h-4 accent-[#0F9B73]" /> [필수] 서비스 이용약관 동의
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={terms.privacy} onChange={(e) => setTerms(p => ({ ...p, privacy: e.target.checked, all: p.service && e.target.checked }))} className="w-4 h-4 accent-[#0F9B73]" /> [필수] 개인정보 수집 및 이용 동의
          </label>
        </div>

        <button onClick={handleSignup} className="w-full py-4 bg-[#0F9B73] rounded-xl text-white font-bold text-base hover:bg-[#0d8a66] transition">
          가입하기
        </button>
        <p className="text-center text-sm text-gray-400 mt-6">
          이미 계정이 있으신가요? <Link to="/login" className="text-[#0F9B73] font-semibold hover:underline">로그인</Link>
        </p>
      </div>

      {isOpenPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-lg relative animate-[slideDown_0.3s_ease-out_forwards]">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">주소 검색</h3>
              <button onClick={() => setIsOpenPost(false)} className="text-gray-400 hover:text-gray-800 text-xl font-bold">✕</button>
            </div>
            <DaumPostcode onComplete={handleComplete} className="w-full h-[400px]" />
          </div>
        </div>
      )}
    </div>
  );
}