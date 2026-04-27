import React, { useState } from 'react';
import AttractionCard from '@components/card/AttractionCard';

const dummyData = [
  {
    title: '수원화성',
    location: '경기도 수원시 장안구 영화동 190',
    tag: '지역명소',
    region: '수원',
    hashtags: ['유적지', '역사탐방'],
    image: 'https://picsum.photos/300/200?1',
    desc: '유네스코 세계문화유산으로 지정된 조선시대 성곽입니다.',
  },
  {
    title: '국립현대미술관 과천',
    location: '경기도 과천시 광명로 313',
    tag: '박물관',
    region: '과천',
    hashtags: ['전시', '현대미술'],
    image: 'https://picsum.photos/300/200?2',
    desc: '다양한 현대미술 작품을 감상할 수 있는 공간입니다.',
  },
  {
    title: '가평 아침고요수목원',
    location: '경기도 가평군 상면 수목원로 432',
    tag: '지역명소',
    region: '가평',
    hashtags: ['힐링', '자연'],
    image: 'https://picsum.photos/300/200?3',
    desc: '자연과 함께 힐링할 수 있는 아름다운 수목원입니다.',
  },
  {
    title: '실학박물관',
    location: '경기도 남양주시 조안면 다산로747번길 16',
    tag: '박물관',
    region: '남양주',
    hashtags: ['역사', '교육'],
    image: 'https://picsum.photos/300/200?4',
    desc: '조선 실학 사상을 소개하는 박물관입니다.',
  },

  // 🔥 추가 5개
  {
    title: '남한산성',
    location: '경기도 광주시 남한산성면',
    tag: '지역명소',
    region: '광주',
    hashtags: ['성곽', '유네스코'],
    image: 'https://picsum.photos/300/200?5',
    desc: '조선시대 군사적 요충지였던 역사 유적지입니다.',
  },
  {
    title: '에버랜드',
    location: '경기도 용인시 처인구 포곡읍',
    tag: '공원',
    region: '용인',
    hashtags: ['놀이공원', '데이트'],
    image: 'https://picsum.photos/300/200?6',
    desc: '국내 최대 규모의 테마파크로 다양한 놀이기구를 즐길 수 있습니다.',
  },
  {
    title: '파주 헤이리 예술마을',
    location: '경기도 파주시 탄현면',
    tag: '지역명소',
    region: '파주',
    hashtags: ['예술', '감성'],
    image: 'https://picsum.photos/300/200?7',
    desc: '예술과 문화가 공존하는 감성적인 공간입니다.',
  },
  {
    title: '광명동굴',
    location: '경기도 광명시 가학로',
    tag: '지역명소',
    region: '광명',
    hashtags: ['동굴', '체험'],
    image: 'https://picsum.photos/300/200?8',
    desc: '폐광을 활용한 이색 관광지로 다양한 체험이 가능합니다.',
  },
  {
    title: '일산 호수공원',
    location: '경기도 고양시 일산동구',
    tag: '공원',
    region: '고양',
    hashtags: ['산책', '데이트'],
    image: 'https://picsum.photos/300/200?9',
    desc: '넓은 호수와 산책로가 있는 도심 속 힐링 공간입니다.',
  },
];

const categories = ['전체','박물관','도서관','지역명소','공원'];

const SeeList = () => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [sort, setSort] = useState('latest');
  const [activePage, setActivePage] = useState(1); // 🔥 추가

  return (
    <div className="bg-[#f8f6f0] min-h-screen">

      {/* HERO */}
      <section
        className="h-[320px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('/src/assets/images/hero.png')` }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">수원</h1>
          <p className="mt-3 text-lg drop-shadow">
            정조의 효심과 화성의 기상이 깃든 도시
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-[1200px] mx-auto mt-10 px-4">

        {/* breadcrumb */}
        <div className="text-sm mb-5 flex items-center gap-2">
          <span className="text-gray-400 hover:text-gray-600 cursor-pointer">홈</span>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-400 hover:text-gray-600 cursor-pointer">수원시</span>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-900 font-semibold">볼거리</span>
        </div>

        {/* 카테고리 + 정렬 */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">

          {/* 카테고리 */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`
                  px-4 py-2 rounded-full text-sm cursor-pointer
                  border border-gray-200 transition
                  ${
                    activeCategory === item
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-black'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setSort('latest')}
              className={`
                px-4 py-1.5 text-sm rounded-full transition cursor-pointer
                ${
                  sort === 'latest'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-black'
                }
              `}
            >
              최신순
            </button>

            <button
              onClick={() => setSort('popular')}
              className={`
                px-4 py-1.5 text-sm rounded-full transition cursor-pointer
                ${
                  sort === 'popular'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-black'
                }
              `}
            >
              인기순
            </button>
          </div>
        </div>

        {/* 카드 */}
        <div className="grid grid-cols-4 gap-5 mb-12
                lg:grid-cols-3 
                md:grid-cols-2 
                sm:grid-cols-1">
          {dummyData.map((item, idx) => (
            <AttractionCard key={idx} item={item} />
          ))}
        </div>

        {/* 🔥 페이지네이션 */}
        <div className="flex justify-center mt-4 mb-10 items-center gap-2">

          {/* 이전 */}
          <button
            onClick={() => setActivePage(prev => prev > 1 ? prev - 1 : prev)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-900 hover:text-white cursor-pointer transition text-sm"
          >
            ←
          </button>

          {[1,2,3].map((n)=>(
            <button
              key={n}
              onClick={() => setActivePage(n)}
              className={`
                w-9 h-9 rounded-lg text-sm transition cursor-pointer
                flex items-center justify-center
                ${activePage === n 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                  : 'bg-white border border-gray-200 hover:bg-gray-100'}
              `}
            >
              {n}
            </button>
          ))}

          {/* 다음 */}
          <button
            onClick={() => setActivePage(prev => prev + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-900 hover:text-white cursor-pointer transition text-sm"
          >
            →
          </button>

        </div>

      </div>
    </div>
  );
};

export default SeeList;