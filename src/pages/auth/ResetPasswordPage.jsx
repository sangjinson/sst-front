import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@api/authApi';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await resetPassword(formData.email, formData.name);
      
      //  메일 발송 완료 시 알림 후 로그인 페이지로 이동
      alert('입력하신 이메일로 임시 비밀번호가 발송되었습니다.\n로그인 후 보안을 위해 반드시 비밀번호를 변경해 주세요.');
      navigate('/login'); 
      
    } catch (error) {
      setErrorMsg(error.response?.data?.message || '회원 정보를 찾을 수 없거나 이름이 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">비밀번호 재설정</h2>
        <p className="text-sm text-center text-gray-500 mb-6">가입하신 이메일로 임시 비밀번호를 발송해 드립니다.</p>
        
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="example@sstour.cloud"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="가입 시 등록한 이름"
              required
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition duration-200 
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? '이메일 발송 중...' : '임시 비밀번호 발급'}
          </button>
        </form>

        {errorMsg && (
          <p className="mt-4 text-sm text-center text-red-500 font-medium">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;