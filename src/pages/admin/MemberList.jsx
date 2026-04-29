// src/pages/admin/MemberList.jsx
import React, { useState } from 'react';

const dummyMembers = Array.from({ length: 9 }, (_, i) => ({
  id: `ksmartid${i + 1}`,
  pw: `ksmartpw${i + 1}`,
  no: i + 1,
  grade1: `mbr_grd_${(i % 3) + 1}`,
  grade2: i % 2 === 0 ? '관리자' : '구매자',
  address: '전북특별자치도 전주시 덕진구 기린대로 499',
  detail: i % 2 === 0 ? '3층 한국스마트정보교육원' : '도레미아파트',
  zip: `5488${i}`,
  phone: `063-717-100${i}`,
  email: `ksmartid${i + 1}@ksmart.or.kr`,
  regDate: '2025-12-21',
}));

const MemberList = () => {
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(dummyMembers.map((m) => m.id));
    }
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">회원 목록</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              <th className="p-3">아이디</th>
              <th className="p-3">비밀번호</th>
              <th className="p-3">이름</th>
              <th className="p-3">등급1</th>
              <th className="p-3">등급2</th>
              <th className="p-3">주소</th>
              <th className="p-3">상세주소</th>
              <th className="p-3">우편번호</th>
              <th className="p-3">연락처</th>
              <th className="p-3">이메일</th>
              <th className="p-3">등록일자</th>
              <th className="p-3">수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {dummyMembers.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(m.id)}
                    onChange={() => toggleOne(m.id)}
                  />
                </td>
                <td className="p-3">{m.id}</td>
                <td className="p-3">{m.pw}</td>
                <td className="p-3">{m.no}</td>
                <td className="p-3">{m.grade1}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    m.grade2 === '관리자' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {m.grade2}
                  </span>
                </td>
                <td className="p-3 text-left">{m.address}</td>
                <td className="p-3">{m.detail}</td>
                <td className="p-3">{m.zip}</td>
                <td className="p-3">{m.phone}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.regDate}</td>
                <td className="p-3">
                  <div className="flex gap-1 justify-center">
                    <button className="px-3 py-1 bg-orange-400 text-white text-xs rounded hover:bg-orange-500 transition">수정</button>
                    <button className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition">삭제</button>
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