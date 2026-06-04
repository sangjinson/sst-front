import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TopPickDeck from '@components/card/TopPickDeck';
import HeroBanner from '@components/common/HeroBanner';
import CategorySection from '@components/card/CategorySection';
import Breadcrumb from '@components/common/Breadcrumb';
import MainSkeleton from '@components/skeleton/MainSkeleton';
import api from '@api/axios';

import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값
import { toRegion } from '@utils/regionMap';

// ----------------------------------------------------
// 무작위 추출 유틸리티
// ----------------------------------------------------
const getRandomItems = (arr, num) => {
  if (!arr || arr.length === 0) return [];

  //  1. 이미지가 있는 객체와 없는 객체를 분리
  // img 필드가 존재하고 빈 문자열이 아닌 경우를 필터링
  const withImage = arr.filter(item => item.img && item.img.trim() !== '');
  const withoutImage = arr.filter(item => !item.img || item.img.trim() === '');

  //  2. 배열을 섞어주는 헬퍼 함수
  const shuffle = (list) => [...list].sort(() => 0.5 - Math.random());

  //  3. 이미지가 있는 배열을 우선 배치하고, 그 뒤에 이미지가 없는 배열을 이어붙임
  const prioritizedList = [...shuffle(withImage), ...shuffle(withoutImage)];

  //  4. 최종적으로 필요한 개수(num)만큼 잘라서 반환
  return prioritizedList.slice(0, num);
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
  
  const {getConfig} = useConfig();   // Config 값 가져오기
  const { region } = useParams();
  const routeRegion = useMemo(() => toRegion(region), [region]);
  const [isLoading, setIsLoading] = useState(true);
  const [placeList, setPlaceList] = useState([]); // Main content 리스트의 최신 데이터
  const [topPickList, setTopPickList] = useState([]); // 상단 추천 카드 전용 데이터

  // Index Banner 설정
  const curRegionCode = routeRegion?.code ?? getConfig('curRegion.code');          // 지역 코드
  const curRegionEn = routeRegion?.textEn ?? getConfig('curRegion.textEn');        // 지역 영문명
  const curRegionKr = routeRegion?.textKor ?? getConfig('curRegion.textKor');      // 지역 한글명
  const curRegionBg = routeRegion?.bannerImg ?? getConfig('curRegion.bannerImg');  // 지역 배너
  const curRegionDesc = routeRegion?.description ?? getConfig('curRegion.description'); // 지역 설명

  {/* 지역 코드(위치)가 변경된다면 데이터를 불러온다. */}
  useEffect(() => {
    let ignore = false;

    window.scrollTo(0, 0);
    const fetchPlaces = async () => {
        if (!curRegionCode) {
          setPlaceList([]);
          setTopPickList([]);
          setIsLoading(false);
          return;
        }

        try {
            setIsLoading(true);
            setPlaceList([]);
            setTopPickList([]);
            // URL의 지역 기준으로 상단 추천과 하단 랜덤 리스트 데이터를 분리해서 가져옵니다.
            const [placesResponse, topPicksResponse] = await Promise.all([
              api.get('/home/places', {
                params: { regionCode: curRegionCode },
              }),
              api.get('/home/top-picks', {
                params: { regionCode: curRegionCode },
              }),
            ]);
            const placesData = placesResponse.data;
            const topPicksData = topPicksResponse.data;
            const convertedData = Array.isArray(placesData) ? placesData.map(convertPlaceToCardItem) : [];
            const convertedTopPicks = Array.isArray(topPicksData) ? topPicksData.map(convertPlaceToCardItem) : [];

            if (ignore) return;

            setPlaceList(convertedData);  // 플레이 리스트를 갱신한다.
            setTopPickList(convertedTopPicks);  // 상단 추천 카드 리스트를 갱신한다.
        } catch (error) {
            if (ignore) return;

            console.error('데이터 조회 실패:', error);
            setPlaceList([]);
            setTopPickList([]);
        } finally {
            if (!ignore) {
              setIsLoading(false);
            }
        }
    };
    fetchPlaces();

    return () => {
      ignore = true;
    };

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
  const randomSections = useMemo(() => {
    // 각 카테고리별로 랜덤 아이템 추출 (섹션용 3개)
    const getRandomData = (list, count) => getRandomItems(list, count);

    // 컨첸츠 상단 외 섹션별 추출된 데이터 객체
    return {
      attractions: getRandomData(attractions, 3),
      plays: getRandomData(plays, 3),
      sleeps: getRandomData(sleeps, 3),
      foods: getRandomData(foods, 3),
    };
  }, [attractions, plays, sleeps, foods]);

  /* Section별 타이틀 및 컨텐츠 값 설정 */
  const categorySections = [
    { title: "놓치지 말아야 할 '볼거리'", pathType: "see", dataList: randomSections.attractions },
    { title: "신나는 '놀거리'", pathType: "play", dataList: randomSections.plays },
    { title: "편안한 '잘거리'", pathType: "sleep", dataList: randomSections.sleeps },
    { title: `${curRegionKr}의 맛, '먹거리'`, pathType: "food", dataList: randomSections.foods },
  ];
  const navigate = useNavigate();

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
          {topPickList.length > 0 && (
            <section className="mb-[6vw]">
              <div className="text-center mb-8 md:mb-10 border-b-2 border-gray-800 pb-3 md:pb-4">
                <h2 className="fs-up-6 font-bold text-gray-900">
                  방방곡곡 숨어있는 추천을 찾다
                </h2>
              </div>
              <TopPickDeck items={topPickList} onDetailClick={handleCardClick} />
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
