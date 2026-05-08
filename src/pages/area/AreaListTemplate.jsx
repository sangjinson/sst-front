import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HeroBanner from '../../components/common/HeroBanner';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';
import ListSkeleton from '@components/skeleton/ListSkeleton';
import { getSeeDataByRegion } from './see/seeData';
import { getSleepDataByRegion } from './sleep/sleepDummyData';
import { getFoodDataByRegion } from './food/foodData';
import { getPlayDataByRegion } from './play/playData';
  
import TEMP_API_LIST_DATA from './temp/ListData';

const PlayList  = lazy(() => import('./play/List'));
const FoodList  = lazy(() => import('./food/List'));
const SeeList   = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

const REGION_BANNER = {
  수원시: { bgImage: '/banners/수원시.png' },
  성남시: { bgImage: '/banners/성남시.png' },
  용인시: { bgImage: '/banners/용인시.png' },
  안양시: { bgImage: '/banners/안양시.png' },
  안산시: { bgImage: '/banners/안산시.png' },
  과천시: { bgImage: '/banners/과천시.png' },
  광명시: { bgImage: '/banners/광명시.png' },
  광주시: { bgImage: '/banners/광주시.png' },
  군포시: { bgImage: '/banners/군포시.png' },
  부천시: { bgImage: '/banners/부천시.png' },
  시흥시: { bgImage: '/banners/시흥시.png' },
  안성시: { bgImage: '/banners/안성시.png' },
  오산시: { bgImage: '/banners/오산시.png' },
  의왕시: { bgImage: '/banners/의왕시.png' },
  이천시: { bgImage: '/banners/이천시.png' },
  평택시: { bgImage: '/banners/평택시.png' },
  하남시: { bgImage: '/banners/하남시.png' },
  화성시: { bgImage: '/banners/화성시.png' },
  여주시: { bgImage: '/banners/여주시.png' },
  양평군: { bgImage: '/banners/양평시.png' },
  고양시: { bgImage: '/banners/고양시.png' },
  구리시: { bgImage: '/banners/구리시.png' },
  남양주시: { bgImage: '/banners/남양주시.png' },
  동두천시: { bgImage: '/banners/동두천시.png' },
  양주시: { bgImage: '/banners/양주시.png' },
  의정부시: { bgImage: '/banners/의정부시.png' },
  파주시: { bgImage: '/banners/파주시.png' },
  포천시: { bgImage: '/banners/포천시.png' },
  연천군: { bgImage: '/banners/연천군.png' },
  가평군: { bgImage: '/banners/가평군.png' },
  김포시: { bgImage: '/banners/김포시.png' },
};

const LIST_CONFIG = {
  play: {
    Component: PlayList,
    label: '놀거리',
    subtitleSuffix: '의 거리에서 놀아보자',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  sleep: {
    Component: SleepList,
    label: '잘거리',
    subtitleSuffix: '의 편안한 숙소를 찾아보세요',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  food: {
    Component: FoodList,
    label: '먹거리',
    subtitleSuffix: '의 맛있는 음식점을 찾아보세요',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
  see: {
    Component: SeeList,
    label: '볼거리',
    subtitleSuffix: '의 아름다운 명소를 만나보세요',
    bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
  },
};

const LIST_DATA_CONFIG = {
  see: {
    categories: ['전체', '역사', '자연', '랜드마크', '도시공원', '전시장'],
    getItems: getSeeDataByRegion,
  },
  sleep: {
    categories: ['전체', '호텔/모텔', '콘도', '펜션', '캠핑', '게스트하우스'],
    getItems: getSleepDataByRegion,
  },
  food: {
    categories: ['전체', '한식', '중식', '일식', '양식', '카페','간이음식'],
    getItems: getFoodDataByRegion,
  },
  play: {
    categories: ['전체', '축제', '행사', '체험', '레저', '테마파크'],
    getItems: getPlayDataByRegion,
  },
};

const normalizeListItem = (item) => ({
  ...item,
  title: item.title || item.name,
  tag: item.tag || item.category,
  location: item.location || item.address,
  reviews: item.reviews ?? item.reviewCount ?? 0,
});

function AreaListTemplate() {
  const { region, type } = useParams();
  const { pathname } = useLocation();
  const regionKor = toKorRegion(region);

  const [dataSet, setDataSet] = useState({
    totalCount: 0,
    perPage: 12,
    categories: LIST_DATA_CONFIG[type]?.categories || ['전체'],
    items: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ✅ 비동기 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listDataConfig = LIST_DATA_CONFIG[type];

        if (listDataConfig?.getItems) {
          // ✅ see는 async, sleep/food는 동기 함수라 둘 다 처리
          const raw = listDataConfig.getItems(regionKor);
          const items = (raw instanceof Promise ? await raw : raw).map(normalizeListItem);

          setDataSet({
            totalCount: items.length,
            perPage: 12,
            categories: listDataConfig.categories,
            items,
          });
        } else {
          const fallback =
            TEMP_API_LIST_DATA?.[type]?.[regionKor] ??
            TEMP_API_LIST_DATA?.[type]?.['성남시'] ??
            {};
          setDataSet(fallback);
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setDataSet({
          totalCount: 0,
          perPage: 12,
          categories: LIST_DATA_CONFIG[type]?.categories || ['전체'],
          items: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, regionKor]);

  const currentConfig = LIST_CONFIG[type];
  const regionBanner  = REGION_BANNER[regionKor];
  const bgImage  = regionBanner?.bgImage || currentConfig?.bgImage;
  const subtitle = `${regionKor}${currentConfig?.subtitleSuffix}`;

  return (
    <Suspense fallback={<ListSkeleton />}>
      {!currentConfig ? (
        <div className="flex justify-center items-center h-screen text-gray-500">
          잘못된 접근입니다. (Not Found)
        </div>
      ) : (
        <div className="bg-[#f8f6f0] min-h-screen">
          <HeroBanner
            bgImage={bgImage}
            title={regionKor}
            subtitle={subtitle}
            to={`/${region}`}
          />
          <div className="container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px]">
            <Breadcrumb
              paths={[
                { label: '홈', to: '/' },
                { label: regionKor, to: `/${region}` },
                { label: currentConfig.label, to: `/${region}/${type}/list` },
              ]}
              className="mb-3"
            />
            {/* ✅ 로딩 중이면 스켈레톤 */}
            {loading ? (
              <ListSkeleton />
            ) : (
              <currentConfig.Component rows={dataSet} />
            )}
          </div>
        </div>
      )}
    </Suspense>
  );
}

export default AreaListTemplate;