// src/components/mypage/MemberInfo.jsx
import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode'; 

const MemberInfo = ({ profile, onUpdate }) => {
  const [form, setForm] = useState({ 
    ...profile, 
    password: "", 
    passwordConfirm: "", 
    zonecode: "", 
    address: "", 
    detailAddress: "" 
  });
  
  const [isOpenPost, setIsOpenPost] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = () => {
    if (form.password && form.password !== form.passwordConfirm) { 
      alert("비밀번호가 일치하지 않습니다."); 
      return; 
    }
    onUpdate({ name: form.name, phone: form.phone, email: form.email, location: form.location });
    alert("회원정보가 수정되었습니다.");
  };

  const handleComplete = (data) => {
    let fullAddress = data.address; 
    let extraAddress = ''; 

    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) extraAddress += (extraAddress ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress ? ` (${extraAddress})` : '');
    }

    setForm(prev => ({ ...prev, zonecode: data.zonecode, address: fullAddress }));
    setIsOpenPost(false);
  };

  // 🚀 중복되는 Input 태그와 Tailwind 클래스를 찍어내는 공용 함수
  const renderInput = (name, label, placeholder, type = "text", isReadOnly = false, colSpan2 = false) => (
    <div className={colSpan2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input 
        name={name} 
        type={type} 
        value={form[name]} 
        onChange={handleChange} 
        readOnly={isReadOnly}
        placeholder={placeholder} 
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none transition-colors ${
          isReadOnly 
            ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
            : "focus:border-[#0F9B73] focus:ring-1 focus:ring-[#0F9B73]"
        }`}
      />
    </div>
  );

  return (
    <div className="p-4 md:p-7 relative">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">회원 정보 수정</h2>
      
      <div className="bg-white rounded-2xl p-5 md:p-7 border border-gray-200 w-full">
        {/* 🚀 엄청나게 짧아진 폼 영역 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderInput("name", "이름", "필수입력 입니다.")}
          {renderInput("phone", "연락처", "필수입력 입니다.")}
          {renderInput("password", "비밀번호", "필수입력 입니다.", "password")}
          {renderInput("passwordConfirm", "비밀번호 확인", "필수입력 입니다.", "password")}
          {renderInput("email", "이메일", "필수입력 입니다.", "text", false, true)}

          {renderInput("zonecode", "우편번호", "우편번호", "text", true)}
          <div className="flex items-end">
            <button 
              onClick={() => setIsOpenPost(true)}
              className="w-full py-2.5 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-lg font-bold text-sm transition-colors"
            >
              주소검색
            </button>
          </div>

          {renderInput("address", "주소", "주소검색을 클릭하세요.", "text", true, true)}
          {renderInput("detailAddress", "상세주소", "상세주소를 입력해주세요.", "text", false, true)}
          {renderInput("location", "거주지", "예) 경기도 수원시", "text")}
        </div>

        <button 
          onClick={handleSave} 
          className="mt-6 w-full py-3 bg-[#0F9B73] hover:bg-[#0d8a66] text-white rounded-xl font-bold transition-colors"
        >
          저장하기
        </button>
      </div>

      {/* 모달 영역 */}
      {isOpenPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl relative animate-[slideDown_0.3s_ease-out_forwards]">
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">주소 검색</h3>
              <button 
                onClick={() => setIsOpenPost(false)}
                className="text-gray-400 hover:text-gray-800 text-2xl font-bold p-1 leading-none"
              >
                ✕
              </button>
            </div>
            <DaumPostcode 
              onComplete={handleComplete} 
              className="w-full h-[500px] md:h-[600px]" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberInfo;