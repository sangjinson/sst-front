import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import TopPickDeck from '@components/card/TopPickDeck';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';
import MainSkeleton from '@components/skeleton/MainSkeleton';

import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값

// ----------------------------------------------------
// 무작위 추출 유틸리티
// ----------------------------------------------------
const getRandomItems = (arr, num) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const convertPlaceToCardItem = (place) => {
  const categoryMap = {
    PLC001: { tag: '볼거리', type: 'see', group: 'attractions' },
    PLC002: { tag: '놀거리', type: 'play', group: 'plays' },
    PLC003: { tag: '먹거리', type: 'food', group: 'foods' },
    PLC004: { tag: '잘거리', type: 'sleep', group: 'sleeps' },
  };

  const category = categoryMap[place.plcCatCd] || {
    tag: '볼거리',
    type: 'see',
    group: 'attractions',
  };

  return {
    id: place.plcNo,
    plcId: place.plcId,
    tag: category.tag,
    type: category.type,
    group: category.group,
    title: place.plcName,
    desc: place.plcOverview,
    img: place.plcMainImgUrl || null,
  };
};

const MainPage = () => {
  
  const {getConfig, setConfig} = useConfig();   // Config 값 가져오기
  const [isLoading, setIsLoading] = useState(true);
  const [placeList, setPlaceList] = useState([]); // Main content 리스트의 최신 데이터

  // Index Banner 설정
  const curRegion = getConfig('curRegion');                 // 지역 Obj
  const curRegionCode = getConfig('curRegion.code');        // 지역 코드
  const curRegionEn = getConfig('curRegion.textEn');        // 지역 영문명
  const curRegionKr = getConfig('curRegion.textKor');       // 지역 한글명
  const curRegionBg = getConfig('curRegion.bannerImg');     // 지역 배너
  const curRegionDesc = getConfig('curRegion.description'); // 지역 설명

  {/* 지역 코드(위치)가 변경된다면 데이터를 불러온다. */}
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPlaces = async () => {
        if (!curRegionCode) return; // 코드가 아직 준비되지 않은 경우. (로딩 전)
        try {
            setIsLoading(true);
            // URL 파라미터 뒤질 필요 없이, Context에 있는 코드를 바로 꽂아버립니다.
            const response = await fetch(`/api/home/places?regionCode=${curRegionCode}`);
            if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);

            const data = await response.json();
            const convertedData = Array.isArray(data) ? data.map(convertPlaceToCardItem) : [];

            setPlaceList(convertedData);  // 플레이 리스트를 갱신한다.
        } catch (error) {
            console.error('데이터 조회 실패:', error);
            setPlaceList([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchPlaces();

    // 지역 코드가 바뀔 때마다(=지역이 바뀔 때마다) 알아서 데이터를 새로 가져옵니다.
  }, [curRegionCode]);

  // 각 Section 별로 내용을 분기한다.
  const { attractions, plays, sleeps, foods } = useMemo(() => {
    return placeList.reduce(
      (acc, item) => {
        if (acc[item.group]) { acc[item.group].push(item); }
        return acc;
      },
      { attractions: [], plays: [], sleeps: [], foods: [] } // 초기값 설정
    );
  }, [placeList]);

  /* Main Section들의 내용을 섞는다. */
  const { topPicks, randomSections } = useMemo(() => {
    // 각 카테고리별로 랜덤 아이템 추출 (Top용 1개, 섹션용 3개)
    const getRandomData = (list, count) => getRandomItems(list, count);

    const rawPicks = {
      see: getRandomData(attractions, 1)[0],
      play: getRandomData(plays, 1)[0],
      sleep: getRandomData(sleeps, 1)[0],
      food: getRandomData(foods, 1)[0],
    };

    // 컨첸츠 상단 큐레이션용 topPicks 배열 생성
    const picks = Object.entries(rawPicks)
      .filter(([_, item]) => item) // 데이터가 있는 경우만
      .map(([type, item]) => ({ ...item, type }));

    // 컨첸츠 상단 외 섹션별 추출된 데이터 객체
    const sections = {
      attractions: getRandomData(attractions, 3),
      plays: getRandomData(plays, 3),
      sleeps: getRandomData(sleeps, 3),
      foods: getRandomData(foods, 3),
    };

    return { topPicks: picks, randomSections: sections };
  }, [attractions, plays, sleeps, foods]);

  /* Section별 타이틀 및 컨텐츠 값 설정 */
  const categorySections = [
    { title: "놓치지 말아야 할 '볼거리'", pathType: "see", dataList: randomSections.attractions },
    { title: "신나는 '놀거리'", pathType: "play", dataList: randomSections.plays },
    { title: "편안한 '잘거리'", pathType: "sleep", dataList: randomSections.sleeps },
    { title: `${curRegionKr}의 맛, '먹거리'`, pathType: "food", dataList: randomSections.foods },
  ];
  const { region } = useParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // ----------------------------------------------
  // ::: EVENTS OR LISTENENR
  // ----------------------------------------------

  // 더보기 링크 클릭시 
  const handleMoreClick = (pathType) => { navigate(`/${curRegionEn}/${pathType}/list`); };

  // Section 카드 클릭시
  const handleCardClick = (pathType, item) => {
    navigate(`/${curRegionEn}/${pathType}/view?id=${item.id}`, {
      state: { selectedRegion: curRegionEn, selectedItem: item, food: item }
    });
  };

  // ----------------------------------------------
  // ::: PAGE RETURN
  // ----------------------------------------------
  
  // 현재 로딩 중이라면
  if (isLoading) { return <MainSkeleton />; }

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      {/* Index 상단 배너 */}
      <HeroBanner bgImage={curRegionBg} title={curRegionKr} subtitle={curRegionDesc} />
      
      {/* Index Content 내용 */}
      <div className='container'>
        <div className="mx-auto px-4 py-6 md:py-10">
  
          <Breadcrumb
            paths={[ { label: '홈', to: '/' }, { label: curRegionKr } ]}
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
              <TopPickDeck items={topPicks} onDetailClick={handleCardClick} />
            </section>
          )}

          {/* Section 2 ~ : 섹션 리스트 */}
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
