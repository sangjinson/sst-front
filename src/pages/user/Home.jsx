// src/pages/user/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  const stats = [
    { label: '전체 회원 수', value: '1,250', icon: '👤', bg: 'bg-blue-500' },
    { label: '오늘 가입 수', value: '14', icon: '👥', bg: 'bg-green-500' },
    { label: '전체 게시글', value: '3,400', icon: '📋', bg: 'bg-yellow-500' },
    { label: '신고 건수', value: '12', icon: '⚠️', bg: 'bg-red-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">관리자 페이지</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-6 text-white flex flex-col gap-4`}>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
            <div className="text-4xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;