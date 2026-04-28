// src/pages/user/MyPage.jsx
import React, { useState } from 'react';
import Breadcrumb from '@components/common/Breadcrumb';

// 🚀 분리한 컴포넌트들을 불러옵니다.
import Sidebar from '@components/mypage/Sidebar';
import MemberInfo from '@components/mypage/MemberInfo';
import MyShowcase from '@components/mypage/MyShowcase';
import MySchedule from '@components/mypage/MySchedule';
import MyWishlist from '@components/mypage/MyWishlist';

const CARDS = [
  { key: "member",   label: "회원정보",   icon: "👤" },
  { key: "showcase", label: "내 뽐낼거리", icon: "🖼️" },
  { key: "schedule", label: "내 일정관리", icon: "📅" },
  { key: "wishlist", label: "내 찜목록",   icon: "❤️" },
];

const MyPage = () => {
  const [activeSection, setActiveSection] = useState("member");
  const [profile, setProfile] = useState({
    name: "홍길동",
    phone: "010-5882-1253",
    email: "hong01@ksmart.or.kr",
    location: "경기도 성남시",
  });

  const renderSection = () => {
    switch (activeSection) {
      case "member":   return <MemberInfo profile={profile} onUpdate={setProfile} />;
      case "showcase": return <MyShowcase />;
      case "schedule": return <MySchedule />;
      case "wishlist": return <MyWishlist />;
      default:         return null;
    }
  };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || "";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-10 lg:py-10 flex flex-col lg:flex-row gap-6">

        {/* 좌측 사이드바 컴포넌트 */}
        <Sidebar profile={profile} />

        {/* 우측 메인 콘텐츠 */}
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          
          <Breadcrumb 
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]} 
            className="mb-0" 
          />

          {/* 4개의 탭 버튼 영역 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CARDS.map((card) => (
              <div
                key={card.key}
                onClick={() => setActiveSection(card.key)}
                className={`bg-white border-[1.5px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 ${
                  activeSection === card.key 
                    ? "border-[#0F9B73] bg-[#f0fdf9] shadow-md" 
                    : "border-gray-200 shadow-sm hover:border-[#0F9B73]"
                }`}
              >
                <span className={`text-sm md:text-sm font-bold self-start ${activeSection === card.key ? "text-[#0F9B73]" : "text-gray-700"}`}>
                  {card.label}
                </span>
                <div className={`w-12 h-12 md:w-[58px] md:h-[58px] rounded-full border-[3px] flex items-center justify-center text-xl md:text-2xl transition-colors ${
                  activeSection === card.key ? "border-[#0F9B73]" : "border-blue-500"
                }`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* 선택된 탭이 렌더링되는 영역 */}
          <div key={activeSection} className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] animate-[fadeIn_0.3s_ease-in-out]">
            {renderSection()}
          </div>

        </section>
      </div>

      {/* 페이드인 애니메이션 (App.css에 옮기셨다면 삭제 가능) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyPage;