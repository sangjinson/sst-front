import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickCard from '@components/card/TopPickCard';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';
import MainSkeleton from '@components/skeleton/MainSkeleton';
import regionData from '@pages/main/regionData.json';

// ----------------------------------------------------
// 1. 배너 이미지 설정
// ----------------------------------------------------
const bannerImages = {
  수원시: '/banners/수원시.png',
  성남시: '/banners/성남시.png',
  용인시: '/banners/용인시.png',
  안양시: '/banners/안양시.png',
  안산시: '/banners/안산시.png',
  과천시: '/banners/과천시.png',
  광명시: '/banners/광명시.png',
  광주시: '/banners/광주시.png',
  군포시: '/banners/군포시.png',
  부천시: '/banners/부천시.png',
  시흥시: '/banners/시흥시.png',
  안성시: '/banners/안성시.png',
  오산시: '/banners/오산시.png',
  의왕시: '/banners/의왕시.png',
  이천시: '/banners/이천시.png',
  평택시: '/banners/평택시.png',
  하남시: '/banners/하남시.png',
  화성시: '/banners/화성시.png',
  여주시: '/banners/여주시.png',
  양평군: '/banners/양평시.png',
  고양시: '/banners/고양시.png',
  구리시: '/banners/구리시.png',
  남양주시: '/banners/남양주시.png',
  동두천시: '/banners/동두천시.png',
  양주시: '/banners/양주시.png',
  의정부시: '/banners/의정부시.png',
  파주시: '/banners/파주시.png',
  포천시: '/banners/포천시.png',
  연천군: '/banners/연천군.png',
  가평군: '/banners/가평군.png',
  김포시: '/banners/김포시.png',
};

const defaultBanner = '/banners/수원시.png';

// ----------------------------------------------------
// 2. 지역별 서브타이틀
// ----------------------------------------------------
const regionSubtitles = {
  수원시: '정조의 효심과 화성의 기상이 깃든, 미래를 여는 수반 도시',
  성남시: '대한민국의 미래를 설계하는 IT의 심장인 명품 도시',
  용인시: '반도체의 미래와 전통과 첨단이 공존하는 스마트 도시',
  안양시: '안양천의 여유와 예술궁원의 감성이 숨 쉬는, 스마트 행복 도시',
  안산시: '다채로운 문화가 어우러지고 서해의 바람이 쉼표를 찍는 도시',
  과천시: '위엄과 서울대공원의 설렘이 공존하는, 품격 있는 전원 도시',
  광명시: '빛이 머무는 동굴의 기적과 사통팔달 교통의 중심 도시',
  광주시: '천년의 역사와 청정 자연이 숨 쉬는 문화 예술 도시',
  군포시: '수리산의 정기와 설렘이 머무는, 책 읽는 행복 도시',
  부천시: '영상과 선율이 흐르는 문화 예술 도시',
  시흥시: '생명의 호수와 미래 해양 산업이 피어나는 도시',
  안성시: '예술의 흥이 넘치는 풍요로운 도시',
  오산시: '기개와 교육의 열정이 피어나는, 작지만 강한 활력 도시',
  의왕시: '백운호수의 낭만과 철도 박물관의 역사가 만나는, 푸른 생태 도시',
  이천시: '도자와 쌀의 고장, 전통과 현대가 조화로운 도시',
  평택시: '첨단 산업과 국제 교류가 활발한, 비상하는 희망 도시',
  하남시: '한강의 물결과 미사의 젊음이 만나는 도시',
  화성시: '전통과 현대가 공존하는 도시',
  여주시: '은빛 물결과 세종대왕의 지혜가 흐르는, 역사 문화 도시',
  양평군: '두 강이 만나는 설렘과 천년의 숲이 맞이하는 쉼표의 도시',
  고양시: '호수와 문화가 공존하는 도시',
  구리시: '조선의 숨결이 머무는 작지만 풍요로운 도시',
  남양주시: '다산의 지혜와 한강의 숨결이 어우러진 인문·생태 도시',
  동두천시: '소요산의 절경과 이색 문화가 어우러진 숲의 도시',
  양주시: '600년 역사의 향기와 옥정·회천의 미래가 만나는 감동 도시',
  의정부시: '경기 북부의 관문, 문화 예술이 흐르는 활력 도시',
  파주시: '평화의 길목에서 꽃피는 예술과 출판의 감성 도시',
  포천시: '푸른 호수와 숲의 향기가 흐르는 숲의 도시',
  연천군: '한탄강의 신비가 흐르는 평화 도시',
  가평군: '북한강의 낭만과 잣나무 숲의 휴식이 만나는 사계절 힐링 도시',
  김포시: '한강의 물결과 서해의 바람이 만나는, 금빛 미래의 수변 도시',
};

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, region]);

  const currentRegion = regionKor || '수원시';
  const currentBannerImage = bannerImages[currentRegion] || defaultBanner;
  const currentSubtitle = regionSubtitles[currentRegion] || '경기도의 매력을 발견하세요';

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

  if (isLoading) {
    return <MainSkeleton />;
  }

  const categorySections = [
    { title: "놓치지 말아야 할 '볼거리'", pathType: "see", dataList: randomAttractions },
    { title: "신나는 '놀거리'", pathType: "play", dataList: randomPlays },
    { title: "편안한 '잘거리'", pathType: "sleep", dataList: randomSleeps },
    { title: `${currentRegion}의 맛, '먹거리'`, pathType: "food", dataList: randomFoods },
  ];

  return (
    <div className="min-h-screen bg-white pb-[50px] md:pb-[100px]">

      <HeroBanner
        bgImage={currentBannerImage}
        title={currentRegion}
        subtitle={currentSubtitle}
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
              <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900">
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
  );
};

export default MainPage;