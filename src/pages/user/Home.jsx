import React from 'react';
import '@assets/css/home.css'; // 메인 페이지 전용 CSS

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-content">
        <h1>당신만의 완벽한 여행 일정을<br/>AI와 함께 설계하세요</h1>
        <p>숨겨진 경기도의 매력을 지금 바로 확인해보세요.</p>
        <button className="start-btn">AI 일정 만들기</button>
      </div>
    </div>
  );
};

export default Home;