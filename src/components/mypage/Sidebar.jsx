import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ profile, profileImg }) => {
  // 데이터가 없거나 빈 값일 때를 대비한 기본값 설정
  const {
    nickname = "미지정",
    joinDate = "0000.00.00",
    phone = "등록된 번호 없음",
    email = "이메일 정보 없음"
  } = profile || {};

  // 프로필 이미지가 빈 값일 때 사용할 기본 이미지
  const defaultProfile = "https://via.placeholder.com/150?text=User";

  return (
    <aside className="hidden lg:flex flex-col gap-4 max-w-[250px] shrink-0">
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="fs-up-3 font-bold text-center text-gray-700 mb-4">마이페이지</h3>
        <hr className="w-full border-b border-t-0 border-gray-200 my-2 order-2 md:order-4" />
        
        <div className="flex flex-col items-center gap-2">
          <div className="w-[95%] mx-auto aspect-square overflow-hidden rounded-lg border-[1px] border-gray-100 bg-gray-50">
            <img 
              src={profileImg || defaultProfile} 
              alt="프로필"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = defaultProfile; }}
            />
          </div>
          
          <div className="fs-up-2 font-bold text-gray-900">
            {/* 닉네임이 빈 문자열일 경우 '미지정' 출력 */}
            {nickname || "미지정"} 🏅
          </div>
        </div>
        <hr className="w-full border-b border-t-0 border-gray-200 my-2 order-2 md:order-4" />

        <ul className="flex flex-col gap-3 py-2 fs-up-2">
          <li className="text-gray-700 flex items-start gap-1.5">
            <span className="">📅</span>가입일: {joinDate || "0000.00.00"}
          </li>
          <li className="text-gray-700 flex items-start gap-1.5">
            <span className="">📞</span>{phone || "등록된 번호 없음"}
          </li>
          <li className=" text-gray-700 flex items-start gap-1.5">
            <span className="">✉️</span>{email || "이메일 정보 없음"}
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="fs-up-3 font-bold text-center text-gray-700 mb-3">고객센터</h3>
        <hr className="w-full border-b border-t-0 border-gray-200 my-2 order-2 md:order-4" />
        <ul className="flex flex-col gap-1.5 fs-up-2">
          <li>
            <Link to="/customersupport/notice"
              className="text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
              <span>👤</span> 공지사항
            </Link>
          </li>
          <li>
            <Link to="/customersupport/faq"
              className="text-gray-700 flex items-center gap-2 py-1.5 hover:text-[#0F9B73] transition-colors">
              <span>❓</span> 자주 하는 질문
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;