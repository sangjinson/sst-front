import React, { useState } from 'react';
import api from '@api/axios';
import { useAuth } from '@hooks/useAuth';

// 부모(MemberInfo)로부터 모달 닫기용 함수(onClose)를 props로 받음
const PasswordChange = ({ onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  if (user?.mbrProviderCd !== 'LOCAL') {
    return <div className="text-sm text-gray-500">소셜 로그인 회원은 비밀번호를 변경할 수 없습니다.</div>;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.newPassword !== form.newPasswordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      await api.put('/member/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      //  1. 메시지를 좀 더 자연스럽게 수정
      alert("비밀번호가 성공적으로 변경되었습니다.");
      
      //  2. window.location.href = '/login'; 삭제
      //  3. 부모 컴포넌트에서 넘겨받은 onClose()를 호출하여 모달만 깔끔하게 닫기
      onClose(); 
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      alert(errorMsg);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold mb-5 text-gray-900">비밀번호 변경</h3>
        
        <div className="flex flex-col gap-3">
          <input
            name="currentPassword"
            type="password"
            placeholder="현재 비밀번호"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="새 비밀번호 (8자 이상)"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          />
          <input
            name="newPasswordConfirm"
            type="password"
            placeholder="새 비밀번호 확인"
            value={form.newPasswordConfirm}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73]"
          />
          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold text-sm transition-colors"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;