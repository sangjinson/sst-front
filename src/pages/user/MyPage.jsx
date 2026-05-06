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
  const [activeSection, setActiveSection] = useState(location.state?.tab || 'member');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileImg, setProfileImg] = useState(
    'https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png'
  );

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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 🚀 전체 컨테이너를 잡고, 그 안에서 브레드크럼과 아래쪽(사이드바+본문) 영역을 수직으로 나눔 */}
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-10 lg:py-10">
        
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
          {!loading && profile && (
            <Sidebar profile={profile} profileImg={profileImg} />
          )}

          {/* 메인 컨텐츠 */}
          <section className="flex-1 min-w-0 flex flex-col gap-4 w-full">
            {/* 카드 메뉴 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {CARDS.map((card) => (
                <div key={card.key} onClick={() => setActiveSection(card.key)}
                  className={`bg-white border-[1.5px] rounded-2xl p-4 md:p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1 ${
                    activeSection === card.key
                      ? 'border-[#0F9B73] bg-[#f0fdf9] shadow-md'
                      : 'border-gray-200 shadow-sm hover:border-[#0F9B73]'
                  }`}>
                  <span className={`text-sm font-bold self-start ${activeSection === card.key ? 'text-[#0F9B73]' : 'text-gray-700'}`}>
                    {card.label}
                  </span>
                  <div className={`w-12 h-12 md:w-[58px] md:h-[58px] rounded-full border-[3px] flex items-center justify-center text-xl md:text-2xl transition-colors ${
                    activeSection === card.key ? 'border-[#0F9B73]' : 'border-blue-500'
                  }`}>
                    {card.icon}
                  </div>
                </div>
              ))}
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