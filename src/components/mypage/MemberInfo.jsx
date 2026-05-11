import React, { useState, useEffect, useRef } from 'react';
import api from '@api/axios';
import { useAuth } from '@hooks/useAuth';
// 🚀 모달용 컴포넌트 임포트
import PasswordChange from './PasswordChange'; 

const MemberInfo = ({ profile, onUpdate, profileImg, onImgChange }) => {
  const imgRef = useRef(null);
  
  // 🚀 전역 유저 정보 가져오기 (providerCd 확인용)
  const { user } = useAuth();
  
  // 🚀 모달 열림/닫힘 상태 관리 (기본값 false로 설정하여 처음엔 안 보이게!)
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  // 폼 상태
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
  });

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState('');

  // 부모 데이터 동기화
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        nickname: profile.nickname || '',
        phone: profile.phone || '',
        zipcode: profile.zipcode || '',
        address: profile.address || '',
        detailAddress: profile.detailAddress || '',
      });
    }
  }, [profile]);

  // 전화번호 자동 하이픈
  const autoHyphenPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    const limitedNums = onlyNums.slice(0, 11);

    if (limitedNums.length <= 3) {
      return limitedNums;
    } else if (limitedNums.length <= 7) {
      return limitedNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    } else {
      return limitedNums.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const formatted = autoHyphenPhone(value);
      setForm(prev => ({ ...prev, [name]: formatted }));
      return; 
    }
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMsg('');
    }
  };

  const handleNicknameCheck = async () => {
    const trimmedNickname = form.nickname.trim();
    if (!form.nickname.trim()) { alert('닉네임을 입력해주세요.'); return; }
    if (trimmedNickname === profile.nickname) {
      setNicknameMsg('현재 사용 중인 회원님의 닉네임입니다.');
      setNicknameChecked(true); 
      return; 
    }
    if (form.nickname.trim().length < 2) { alert('닉네임은 2자 이상이어야 합니다.'); return; }

    try {
      const response = await api.get(`/auth/check-nickname`, {
        params: { nickname: trimmedNickname }
      });
      const isDuplicate = response.data.data; 

      if (isDuplicate) {
        setNicknameMsg('이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      } else {
        setNicknameMsg('사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      }
    } catch (error) {
      alert('중복 확인 중 서버 에러가 발생했습니다.');
    }
  };

  const handleAddressSearch = () => {
    if (!window.daum) { alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.'); return; }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm(prev => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
          detailAddress: '',
        }));
      },
    }).open();
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert('이름을 입력해주세요.'); return; }
    if (!form.nickname.trim()) { alert('닉네임을 입력해주세요.'); return; }
    if (!form.phone.trim()) { alert('전화번호를 입력해주세요.'); return; }

    const isUnchanged = (
      form.name === profile.name &&
      form.nickname === profile.nickname &&
      form.phone === profile.phone &&
      form.zipcode === profile.zipcode &&
      form.address === profile.address &&
      form.detailAddress === profile.detailAddress
    );

    if (isUnchanged) { alert('변경된 정보가 없습니다.'); return; }
    if (form.nickname !== profile.nickname && !nicknameChecked) { alert('닉네임 중복 확인을 진행해주세요.'); return; }

    try {
      const payload = {
        mbrName: form.name,
        mbrNickname: form.nickname,
        mbrTelno: form.phone,
        mbrZip: form.zipcode,
        mbrAddr: form.address,
        mbrDaddr: form.detailAddress
      };

      await api.post('/member/me', payload);

      onUpdate({ 
        ...profile, 
        name: form.name, 
        nickname: form.nickname, 
        phone: form.phone,
        zipcode: form.zipcode,
        address: form.address,
        detailAddress: form.detailAddress
      });

      alert('회원정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('입력값을 다시 확인해주세요.');
      } else {
        alert('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="p-4 md:p-7 relative">
      <h3 className="fs-up-3 font-bold text-gray-700 mb-4">회원 정보 수정</h3>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7 order-2 md:order-4" />

      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24">
          <img src={profileImg} alt="프로필" className="w-24 h-24 rounded-full object-cover border-[3px] border-[#0F9B73]" />
          <button type="button" onClick={() => imgRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-[#0F9B73] rounded-full flex items-center justify-center shadow-md hover:bg-[#0d8a66] transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={onImgChange} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-200 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">이름 *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">전화번호 *</label>
            <input name="phone" value={form.phone} onChange={handleChange} maxLength={13} placeholder="숫자만 입력해주세요" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs text-gray-400">닉네임 *</label>
              
              {/* 🚀 일반(LOCAL) 로그인 유저에게만 비밀번호 변경 버튼 노출 */}
              {user?.mbrProviderCd === 'LOCAL' && (
                <button 
                  type="button" 
                  onClick={() => setIsPwdModalOpen(true)} // 클릭 시 상태를 true로 변경!
                  className="text-[11px] px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <span>🔒</span> 비밀번호 변경
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input name="nickname" value={form.nickname} onChange={handleChange} className={`flex-1 px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${nicknameChecked ? 'border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]' : 'border-gray-200 focus:border-[#0F9B73]'}`} />
              <button type="button" onClick={handleNicknameCheck} className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition whitespace-nowrap">중복 확인</button>
            </div>
            {nicknameMsg && <p className={`text-xs mt-1 ${nicknameChecked ? 'text-[#0F9B73]' : 'text-red-500'}`}>{nicknameMsg}</p>}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">우편번호</label>
            <div className="flex gap-2">
              <input name="zipcode" value={form.zipcode} readOnly className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 cursor-not-allowed" />
              <button type="button" onClick={handleAddressSearch} className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition whitespace-nowrap">주소 검색</button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">주소</label>
            <input name="address" value={form.address} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 cursor-not-allowed" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">상세주소</label>
            <input name="detailAddress" value={form.detailAddress} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors" />
          </div>

        </div>

        <button onClick={handleSave} className="mt-6 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold transition-colors">
          저장하기
        </button>
      </div>

      {/* 🚀 조건부 렌더링: isPwdModalOpen이 true일 때만 비밀번호 변경 모달 컴포넌트 노출! */}
      {isPwdModalOpen && (
        <PasswordChange onClose={() => setIsPwdModalOpen(false)} />
      )}
    </div>
  );
};

export default MemberInfo;