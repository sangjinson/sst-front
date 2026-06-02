import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findEmail } from '../../api/authApi';

const FindEmailPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', telno: '' });
  const [emailList, setEmailList] = useState([]); 
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  //  전화번호 자동 하이픈(-) 적용 함수
  const formatPhoneNumber = (value) => {
    const nums = value.replace(/[^0-9]/g, ''); // 숫자만 추출
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return nums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    if (nums.length === 10) return nums.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // 예: 011-123-4567
    if (nums.length > 10) return nums.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');  // 예: 010-1234-5678
    return nums;
  };

  //  입력 핸들러: 값 변경 시 실시간으로 정규식 포맷팅 적용
  const handleTelnoChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, telno: formattedValue });
  };

  const handleFind = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailList([]);
    setIsSearched(false);

    try {
      //  주의: 만약 백엔드 DB(MEMBER.MBR_TELNO)에 하이픈 없이 숫자만 저장되어 있다면 
      // API 전송 시 formData.telno.replace(/-/g, '') 로 하이픈을 빼고 넘겨야 합니다.
      // (현재는 화면에 보이는 하이픈 포함 상태 그대로 전송합니다.)
      const emails = await findEmail(formData.name, formData.telno);
      setEmailList(emails); 
      setIsSearched(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || '일치하는 회원 정보가 없습니다.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">이메일 찾기</h2>
        
        <form onSubmit={handleFind} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F9B73]/25"
              placeholder="가입 시 등록한 이름"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            {/*  수정된 부분: onChange에 handleTelnoChange 적용, maxLength 제한 */}
            <input 
              type="text" 
              value={formData.telno}
              onChange={handleTelnoChange}
              maxLength={13} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F9B73]/25"
              placeholder="숫자만 입력 (예: 010-1234-5678)"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-[#24B99F] hover:bg-[#5cc7b2] text-white font-bold rounded-md transition duration-200 active:scale-[0.98]"
          >
            이메일 찾기
          </button>
        </form>

        {errorMsg && (
          <p className="mt-4 text-sm text-center text-red-500 font-medium">{errorMsg}</p>
        )}
        
        {isSearched && emailList.length > 0 && (
          <div className="mt-6 p-5 bg-[#f8f6f0] rounded-md border border-[#24B99F]/20">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              조회된 이메일 계정 ({emailList.length}개)
            </p>
            <ul className="space-y-2 mb-4">
              {emailList.map((email, index) => (
                <li key={index} className="text-gray-800 font-medium flex items-center before:content-['•'] before:mr-2 before:text-[#24B99F]">
                  {email}
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-200">
              <button onClick={() => navigate('/login')} className="text-[#0F9B73] hover:underline font-medium">로그인하기</button>
              <button onClick={() => navigate('/reset-password')} className="text-gray-500 hover:text-[#0F9B73] hover:underline transition">비밀번호 찾기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindEmailPage;