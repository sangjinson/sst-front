import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickCard from '@components/card/TopPickCard';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';

// 🚀 JSON 파일을 import 합니다! (경로는 실제 파일 위치에 맞게 수정해주세요)
import regionData from '@pages/main/regionData.json';

// ----------------------------------------------------
// 1. 배너 이미지 설정 영역 (이건 JSON에 넣어도 되고 그냥 둬도 됩니다)
// ----------------------------------------------------
const bannerImages = {
  '수원시': 'https://images.unsplash.com/photo-1605833989399-52e8548a3dae?auto=format&fit=crop&w=1920&q=80',
  // ... (나머지 배너 이미지 생략)
};

const defaultBanner = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1920&q=80';

// ----------------------------------------------------
// 무작위 추출 유틸리티
// ----------------------------------------------------
const getRandomItems = (arr, num) => {
  // arr가 undefined이거나 빈 배열일 경우 빈 배열을 반환하도록 방어 코드 추가 (JSON 로드 실패 대비)
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const MainPage = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const currentRegion = region || '수원시';
  const currentBannerImage = bannerImages[currentRegion] || defaultBanner;
  
  // 🚀 import 해온 JSON 데이터(regionData)를 그대로 사용합니다.
  const currentData = regionData[currentRegion] || regionData['수원시'];
  
  // 만약 선택된 지역 데이터가 없다면 빈 배열을 기본값으로 할당하여 에러를 방지합니다.
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
  }, [attractions, plays, sleeps, foods]); // 의존성 배열 업데이트

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
    <div className="w-full bg-white pb-[100px]">
      
      <HeroBanner 
        bgImage={currentBannerImage} 
        title={currentRegion} 
        subtitle="전통과 현대가 공존하는 도시" 
      />

      <div className="max-w-[1200px] mx-auto px-5 py-10">
        
        <Breadcrumb 
          paths={[
            { label: '홈', to: '/' },
            { label: currentRegion }
          ]} 
          className="mb-[50px]"
        />

        {/* topPicks 데이터가 있을 때만 렌더링 */}
        {topPicks.length > 0 && (
          <section className="mb-[80px]">
            <div className="text-center mb-10 border-b-2 border-gray-800 pb-4">
              <h2 className="text-[26px] font-bold text-gray-900 font-griun">방방곳곳 숨어있는 추천을 찾다</h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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