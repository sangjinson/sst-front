import React, { useState, useEffect, useRef } from 'react';
import api from '@api/axios';
import PasswordChange from './PasswordChange'; 
import ProfileImage from '@modules/member/ProfileImage';
import ProfileCover from '@modules/member/ProfileCover';

const MemberInfo = ({ profile, onUpdate, onWithdraw }) => {
  const imgRef = useRef(null);
  const coverRef = useRef(null);
  const isInitialized = useRef(false); 
  
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    nickname: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    coverImg: '', 
  });

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState('');

  useEffect(() => {
    if (profile && !isInitialized.current) {
      setForm({
        name: profile.name || '',
        nickname: profile.nickname || '',
        phone: profile.phone || '',
        zipcode: profile.zipcode || '',
        address: profile.address || '',
        detailAddress: profile.detailAddress || '',
        coverImg: profile.mbrBackInfo?.filePath || '',
      });
      isInitialized.current = true;
    }
  }, [profile]);

  const autoHyphenPhone = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, '');
    const limitedNums = onlyNums.slice(0, 11);
    if (limitedNums.length <= 3) return limitedNums;
    if (limitedNums.length <= 7) return limitedNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return limitedNums.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'phone' ? autoHyphenPhone(value) : value
    }));

    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMsg('');
    }
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file)); 
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      // ProfileImage 방식과 동일하게 미리보기 URL 생성
      setForm(prev => ({ ...prev, coverImg: URL.createObjectURL(file) }));
    }
  };

  const handleNicknameCheck = async () => {
    const trimmedNickname = form.nickname.trim();
    if (!trimmedNickname) { alert('닉네임을 입력해주세요.'); return; }
    if (trimmedNickname === profile?.nickname) {
      setNicknameMsg('현재 사용 중인 회원님의 닉네임입니다.');
      setNicknameChecked(true); 
      return; 
    }
    try {
      const response = await api.get(`/auth/check-nickname`, { params: { nickname: trimmedNickname } });
      if (response.data.data) {
        setNicknameMsg('이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      } else {
        setNicknameMsg('사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      }
    } catch (error) {
      alert('중복 확인 중 에러가 발생했습니다.');
    }
  };

  const handleAddressSearch = () => {
    if (!window.daum) return;
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
    if (form.nickname !== profile?.nickname && !nicknameChecked) { alert('닉네임 중복 확인을 진행해주세요.'); return; }

    try {
      const formData = new FormData();
      formData.append('mbrName', form.name);
      formData.append('mbrNickname', form.nickname);
      formData.append('mbrTelno', form.phone);
      formData.append('mbrZip', form.zipcode || '');
      formData.append('mbrAddr', form.address || '');
      formData.append('mbrDaddr', form.detailAddress || '');

      if (profileFile) formData.append('profileImage', profileFile);
      if (coverFile) formData.append('backgroundImage', coverFile);

      const isSuccess = await onUpdate(formData);
      
      if (isSuccess) {
        setProfileFile(null);
        setProfilePreview(null);
        setCoverFile(null);
      }
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full h-48 md:h-64 overflow-visible">
        {/* 커버 이미지 컴포넌트 적용 */}
        <ProfileCover user={profile} preview={form.coverImg} />
        
        <button 
          type="button" 
          onClick={() => coverRef.current?.click()} 
          className="absolute bottom-4 right-4 w-8 h-8 bg-[#0F9B73] rounded-full flex items-center justify-center shadow-md hover:bg-[#0d8a66] transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFileChange} />

        <div className="absolute left-6 bottom-[-32px] md:left-10 md:bottom-[-40px]">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <ProfileImage user={profile} size="xl" preview={profilePreview} />
            <button 
              type="button" 
              onClick={() => imgRef.current?.click()} 
              className="absolute bottom-1 right-1 w-8 h-8 bg-[#0F9B73] rounded-full flex items-center justify-center shadow-md hover:bg-[#0d8a66] transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleProfileFileChange} />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-7 pt-12 md:pt-16">
        <h3 className="fs-up-3 font-bold text-gray-700 mb-4">회원 정보 수정</h3>
        <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7" />

        <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-200 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">이름 *</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">전화번호 *</label>
              <input name="phone" value={form.phone} onChange={handleChange} maxLength={13} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]" />
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs text-gray-400">닉네임 *</label>
                {profile?.loginType === 'LOCAL' && (
                  <button type="button" onClick={() => setIsPwdModalOpen(true)} className="text-[11px] px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 flex items-center gap-1">
                    <span>🔒</span> 비밀번호 변경
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input name="nickname" value={form.nickname} onChange={handleChange} className={`flex-1 px-3 py-2.5 border rounded-lg text-sm outline-none ${nicknameChecked ? 'border-[#0F9B73]' : 'border-gray-200'}`} />
                <button type="button" onClick={handleNicknameCheck} className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition">중복 확인</button>
              </div>
              {nicknameMsg && <p className={`text-xs mt-1 ${nicknameChecked ? 'text-[#0F9B73]' : 'text-red-500'}`}>{nicknameMsg}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">우편번호</label>
              <div className="flex gap-2">
                <input name="zipcode" value={form.zipcode} readOnly className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                <button type="button" onClick={handleAddressSearch} className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition">주소 검색</button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">주소</label>
              <input name="address" value={form.address} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">상세주소</label>
              <input name="detailAddress" value={form.detailAddress} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]" />
            </div>
          </div>

          <button onClick={handleSave} className="mt-6 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold transition-colors">
            저장하기
          </button>
          
          <div className="mt-4 text-right">
            <button type="button" onClick={onWithdraw} className="text-xs text-gray-400 hover:text-red-500 underline transition-colors">회원 탈퇴</button>
          </div>
        </div>
      </div>

      {isPwdModalOpen && <PasswordChange onClose={() => setIsPwdModalOpen(false)} />}
    </div>
  );
};

export default MemberInfo;