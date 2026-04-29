// src/pages/admin/AreaPostList.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const typeLabel = {
  food: '먹거리',
  sleep: '잘거리',
  see: '볼거리',
  play: '놀거리',
};

const dummyPosts = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `장소명 ${i + 1}`,
  address: '경기도 수원시 팔달구 행궁로 45',
  detail: i % 2 === 0 ? '3층' : '1층',
  zip: `1648${i}`,
  phone: `031-000-000${i}`,
  regDate: '2025-12-21',
}));

const AreaPostList = () => {
  const { type } = useParams();
  const label = typeLabel[type] || '게시글';
  const [selected, setSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(dummyPosts.map((p) => p.id));
    setAllChecked(!allChecked);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        사거리 관리 → {label} 게시글 목록
      </h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-3"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              <th className="p-3">번호</th>
              <th className="p-3">장소명</th>
              <th className="p-3">주소</th>
              <th className="p-3">상세주소</th>
              <th className="p-3">우편번호</th>
              <th className="p-3">연락처</th>
              <th className="p-3">등록일자</th>
              <th className="p-3">수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {dummyPosts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleOne(p.id)}
                  />
                </td>
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-left">{p.address}</td>
                <td className="p-3">{p.detail}</td>
                <td className="p-3">{p.zip}</td>
                <td className="p-3">{p.phone}</td>
                <td className="p-3">{p.regDate}</td>
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

export default AreaPostList;