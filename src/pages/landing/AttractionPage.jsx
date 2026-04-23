import React from 'react';
import '@assets/css/landing.css';

import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import UserLayout from '@layouts/UserLayout';
import AttractionCard from '@components/common/AttractionCard';

const dummyData = [
    {
        title: '수원화성',
        location: '경기도 수원시 장안구 영화동 190',
        tag: '지역명소',
        image: '/assets/images/sample1.jpg',
    },
    {
        title: '국립현대미술관 과천',
        location: '경기도 과천시 광명로 313',
        tag: '박물관',
        image: '/assets/images/sample2.jpg',
    },
    {
        title: '가평 아침고요수목원',
        location: '경기도 가평군 상면 수목원로 432',
        tag: '지역명소',
        image: '/assets/images/sample3.jpg',
    },
    {
        title: '실학박물관',
        location: '경기도 남양주시 조안면 다산로747번길 16',
        tag: '박물관',
        image: '/assets/images/sample4.jpg',
    },
    ];

    const AttractionPage = () => {
    return (
        <UserLayout>
        <Header />

        <section className="hero">
            <div className="hero-overlay">
            <h1>수원</h1>
            <p>정조의 효심과 화성의 기상이 깃든, 미래를 여는 수부 도시</p>
            </div>
        </section>

        <div className="container">
            <div className="breadcrumb">
            홈 &gt; 수원시 &gt; 볼거리
            </div>

            <div className="category">
            <button className="active">전체</button>
            <button>박물관</button>
            <button>도서관</button>
            <button>지역명소</button>
            <button>공원</button>
            </div>

            <div className="sort">
            <button className="active">최신순</button>
            <button>인기순</button>
            </div>

            {/* 🔥 여기만 바뀜 */}
            <div className="card-grid">
            {dummyData.map((item, idx) => (
                <AttractionCard key={idx} item={item} />
            ))}
            </div>

            <div className="pagination">
            <button>{'<'}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>{'>'}</button>
            </div>
        </div>

        <Footer />
        </UserLayout>
    );
};

export default AttractionPage; 