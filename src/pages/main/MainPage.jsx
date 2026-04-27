import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickCard from '@components/card/TopPickCard';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';

// 🚀 JSON 파일을 import 합니다! (경로는 실제 파일 위치에 맞게 수정해주세요)
import regionData from '@pages/main/regionData.json';

// ----------------------------------------------------
// 1. 배너 이미지 설정 영역
// ----------------------------------------------------
const bannerImages = {
  '수원시': 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?auto=format&fit=crop&w=1920&q=80',
  '화성시': 'https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?auto=format&fit=crop&w=1920&q=80',
  '부천시': 'https://images.unsplash.com/photo-1570198083995-1f6cc9709d07?auto=format&fit=crop&w=1920&q=80',
  '용인시': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80',
  '고양시': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
};

const defaultBanner = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1920&q=80';

// ----------------------------------------------------
// 무작위 추출 유틸리티
// ----------------------------------------------------
const getRandomItems = (arr, num) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const MainPage = () => {
  const { region } = useParams();
  const regionKor = toKorRegion(region);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const currentRegion = regionKor || '수원시';
  const currentBannerImage = bannerImages[currentRegion] || defaultBanner;
  
  const currentData = regionData[currentRegion] || regionData['수원시'];
  
  const { 
    attractions = [], 
    plays = [], 
    sleeps = [], 
    foods = [] 
  } = currentData || {};

  const topPicks = useMemo(() => {
    const seeItem = getRandomItems(attractions, 1)[0];
    const playItem = getRandomItems(plays, 1)[0];
    const sleepItem = getRandomItems(sleeps, 1)[0];
    const foodItem = getRandomItems(foods, 1)[0];

    const picks = [];
    if (seeItem) picks.push({ ...seeItem, type: 'see' });
    if (playItem) picks.push({ ...playItem, type: 'play' });
    if (sleepItem) picks.push({ ...sleepItem, type: 'sleep' });
    if (foodItem) picks.push({ ...foodItem, type: 'food' });

    return picks;
  }, [attractions, plays, sleeps, foods]);

  const randomAttractions = useMemo(() => getRandomItems(attractions, 3), [attractions]);
  const randomPlays = useMemo(() => getRandomItems(plays, 3), [plays]);
  const randomSleeps = useMemo(() => getRandomItems(sleeps, 3), [sleeps]);
  const randomFoods = useMemo(() => getRandomItems(foods, 3), [foods]);

  const handleMoreClick = (pathType) => {
    navigate(`/${currentRegion}/${pathType}/list`);
  };

  const handleCardClick = (pathType, item) => {
    navigate(`/${currentRegion}/${pathType}/view?id=${item.id}`, { 
      state: { selectedRegion: currentRegion, selectedItem: item, food: item } 
    });
  };

  return (
    <div className="w-full bg-white pb-[50px] md:pb-[100px]"> {/* 🚀 모바일 하단 여백 축소 */}
      
      <HeroBanner 
        bgImage={currentBannerImage} 
        title={currentRegion} 
        subtitle="전통과 현대가 공존하는 도시" 
        // HeroBanner 컴포넌트 내부에서 반응형 타이포그래피(md:text-[80px] 등)가 작동합니다.
      />

      {/* 🚀 모바일에서는 py-6, 태블릿 이상에서 py-10 */}
      <div className="max-w-[1200px] mx-auto px-5 py-6 md:py-10">
        
        {/* 🚀 모바일에서 브레드크럼 여백 살짝 줄이기 */}
        <Breadcrumb 
          paths={[
            { label: '홈', to: '/' },
            { label: currentRegion }
          ]} 
          className="mb-6 md:mb-[50px]" 
        />

        {topPicks.length > 0 && (
          <section className="mb-[50px] md:mb-[80px]"> {/* 🚀 모바일 섹션 간격 줄이기 */}
            <div className="text-center mb-8 md:mb-10 border-b-2 border-gray-800 pb-3 md:pb-4">
              <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900 font-griun">
                방방곳곳 숨어있는 추천을 찾다
              </h2>
            </div>
            
            {/* 🚀 모바일 1개, 태블릿 2개, 데스크탑 4개 배치 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {topPicks.map((item) => (
                <TopPickCard 
                  key={`${item.type}-${item.id}`} 
                  item={item} 
                  onClick={() => handleCardClick(item.type, item)} 
                />
              ))}
            </div>
          </section>
        )}

        <CategorySection 
          title="놓치지 말아야 할 '볼거리'" 
          pathType="see" 
          dataList={randomAttractions} 
          onMoreClick={handleMoreClick} 
          onCardClick={handleCardClick} 
        />
        <CategorySection 
          title="신나는 '놀거리'" 
          pathType="play" 
          dataList={randomPlays} 
          onMoreClick={handleMoreClick} 
          onCardClick={handleCardClick} 
        />
        <CategorySection 
          title="편안한 '잘거리'" 
          pathType="sleep" 
          dataList={randomSleeps} 
          onMoreClick={handleMoreClick} 
          onCardClick={handleCardClick} 
        />
        <CategorySection 
          title="수원의 맛, '먹거리'" 
          pathType="food" 
          dataList={randomFoods} 
          onMoreClick={handleMoreClick} 
          onCardClick={handleCardClick} 
        />

      </div>
    </div>
  );
};

export default MainPage;