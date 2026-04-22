import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import '@assets/css/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');

  // 실제 경기도 데이터로 구성한 예시
  const citiesSouth = ['수원시', '성남시', '용인시', '안양시', '안산시', '과천시', '광명시', '광주시', '군포시', '부천시', '시흥시', '안성시', '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시', '여주시', '양평군'];
  const citiesNorth = ['고양시', '구리시', '남양주시', '동두천시', '양주시', '의정부시', '파주시', '포천시', '연천군', '가평군'];

  const currentCities = activeTab === '남부' ? citiesSouth : citiesNorth;

  // 메인 페이지(UserHome)로 이동하는 함수
  const enterMainPage = () => {
    // 백엔드 연동 전이므로 임시로 /user 로 이동합니다.
    navigate('/user'); 
  };

  return (
    <div className="landing-wrapper">
      
      {/* 1. 상단 로그인 버튼 (GNB 없음) */}
      <header className="landing-topbar">
        <button className="landing-login-btn">로그인</button>
      </header>

      {/* 2. 중앙 메인 콘텐츠 */}
      <main className="landing-main-content">
        <h1 className="landing-logo">거리에섯</h1>

        {/* 검색창 */}
        <div className="search-container">
          <select className="region-select">
            <option>지역 선택</option>
            <option>테마 선택</option>
          </select>
          <input 
            type="text" 
            placeholder="떠나고 싶은 지역이나 테마를 입력하세요" 
            className="search-input" 
          />
          <button className="search-submit-btn" onClick={enterMainPage}>검색</button>
        </div>

        {/* 지역 선택 탭 및 그리드 */}
        <div className="region-container">
          <div className="region-tabs">
            <button
              className={`tab-btn ${activeTab === '남부' ? 'active' : ''}`}
              onClick={() => setActiveTab('남부')}
            >
              경기 남부
            </button>
            <button
              className={`tab-btn ${activeTab === '북부' ? 'active' : ''}`}
              onClick={() => setActiveTab('북부')}
            >
              경기 북부
            </button>
          </div>

          <div className="city-grid">
            {currentCities.map((city, index) => (
              <button 
                key={index} 
                className="city-btn"
                onClick={enterMainPage} // 클릭 시 메인 페이지로 이동
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 3. 푸터 */}
      <Footer />
    </div>
  );
};

export default LandingPage;