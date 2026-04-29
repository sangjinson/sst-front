import React, { useState } from 'react';

const MemberInfo = ({ profile, onUpdate }) => {
  const [form, setForm] = useState({ ...profile, password: "", passwordConfirm: "", address: "", detailAddress: "" });
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = () => {
    if (form.password && form.password !== form.passwordConfirm) { 
      alert("비밀번호가 일치하지 않습니다."); 
      return; 
    }
    onUpdate({ name: form.name, phone: form.phone, email: form.email, location: form.location });
    alert("회원정보가 수정되었습니다.");
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">회원 정보 수정</h2>
      
      <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-200 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["name", "이름", "text"],
            ["phone", "연락처", "text"],
            ["password", "비밀번호", "password"],
            ["passwordConfirm", "비밀번호 확인", "password"]
          ].map(([n, l, t]) => (
            <div key={n}>
              <label className="block text-xs text-gray-400 mb-1.5">{l}</label>
              <input 
                name={n} 
                type={t} 
                value={form[n]} 
                onChange={handleChange} 
                placeholder="필수입력 입니다." 
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
              />
            </div>
          ))}
          
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">이메일</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="필수입력 입니다." 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">우편번호</label>
            <input 
              placeholder="필수입력 입니다." 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full py-2.5 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-lg font-bold text-sm transition-colors">
              주소검색
            </button>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">주소</label>
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              placeholder="주소검색을 클릭하세요." 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1.5">상세주소</label>
            <input 
              name="detailAddress" 
              value={form.detailAddress} 
              onChange={handleChange} 
              placeholder="필수입력 입니다." 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">거주지</label>
            <input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              placeholder="예) 경기도 수원시" 
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73] transition-colors"
            />
          </div>
        </div>
        <button 
          onClick={handleSave} 
          className="mt-6 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold transition-colors"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default MemberInfo;