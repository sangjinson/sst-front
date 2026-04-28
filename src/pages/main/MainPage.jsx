import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickCard from '@components/card/TopPickCard';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';
import MainSkeleton from '@components/skeleton/MainSkeleton';
// 🚀 JSON 파일을 import 합니다!
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

  // 🚀 로딩 상태 관리 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 페이지나 지역이 바뀔 때마다 로딩 상태 초기화
    setIsLoading(true);

    // 🚀 눈으로 스켈레톤을 확인하기 위한 임시 0.5초 딜레이
    // 실제 서버(API)를 붙이실 때는 이 부분을 지우고 API 응답 후 setIsLoading(false)를 하시면 됩니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, region]);
  
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
    navigate(`/${region}/${pathType}/list`);
  };

  const handleCardClick = (pathType, item) => {
    navigate(`/${region}/${pathType}/view?id=${item.id}`, { 
      state: { selectedRegion: region, selectedItem: item, food: item } 
    });
  };

  // 🚀 데이터 로딩 중이면 스켈레톤 UI를 먼저 렌더링
  if (isLoading) {
    return <MainSkeleton />;
  }

  const categorySections = [
    { title: "놓치지 말아야 할 '볼거리'", pathType: "see", dataList: randomAttractions },
    { title: "신나는 '놀거리'", pathType: "play", dataList: randomPlays },
    { title: "편안한 '잘거리'", pathType: "sleep", dataList: randomSleeps },
    { title: `${currentRegion}의 맛, '먹거리'`, pathType: "food", dataList: randomFoods }, // 🚀 수원 대신 동적 지역명 적용!
  ];

  // 🚀 로딩이 끝나면 실제 화면 렌더링
  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px]"> 
      
      <HeroBanner 
        bgImage={currentBannerImage} 
        title={currentRegion} 
        subtitle="전통과 현대가 공존하는 도시" 
      />
      <div className='container'>
        <div className="mx-auto px-4 py-6 md:py-10">
          
          <Breadcrumb 
            paths={[
              { label: '홈', to: '/' },
              { label: currentRegion }
            ]} 
            className="mb-2 sm:mb-6" 
          />
          {/* Section 1 : 방방곳곳 숨어있는 추천을 찾다  */}
          {topPicks.length > 0 && (
            <section className="mb-[6vw]"> 
              <div className="text-center mb-8 md:mb-10 border-b-2 border-gray-800 pb-3 md:pb-4">
                <h2 className="fs-up-6 font-bold text-gray-900">
                  방방곳곳 숨어있는 추천을 찾다
                </h2>
              </div>
              
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

          {/* 반복되던 4개의 카테고리 섹션을 map으로 깔끔하게 렌더링! */}
          {categorySections.map((section) => (
            <CategorySection 
              key={section.pathType} 
              title={section.title} 
              pathType={section.pathType} 
              dataList={section.dataList} 
              onMoreClick={handleMoreClick} 
              onCardClick={handleCardClick} 
            />
          ))}

        </div>

      </div>
    </div>
  );
};

export default MainPage;