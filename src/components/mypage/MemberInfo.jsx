import React, { useState, useEffect, useRef } from 'react';
import api from '@api/axios';
import { useAuth } from '@hooks/useAuth';
import PasswordChange from './PasswordChange'; 
import Swal from 'sweetalert2';
import ProfileImage from '@modules/member/ProfileImage'; // 프로필 아이콘


const MemberInfo = ({ profile, onUpdate, profileImg, onImgChange }) => {
  const imgRef = useRef(null);
  const coverRef = useRef(null);
  const { localLogout, user } = useAuth();
  
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  // 🚀 파일 객체를 별도로 관리하기 위한 상태
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // 폼 상태
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    coverImg: '', // 미리보기용 URL
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
        coverImg: profile.coverImg || '',
      });
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
    if (name === 'phone') {
      setForm(prev => ({ ...prev, [name]: autoHyphenPhone(value) }));
      return; 
    }
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMsg('');
    }
  };

  // 🚀 프로필 이미지 변경 핸들러
  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file); // 실제 전송할 파일 저장
      if (onImgChange) onImgChange(e); // 부모 컴포넌트의 미리보기 연동
    }
  };

  // 🚀 배경 이미지 변경 핸들러
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file); // 실제 전송할 파일 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, coverImg: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNicknameCheck = async () => {
    const trimmedNickname = form.nickname.trim();
    if (!trimmedNickname) { alert('닉네임을 입력해주세요.'); return; }
    if (trimmedNickname === profile.nickname) {
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
    if (form.nickname !== profile.nickname && !nicknameChecked) { alert('닉네임 중복 확인을 진행해주세요.'); return; }

    try {
      const formData = new FormData();
      // 텍스트 필드 추가
      formData.append('mbrName', form.name);
      formData.append('mbrNickname', form.nickname);
      formData.append('mbrTelno', form.phone);
      formData.append('mbrZip', form.zipcode || '');
      formData.append('mbrAddr', form.address || '');
      formData.append('mbrDaddr', form.detailAddress || '');

      // 🚀 상태값에 담긴 실제 파일 객체 추가
      if (profileFile) {
        formData.append('profileImage', profileFile);
      }
      if (coverFile) {
        formData.append('backgroundImage', coverFile);
      }

      // API 전송 (multipart/form-data 헤더 강제 설정)
      const response = await api.post('/member/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('회원정보가 성공적으로 수정되었습니다.');
      if (onUpdate) onUpdate(response.data.data);
      
      // 전송 완료 후 파일 상태 초기화
      setProfileFile(null);
      setCoverFile(null);
    } catch (error) {
      console.error('에러 상세:', error.response?.data);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleWithdraw = async () => {
    // 🚀 1. SweetAlert2로 탈퇴 사유 모달 띄우기
    const result = await Swal.fire({
      title: '정말 탈퇴하시겠습니까?',
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
            <input type="radio" name="withdraw-reason" value="WDR001" style="accent-color:#0F9B73;" />
            사용 빈도가 낮아서
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
            <input type="radio" name="withdraw-reason" value="WDR002" style="accent-color:#0F9B73;" />
            서비스 이용이 불편해서
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
            <input type="radio" name="withdraw-reason" value="WDR003" style="accent-color:#0F9B73;" />
            개인정보 보호를 위해
          </label>
          <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
            <input type="radio" name="withdraw-reason" value="WDR004" id="reason-etc" style="accent-color:#0F9B73;"
              onclick="document.getElementById('etc-withdraw-wrap').style.display='block'" />
            기타
          </label>
          <div id="etc-withdraw-wrap" style="display:none; margin-top:4px;">
            <textarea id="etc-withdraw-input" placeholder="탈퇴 사유를 알려주시면 서비스 개선에 큰 도움이 됩니다."
              style="width:100%; border:1px solid #e5e7eb; border-radius:8px; padding:10px; font-size:13px; outline:none; resize:none; height:80px;"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '탈퇴하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#ef4444', // 🚀 탈퇴는 위험 행동이므로 빨간색 버튼
      cancelButtonColor: '#9ca3af',
      preConfirm: () => {
        const selected = document.querySelector('input[name="withdraw-reason"]:checked');
        if (!selected) {
          Swal.showValidationMessage('탈퇴 사유를 선택해주세요.');
          return false;
        }
        
        let reasonDesc = null;
        if (selected.value === 'WDR004') {
          reasonDesc = document.getElementById('etc-withdraw-input')?.value?.trim();
          if (!reasonDesc) {
            Swal.showValidationMessage('기타 사유를 입력해주세요.');
            return false;
          }
        }
        
        return { reasonCd: selected.value, reasonDesc };
      },
    });

    if (!result.isConfirmed) return;

    try {
      // 🚀 2. axios delete 요청 시 body에 데이터를 담으려면 { data: payload } 구조를 사용해야 합니다.
      await api.delete('/member/me', {
        data: result.value // { reasonCd, reasonDesc }
      });
      
      await Swal.fire({
        icon: 'success',
        title: '탈퇴 완료',
        text: '그동안 거리에섯을 이용해 주셔서 감사합니다.',
        timer: 1500,
        showConfirmButton: false,
      });
      
      localLogout(); // 전역 상태 초기화 및 메인 이동
    } catch (error) {
      alert('탈퇴 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="relative w-full">
      {/* 배경 이미지 영역 */}
      <div className="relative w-full h-48 md:h-64 bg-gray-100 overflow-visible">
        <img 
          src={form.coverImg || '/default-cover.jpg'} 
          alt="배경" 
          className="w-full h-full object-cover" 
        />
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
        <input 
          ref={coverRef} 
          type="file" 
          name="backgroundImage" 
          accept="image/*" 
          className="hidden" 
          onChange={handleCoverFileChange} 
        />

        {/* 프로필 이미지 영역 */}
        <div className="absolute left-6 bottom-[-32px] md:left-10 md:bottom-[-40px]">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <ProfileImage user={user} size="xl"/>
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
            <input 
              ref={imgRef} 
              type="file" 
              name="profileImage"
              accept="image/*" 
              className="hidden" 
              onChange={handleProfileFileChange} 
            />
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
                {user?.mbrProviderCd === 'LOCAL' && (
                  <button 
                    type="button" 
                    onClick={() => setIsPwdModalOpen(true)}
                    className="text-[11px] px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 flex items-center gap-1"
                  >
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
                <input name="zipcode" value={form.zipcode} readOnly className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed" />
                <button type="button" onClick={handleAddressSearch} className="px-4 py-2.5 bg-[#0F9B73] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a66] transition">주소 검색</button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">주소</label>
              <input name="address" value={form.address} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed" />
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
            <button 
              type="button" 
              onClick={handleWithdraw}
              className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      {isPwdModalOpen && (
        <PasswordChange onClose={() => setIsPwdModalOpen(false)} />
      )}
    </div>
  );
};

export default MemberInfo;