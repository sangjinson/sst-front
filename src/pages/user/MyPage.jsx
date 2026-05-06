import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '@api/axios'; // 🚀 백엔드 통신용 axios
import Breadcrumb from '@components/common/Breadcrumb';

// 🚀 분리된 컴포넌트들 임포트
import Sidebar from '@components/mypage/Sidebar';
import MemberInfo from '@components/mypage/MemberInfo';
import MyShowcase from '@components/mypage/MyShowcase';
import MySchedule from '@components/mypage/MySchedule';
import MyWishlist from '@components/mypage/MyWishlist';

const CARDS = [
  { key: 'member',   label: '회원정보',    icon: '👤' },
  { key: 'showcase', label: '내 뽐낼거리', icon: '🖼️' },
  { key: 'schedule', label: '내 일정관리', icon: '📅' },
  { key: 'wishlist', label: '내 찜목록',   icon: '❤️' },
];

const MyPage = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.tab || 'member');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 프로필 이미지 상태 (사이드바와 회원정보 폼에서 공유)
  const [profileImg, setProfileImg] = useState(
    'https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png'
  );

  // 🚀 컴포넌트 마운트 시 백엔드에서 회원 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await api.get('/member/me');
        const data = response.data.data;
        
        // 🚀 DB 스키마(mbr 접두사)에 맞춰 프론트 상태로 매핑
        setProfile({
          name: data.mbrName,
          nickname: data.mbrNickname,
          phone: data.mbrTelno,
          email: data.mbrEmail,
          zipcode: data.mbrZip,
          address: data.mbrAddr,
          detailAddress: data.mbrDaddr,
          // DB의 날짜 포맷(YYYY-MM-DDTHH:mm:ss)을 잘라서 사용
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
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-10 lg:py-10 flex flex-col lg:flex-row gap-6">
        
        {/* 🚀 사이드바 컴포넌트에 데이터 전달 */}
        {!loading && profile && (
          <Sidebar profile={profile} profileImg={profileImg} />
        )}

        {/* 메인 컨텐츠 */}
        <section className="flex-1 min-w-0 flex flex-col gap-4">
          <Breadcrumb
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]}
            className="mb-0"
          />

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