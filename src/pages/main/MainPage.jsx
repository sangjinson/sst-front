import React from 'react';
import { useLocation } from 'react-router-dom';

const bannerImages = {
  '화성시': 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=1920&q=80', // 기존 한옥 배너
  '수원시': 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?auto=format&fit=crop&w=1920&q=80', // 수원 예시 이미지
  '부천시': 'https://images.unsplash.com/photo-1570198083995-1f6cc9709d07?auto=format&fit=crop&w=1920&q=80', // 부천 예시 이미지
  // ... 필요한 만큼 지역 추가
};

const defaultBanner = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1920&q=80'; 

const MainPage = () => {
  const location = useLocation();
  const currentRegion = location.state?.selectedRegion || '경기도';

  // 2. 현재 지역에 맞는 배너 이미지 찾기 (없으면 기본 이미지 사용)
  const currentBannerImage = bannerImages[currentRegion] || defaultBanner;
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

  // 반복되는 카테고리 렌더링 영역
  const renderCategorySection = (title, dataList) => (
    <section className="mb-[60px]">
      <div className="flex justify-between items-end mb-[25px]">
        <h3 className="text-[22px] font-bold flex items-center gap-2.5 text-gray-900">
          <span className="inline-block w-1 h-5 bg-[#E26338] rounded-sm"></span>
          {title}
        </h3>
        <button className="bg-[#f5f5f5] border border-[#eee] py-1 px-4 rounded-full text-[12px] text-gray-600 cursor-pointer hover:bg-[#eee] transition-colors">
          더보기 <span>→</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px]">
        {dataList.map((item) => (
          <div key={item.id} className="bg-white border border-[#eee] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] group">
            {/* 썸네일 이미지 공간 (회색 배경) */}
            <div className="w-full h-[180px] bg-[#f0f0f0]"></div>
            <div className="p-5">
              <span className="inline-block bg-[#FFF2E8] text-[#E26338] text-[11px] font-bold py-1 px-2.5 rounded mb-3">
                {item.tag}
              </span>
              <h4 className="text-[18px] font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="w-full bg-white pb-[100px]">
      
      {/* 1. 상단 히어로 배너 (동적 텍스트 적용) */}
      <section 
        className="w-full h-[400px] bg-cover bg-center flex justify-center items-center relative transition-all duration-500"
        style={{ backgroundImage: `url('${currentBannerImage}')` }} // 👈 여기가 핵심입니다!
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white drop-shadow-md">
          <h1 className="font-['GriunFont'] text-[50px] md:text-[80px] mb-[15px] font-black">
            {currentRegion} 
          </h1>
          <p className="text-[18px] md:text-[24px] font-medium tracking-[2px]">전통과 현대가 공존하는 도시</p>
        </div>
      </section>

      {/* 2. 중앙 콘텐츠 영역 */}
      <div className="max-w-[1200px] mx-auto px-5 py-10">
        {/* 브레드크럼에도 동적 텍스트 적용 */}
        <div className="text-[13px] text-gray-500 mb-[50px]">
          홈 &gt; <strong className="text-gray-900">{currentRegion}</strong>
        </div>
        {/* 3. 숨어있는 거리 섹션 */}
        <section className="mb-[80px]">
          <div className="text-center mb-10 border-b-2 border-gray-800 pb-4">
            <h2 className="text-[26px] font-bold text-gray-900">방방곳곳 숨어있는 거리를 찾다</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {streetList.map((street) => (
              <div key={street.id} className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-[0_4px_15px_rgba(0,0,0,0.1)] cursor-pointer hover:-translate-y-1.5 transition-transform duration-300">
                <img src={street.img} alt={street.title} className="w-full h-full object-cover block" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-[30px] pb-5 px-5 text-white">
                  <h4 className="text-[18px] font-bold mb-1">{street.title}</h4>
                  <p className="text-[13px] text-gray-300">{street.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 카테고리별 추천 리스트 (볼거리, 잘/놀거리, 먹거리) */}
        {renderCategorySection("놓치지 말아야 할 '볼거리'", attractions)}
        {renderCategorySection("편안한 '잘거리'와 신나는 '놀거리'", activities)}
        {renderCategorySection("수원의 맛, '먹거리'", foods)}

      </div>
    </div>
  );
};

export default MainPage;