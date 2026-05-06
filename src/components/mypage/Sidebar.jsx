import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ profile, profileImg }) => {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[220px] shrink-0">
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">마이페이지</h3>
        
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="relative w-16 h-16">
            <img src={profileImg} alt="프로필"
              className="w-16 h-16 rounded-full object-cover border-[3px] border-[#0F9B73]" />
          </div>
          {/* 🚀 실제 DB 닉네임 연동 */}
          <div className="font-bold text-gray-900">{profile.nickname} 🏅</div>
        </div>

        <ul className="flex flex-col gap-2">
          {/* 🚀 실제 DB 가입일, 전화번호, 이메일 연동 */}
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">📅</span>가입일: {profile.joinDate}
          </li>
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">📞</span>{profile.phone}
          </li>
          <li className="text-xs text-gray-700 flex items-start gap-1.5">
            <span className="text-sm">✉️</span>{profile.email}
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3">프로필 더보기</h3>
        <ul className="flex flex-col gap-1.5">
          <Link to="/customersupport/notice"
            className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
            <span>👤</span> 공지사항
          </Link>
          <Link to="/customersupport/faq"
            className="text-sm text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
            <span>❓</span> 자주 하는 질문
          </Link>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;