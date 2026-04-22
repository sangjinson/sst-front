import React from 'react';
import '@assets/css/mypage.css';

const MyPage = () => {
  // 찜 목록 임시 데이터 
  const wishlistItems = Array.from({ length: 8 }).map((_, index) => ({
    id: index,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop', // 예시 이미지 (들판)
    location: '수원시',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }));

  return (
    <div className="mypage-wrapper">
      
      {/* 1. 왼쪽 사이드바 */}
      <aside className="mypage-sidebar">
        
        {/* 프로필 정보 카드 */}
        <div className="box-card">
          <h3>마이페이지</h3>
          <div className="profile-header">
            {/* 프로필 이미지 */}
            <img 
              src="https://randomuser.me/api/portraits/men/44.jpg" 
              alt="프로필 이미지" 
              className="profile-img" 
            />
            <div className="profile-name">홍길동 🏅</div>
            <div className="profile-desc">
              안녕하세요! 홍길동입니다.<br/>
              리액트 참 좋네요! 잘 부탁드려요.
            </div>
          </div>
          
          <ul className="profile-info-list">
            <li><span>🗺️</span> 경기도 성남시 거주</li>
            <li><span>📅</span> 가입일: 2026-04-10</li>
            <li><span>📞</span> 010-5882-1253</li>
            <li><span>✉️</span> hong01@ksmart.or.kr</li>
          </ul>
        </div>

        {/* 프로필 더보기 카드 */}
        <div className="box-card">
          <h3>프로필 더보기</h3>
          <ul className="link-list">
            <li><span>👤</span> 공지사항</li>
            <li><span>🚫</span> 자주 하는 질문</li>
          </ul>
        </div>
      </aside>

      {/* 2. 오른쪽 메인 콘텐츠 */}
      <section className="mypage-content">
        
        {/* 상단 3개 상태 카드 */}
        <div className="stat-cards-container">
          <div className="stat-card">
            <span>회원정보</span>
            <div className="circle-icon">👤</div>
          </div>
          <div className="stat-card">
            <span>내 뽐낼거리</span>
            <div className="circle-icon">🖼️</div>
          </div>
          <div className="stat-card">
            <span>내 일정관리</span>
            <div className="circle-icon">✉️</div>
          </div>
        </div>

        {/* 찜 목록 영역 */}
        <div className="breadcrumb">홈 &gt; 마이페이지 &gt; 내 찜 목록</div>
        
        <div className="wishlist-container">
          <h2>내 찜 목록</h2>
          
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wish-item">
                <img src={item.imageUrl} alt="찜 이미지" className="wish-img" />
                <div className="wish-info">
                  <div className="wish-user">
                    <img src={item.userAvatar} alt="작성자" />
                    <span>{item.location}</span>
                  </div>
                  <div className="wish-heart">❤️</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

    </div>
  );
};

export default MyPage;