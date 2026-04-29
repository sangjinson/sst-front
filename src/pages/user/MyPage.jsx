// src/pages/user/MyPage.jsx
import React, { useState, useEffect } from 'react';
import Breadcrumb from '@components/common/Breadcrumb';

// 🚀 분리한 컴포넌트들을 불러옵니다. (경로가 맞는지 확인해 주세요)
import Sidebar from '@components/mypage/Sidebar';
import MemberInfo from '@components/mypage/MemberInfo';
import MyShowcase from '@components/mypage/MyShowcase';
import MySchedule from '@components/mypage/MySchedule';
import MyWishlist from '@components/mypage/MyWishlist';

const AnimationStyles = () => (
  <style>{`
    @keyframes cardPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    .animate-card-pop {
      animation: cardPop 0.3s ease-out;
    }

    @keyframes iconPulse {
      0% { box-shadow: 0 0 0 0 rgba(15, 155, 115, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(15, 155, 115, 0); }
      100% { box-shadow: 0 0 0 0 rgba(15, 155, 115, 0); }
    }
    .animate-icon-pulse {
      animation: iconPulse 2s infinite;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
  `}</style>
);

const CARDS = [
  { key: "member",   label: "회원정보",   icon: "👤" },
  { key: "showcase", label: "내 뽐낼거리", icon: "🖼️" },
  { key: "schedule", label: "내 일정관리", icon: "📅" },
  { key: "wishlist", label: "내 찜목록",   icon: "❤️" },
];

const TabCard = ({ card, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white border-[1.5px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 ${
      isActive 
        ? "border-[#0F9B73] bg-[#f0fdf9] shadow-md animate-card-pop" 
        : "border-gray-200 shadow-sm hover:border-[#0F9B73]"
    }`}
  >
    <span className={`text-sm md:text-sm font-bold self-start ${isActive ? "text-[#0F9B73]" : "text-gray-700"}`}>
      {card.label}
    </span>
    <div className={`w-12 h-12 md:w-[58px] md:h-[58px] rounded-full border-[3px] flex items-center justify-center text-xl md:text-2xl transition-colors ${
      isActive ? "border-[#0F9B73] animate-icon-pulse" : "border-blue-500"
    }`}>
      {card.icon}
    </div>
  </div>
);

const MyPage = () => {
  const [activeSection, setActiveSection] = useState("member");
  const [profile, setProfile] = useState({
    name: "홍길동",
    phone: "010-5882-1253",
    email: "hong01@ksmart.or.kr",
    location: "경기도 성남시",
  });

  // 컴포넌트 마운트 시 스크롤 상단 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = {
    member: <MemberInfo profile={profile} onUpdate={setProfile} />,
    showcase: <MyShowcase />,
    schedule: <MySchedule />,
    wishlist: <MyWishlist />
  };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || "";

  return (
    <>
      <AnimationStyles />
      
      <div className="min-h-screen bg-gray-50 font-paperlogy">
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
                <TabCard 
                  key={card.key} 
                  card={card} 
                  isActive={activeSection === card.key} 
                  onClick={() => setActiveSection(card.key)} 
                />
              ))}
            </div>

            {/* 선택된 탭 렌더링 영역 */}
            <div key={activeSection} className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] animate-fade-in">
              {renderContent[activeSection]}
            </div>

          </section>
        </div>
      </div>
    </>
  );
};

export default MyPage;