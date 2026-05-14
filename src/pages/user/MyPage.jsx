import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '@api/axios'; 
import Breadcrumb from '@components/common/Breadcrumb';

import Sidebar from '@components/mypage/Sidebar';
import MemberInfo from '@components/mypage/MemberInfo';
import MyShowcase from '@components/mypage/MyShowcase';
import MySchedule from '@components/mypage/MySchedule';
import MyWishlist from '@components/mypage/MyWishlist';

const CARDS = [
  { key: 'member',   label: '회원정보',   icon: '👤' },
  { key: 'showcase', label: '내 뽐낼거리', icon: '🖼️' },
  { key: 'schedule', label: '내 일정관리', icon: '📅' },
  { key: 'wishlist', label: '내 찜목록',   icon: '❤️' },
];

const MyPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(
    location.state?.tab || sessionStorage.getItem("mypageTab") || "member"
  );
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileImg, setProfileImg] = useState(
    'https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png'
  );

  useEffect(() => {
    sessionStorage.setItem("mypageTab", activeSection);
  }, [activeSection]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await api.get('/member/me');
        const data = response.data.data;
        
        setProfile({
          name: data.mbrName,
          nickname: data.mbrNickname,
          phone: data.mbrTelno,
          email: data.mbrEmail,
          zipcode: data.mbrZip,
          address: data.mbrAddr,
          detailAddress: data.mbrDaddr,
          joinDate: data.mbrJoinDate ? data.mbrJoinDate.split('T')[0] : '알 수 없음'
        });
      } catch (error) {
        console.error('회원 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderSection = () => {
    if (loading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;

    switch (activeSection) {
      case 'member':
        return (
          <MemberInfo
            profile={profile}
            onUpdate={setProfile}
            profileImg={profileImg}
            onImgChange={handleImgChange}
          />
        );
      case 'showcase': return <MyShowcase />;
      case 'schedule': return <MySchedule />;
      case 'wishlist': return <MyWishlist />;
      default: return null;
    }
  };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🚀 전체 컨테이너를 잡고, 그 안에서 브레드크럼과 아래쪽(사이드바+본문) 영역을 수직으로 나눔 */}
      <div className="container mx-auto px-4 py-6 md:px-10 lg:py-10">
        
        {/* 🚀 1. 브레드크럼을 젤 위로 분리해서 사이드바와 메뉴의 윗줄을 깔끔하게 맞춤 */}
        <div className="w-full flex justify-start mb-6">
          <Breadcrumb
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]}
            className="!justify-start" // 🚀 브레드크럼이 기본적으로 우측 정렬일 수 있어서 좌측 정렬 클래스 적용
          />
        </div>

        {/* 🚀 2. 사이드바와 메인 컨텐츠를 나란히 배치하는 래퍼 (items-start 속성으로 윗선 정렬) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* 사이드바 */}
          {/* !loading && profile && () */} 
          <Sidebar profile={profile} profileImg={profileImg} />

          {/* 메인 컨텐츠 */}
          <section className="flex-1 min-w-0 flex flex-col gap-4 w-full">
            {/* 카드 메뉴 */}
            <div className="relative">
              {/* 모바일에서는 하단 고정 바, 데스크탑에서는 일반 그리드 레이아웃 */}
              <div className={`
                fixed bottom-0 left-0 right-0 z-[100] px-2 h-16 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]
                md:relative md:h-auto md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:px-0 md:z-0
                grid grid-cols-4 gap-x-2 md:gap-x-4 
              `}>
                {CARDS.map((card) => (
                  <div
                    key={card.key}
                    onClick={() => setActiveSection(card.key)}
                    className={`
                      flex flex-col items-center justify-center flex-1 gap-1 cursor-pointer transition-all
                      md:flex-row md:justify-between md:px-5 md:py-3.5 md:rounded-lg md:border-[1.5px] md:hover:shadow-md
                      ${activeSection === card.key
                        ? 'text-[#0F9B73] md:border-[#0F9B73] md:bg-[#f0fdf9]'
                        : 'text-gray-400 md:text-gray-700 md:border-gray-200 md:bg-white md:hover:border-[#0F9B73]'
                      }
                    `}
                  >
                    {/* 아이콘 */}
                    <span className="text-2xl md:text-xl md:order-2">{card.icon}</span>
                    
                    {/* 라벨 */}
                    <span className="text-[10px] font-bold md:text-[15px] md:order-1">{card.label}</span>
                    
                    {/* 모바일 활성화 점 (데스크탑에선 숨김) */}
                    {activeSection === card.key && (
                      <div className="w-1 h-1 bg-[#0F9B73] rounded-full md:hidden" />
                    )}
                  </div>
                ))}
                {/* 아이폰 하단 홈바 대응 (데스크탑에선 0) */}
                <div className="h-[env(safe-area-inset-bottom)] md:h-0" />
              </div>

            </div>

            {/* 섹션 컨텐츠 렌더링 영역 */}
            <div key={activeSection} className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px] animate-[fadeIn_0.3s_ease-in-out]">
              {renderSection()}
            </div>
          </section>
        </div>
      </div>

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