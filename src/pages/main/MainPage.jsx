import React from 'react';
import '@assets/css/main.css';

const MainPage = () => {
  // --- 기존 데이터 유지 ---
  const streetList = [
    { id: 1, title: '예술의 거리', location: '객사 에이리', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: '낭만의 거리', location: '수변 상업동', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: '숲속의 거리', location: '가평 수목원길', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: '숲속의 거리', location: '가평 수목원길', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14eff40?auto=format&fit=crop&w=400&q=80' },
  ];

  const attractions = [
    { id: 1, tag: '볼거리', title: '수원화성', desc: '유네스코 세계문화유산, 조선시대 성곽 건축의 꽃' },
    { id: 2, tag: '볼거리', title: '화성행궁', desc: '정조대왕이 머물던 아름답고 웅장한 행궁' },
    { id: 3, tag: '볼거리', title: '플라잉수원', desc: '열기구를 타고 하늘에서 내려다보는 수원의 파노라마' },
  ];

  const activities = [
    { id: 1, tag: '잘거리', title: '행궁동 한옥스테이', desc: '고즈넉한 분위기에서 즐기는 특별한 하룻밤' },
    { id: 2, tag: '놀거리', title: '광교 호수공원', desc: '도심 속 힐링 공간, 환상적인 야경 명소' },
    { id: 3, tag: '놀거리', title: '아쿠아플라넷 광교', desc: '도심 속에서 만나는 신비로운 바닷속 탐험' },
  ];

  const foods = [
    { id: 1, tag: '먹거리', title: '수원왕갈비 통닭거리', desc: '영화 "극한직업"으로 유명해진 바로 그 맛!' },
    { id: 2, tag: '먹거리', title: '지동시장 순대타운', desc: '저렴하고 푸짐한 순대볶음의 성지' },
    { id: 3, tag: '먹거리', title: '행궁동 카페거리 (행리단길)', desc: '감성 넘치는 한옥뷰 카페와 맛집 투어' },
  ];

  const renderCategorySection = (title, dataList) => (
    <section className="category-section">
      <div className="section-header">
        <h3 className="section-title"><span className="highlight-bar"></span>{title}</h3>
        <button className="more-btn">더보기 <span>→</span></button>
      </div>
      <div className="category-grid">
        {dataList.map((item) => (
          <div key={item.id} className="category-card">
            <div className="card-img-placeholder"></div>
            <div className="card-content">
              <span className="card-tag">{item.tag}</span>
              <h4 className="card-title">{item.title}</h4>
              <p className="card-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="home-wrapper">
      
      {/* 검색창 섹션은 Header.jsx로 이동했으므로 삭제됨 */}

      {/* 상단 히어로 배너 */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>화성</h1>
          <p>전통과 현대가 공존하는 도시</p>
        </div>
      </section>

      {/* 중앙 콘텐츠 영역 */}
      <div className="main-content-container">
        <div className="breadcrumb">홈 &gt; <strong>화성시</strong></div>

        <section className="street-section">
          <div className="center-title-container">
            <h2 className="center-title">방방곳곳 숨어있는 거리를 찾다</h2>
          </div>
          
          <div className="street-grid">
            {streetList.map((street) => (
              <div key={street.id} className="street-card">
                <img src={street.img} alt={street.title} className="street-img" />
                <div className="street-overlay">
                  <h4>{street.title}</h4>
                  <p>{street.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {renderCategorySection("놓치지 말아야 할 '볼거리'", attractions)}
        {renderCategorySection("편안한 '잘거리'와 신나는 '놀거리'", activities)}
        {renderCategorySection("수원의 맛, '먹거리'", foods)}
      </div>
    </div>
  );
};

export default MainPage;