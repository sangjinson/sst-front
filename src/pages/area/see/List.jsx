import React from 'react';
import '@assets/css/attraction.css';


import AttractionCard from '@components/common/AttractionCard';

const dummyData = [
  {
    title: '수원화성',
    location: '경기도 수원시 장안구 영화동 190',
    tag: '지역명소',
    image: 'https://picsum.photos/300/200?1',
    desc: '유네스코 세계문화유산으로 지정된 조선시대 성곽입니다.',
  },
  {
    title: '국립현대미술관 과천',
    location: '경기도 과천시 광명로 313',
    tag: '박물관',
    image: 'https://picsum.photos/300/200?2',
    desc: '다양한 현대미술 작품을 감상할 수 있는 공간입니다.',
  },
  {
    title: '가평 아침고요수목원',
    location: '경기도 가평군 상면 수목원로 432',
    tag: '지역명소',
    image: 'https://picsum.photos/300/200?3',
    desc: '자연과 함께 힐링할 수 있는 아름다운 수목원입니다.',
  },
  {
    title: '실학박물관',
    location: '경기도 남양주시 조안면 다산로747번길 16',
    tag: '박물관',
    image: 'https://picsum.photos/300/200?4',
    desc: '조선 실학 사상을 소개하는 박물관입니다.',
  },
];

const SeeList = () => {
  return (
    
      
    <>
    
      {/* 🔥 상단 배너 */}
      <div className="attraction-banner">
        
      </div>

      {/* HERO */}
      <section className="attraction-hero">
        <div className="attraction-hero-overlay">
          <h1>수원</h1>
          <p>정조의 효심과 화성의 기상이 깃든, 미래를 여는 수부 도시</p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="attraction-container">

        {/* breadcrumb */}
        <div className="attraction-breadcrumb">
          홈 &gt; 수원시 &gt; 볼거리
        </div>

        {/* 카테고리 + 정렬 */}
        <div className="attraction-top-row">
          <div className="attraction-category">
            <button className="active">전체</button>
            <button>박물관</button>
            <button>도서관</button>
            <button>지역명소</button>
            <button>공원</button>
          </div>

          <div className="attraction-sort">
            <button className="active">최신순</button>
            <button>인기순</button>
          </div>
        </div>

        {/* 카드 */}
        <div className="attraction-card-grid">
          {dummyData.map((item, idx) => (
            <AttractionCard key={idx} item={item} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="attraction-pagination">
          <button>{'<'}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{'>'}</button>
        </div>

      </div>

      
    </>
  );
};

export default SeeList;