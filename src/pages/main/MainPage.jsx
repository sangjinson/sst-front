import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickCard from '@components/card/TopPickCard';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';

// 🚀 JSON 파일을 import 합니다!
import regionData from '@pages/main/regionData.json';

// ----------------------------------------------------
// 메인 페이지 전용 스켈레톤 UI 컴포넌트
// ----------------------------------------------------
const MainSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px] animate-pulse">
      
      {/* 1. 배너 스켈레톤 */}
      <div className="w-full h-[300px] md:h-[400px] bg-gray-200"></div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">
        
        {/* 2. 브레드크럼 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 md:mb-[50px]"></div>

        {/* 3. 상단 추천 섹션 스켈레톤 (방방곳곳 숨어있는 추천을 찾다) */}
        <section className="mb-[50px] md:mb-[80px]">
          <div className="flex justify-center mb-8 md:mb-10 border-b-2 border-gray-100 pb-3 md:pb-4">
            <div className="h-8 md:h-10 bg-gray-300 rounded w-64 md:w-80"></div>
          </div>
          
          {/* 4칸 그리드 (모바일 1, 태블릿 2, 데스크탑 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={`top-${item}`} className="h-[280px] md:h-[320px] bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </section>

        {/* 4. 카테고리 섹션 스켈레톤 (볼거리, 놀거리, 잘거리, 먹거리) */}
        {[1, 2, 3, 4].map((section) => (
          <div key={`section-${section}`} className="mb-[50px] md:mb-[80px]">
            {/* 타이틀 및 '더보기' 버튼 영역 */}
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
              <div className="h-6 md:h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            {/* 3칸 그리드 (기본 CategorySection은 보통 3개를 보여줍니다) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {[1, 2, 3].map((card) => (
                <div key={`card-${card}`} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

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
  
  const currentRegion = region || '수원시';
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

  // 🚀 데이터 로딩 중이면 스켈레톤 UI를 먼저 렌더링
  if (isLoading) {
    return <MainSkeletonLoader />;
  }

  // 🚀 로딩이 끝나면 실제 화면 렌더링
  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px]"> 
      
      <HeroBanner 
        bgImage={currentBannerImage} 
        title={currentRegion} 
        subtitle="전통과 현대가 공존하는 도시" 
      />

      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10">
        
        <Breadcrumb 
          paths={[
            { label: '홈', to: '/' },
            { label: currentRegion }
          ]} 
          className="mb-6 md:mb-[50px]" 
        />

        {topPicks.length > 0 && (
          <section className="mb-[50px] md:mb-[80px]"> 
            <div className="text-center mb-8 md:mb-10 border-b-2 border-gray-800 pb-3 md:pb-4">
              <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900 font-griun">
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