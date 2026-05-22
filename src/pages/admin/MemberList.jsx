import React, { useState, useEffect } from 'react';
import api from '@api/axios';

const MemberList = () => {
  // 🚀 1. 백엔드에서 받아올 실제 회원 목록 상태
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  // 🚀 2. 컴포넌트 마운트 시 전체 회원 목록 조회 API 호출
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get('/admin/members');
        setMembers(response.data.data); 
      } catch (error) {
        console.error("회원 목록 조회 실패:", error);
        alert("회원 목록을 불러오지 못했습니다.");
      }
    };
    fetchMembers();
  }, []);

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(members.map((m) => m.mbrId)); // 🚀 실제 PK인 mbrId 사용
    }
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // 🚀 3. 관리자 권한으로 특정 회원 강제 탈퇴(소프트 삭제) 처리
  const handleDelete = async (mbrId) => {
    if(!window.confirm("정말 이 회원을 탈퇴 처리하시겠습니까?")) return;
    
    try {
      await api.delete(`/admin/members/${mbrId}`);
      // 삭제 성공 시 화면에서 즉시 제거 (리렌더링)
      setMembers(prev => prev.filter(m => m.mbrId !== mbrId));
      alert("회원이 탈퇴 처리되었습니다.");
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">회원 목록</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              <th className="p-3">번호</th>
              <th className="p-3">이메일(ID)</th>
              <th className="p-3">이름</th>
              <th className="p-3">닉네임</th>
              <th className="p-3">권한</th>
              <th className="p-3">연락처</th>
              <th className="p-3">우편번호</th>
              <th className="p-3">주소</th>
              <th className="p-3">상세주소</th>
              <th className="p-3">가입일시</th>
              <th className="p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.mbrId} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(m.mbrId)}
                    onChange={() => toggleOne(m.mbrId)}
                  />
                </td>
                {/* 🚀 백엔드 Member 도메인 규격에 맞춰 필드명 바인딩 */}
                <td className="p-3">{m.mbrId}</td>
                <td className="p-3">{m.mbrEmail}</td>
                <td className="p-3">{m.mbrName}</td>
                <td className="p-3">{m.mbrNickname}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    m.mbrAuthCd === 'ROLE_ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {m.mbrAuthCd === 'ROLE_ADMIN' ? '관리자' : '일반회원'}
                  </span>
                </td>
                <td className="p-3">{m.mbrTelno}</td>
                <td className="p-3">{m.mbrZip}</td>
                <td className="p-3 text-left truncate max-w-[150px]" title={m.mbrAddr}>{m.mbrAddr}</td>
                <td className="p-3">{m.mbrDaddr}</td>
                <td className="p-3">{new Date(m.mbrJoinDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-1 justify-center">
                    <button 
                      onClick={() => handleDelete(m.mbrId)} 
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                    >
                      강제탈퇴
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;