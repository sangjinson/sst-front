import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import HeroBanner from '../../components/common/HeroBanner';
import Breadcrumb from '@components/common/Breadcrumb';
import { hasRegion, toKorRegion } from '@utils/regionMap';
import ListSkeleton from '@components/skeleton/ListSkeleton';
import { getSeeDataByRegion } from './see/seeData';
import { getSleepDataByRegion } from './sleep/Sleepdata';
import { getFoodDataByRegion } from './food/foodData';
import { getPlayDataByRegion } from './play/playData';
import { useAuth } from '@hooks/useAuth';
import api from '@api/axios';

const PlayList  = lazy(() => import('./play/List'));
const FoodList  = lazy(() => import('./food/List'));
const SeeList   = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

const REGION_BANNER = {
  수원시: { bgImage: '/banners/수원시.webp' },
  성남시: { bgImage: '/banners/성남시.webp' },
  용인시: { bgImage: '/banners/용인시.webp' },
  안양시: { bgImage: '/banners/안양시.webp' },
  안산시: { bgImage: '/banners/안산시.webp' },
  과천시: { bgImage: '/banners/과천시.webp' },
  광명시: { bgImage: '/banners/광명시.webp' },
  광주시: { bgImage: '/banners/광주시.webp' },
  군포시: { bgImage: '/banners/군포시.webp' },
  부천시: { bgImage: '/banners/부천시.webp' },
  시흥시: { bgImage: '/banners/시흥시.webp' },
  안성시: { bgImage: '/banners/안성시.webp' },
  오산시: { bgImage: '/banners/오산시.webp' },
  의왕시: { bgImage: '/banners/의왕시.webp' },
  이천시: { bgImage: '/banners/이천시.webp' },
  평택시: { bgImage: '/banners/평택시.webp' },
  하남시: { bgImage: '/banners/하남시.webp' },
  화성시: { bgImage: '/banners/화성시.webp' },
  여주시: { bgImage: '/banners/여주시.webp' },
  양평군: { bgImage: '/banners/양평군.webp' },
  고양시: { bgImage: '/banners/고양시.webp' },
  구리시: { bgImage: '/banners/구리시.webp' },
  남양주시: { bgImage: '/banners/남양주시.webp' },
  동두천시: { bgImage: '/banners/동두천시.webp' },
  양주시: { bgImage: '/banners/양주시.webp' },
  의정부시: { bgImage: '/banners/의정부시.webp' },
  파주시: { bgImage: '/banners/파주시.webp' },
  포천시: { bgImage: '/banners/포천시.webp' },
  연천군: { bgImage: '/banners/연천군.webp' },
  가평군: { bgImage: '/banners/가평군.webp' },
  김포시: { bgImage: '/banners/김포시.webp' },
};

const LIST_CONFIG = {
  play: {
    Component: PlayList,
    label: '놀거리',
    subtitleSuffix: '의 거리에서 즐겁게 놀아보세요',
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
    categories: ['전체', '한식', '중식', '일식', '양식', '카페', '간이음식'],
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
  const { user } = useAuth();

  const [dataSet, setDataSet] = useState({
    totalCount: 0,
    perPage: 12,
    categories: LIST_DATA_CONFIG[type]?.categories || ['전체'],
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [wishedPlcNos, setWishedPlcNos] = useState([]); // ✅ 추가

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listDataConfig = LIST_DATA_CONFIG[type];

        // 🚀 listDataConfig.getItems가 무조건 있다고 가정하고 로직을 단순화합니다.
        if (!listDataConfig || !listDataConfig.getItems) {
          throw new Error("유효하지 않은 카테고리입니다.");
        }

        const raw = listDataConfig.getItems(regionKor);
        const items = (raw instanceof Promise ? await raw : raw).map(normalizeListItem);

        setDataSet({
          totalCount: items.length,
          perPage: 12,
          categories: listDataConfig.categories,
          items,
        });

        // 찜 상태 한번에 조회
        if (user?.mbrId && items.length > 0) {
          const plcNos = items.map(item => item.id).filter(Boolean);
          try {
            const wishRes = await api.get('/wishlist/check-bulk', {
              params: { mbrId: user.mbrId, plcNos: plcNos.join(',') }
            });
            setWishedPlcNos(wishRes.data);
          } catch (err) {
            console.error('찜 상태 조회 실패:', err);
          }
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        // 🚀 에러가 나거나 데이터가 없을 때는 가짜 데이터를 보여주지 말고 빈 화면을 구성합니다.
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
  }, [type, regionKor, user?.mbrId]);

  const currentConfig = LIST_CONFIG[type];
  const isInvalidRoute = !hasRegion(region) || !currentConfig;
  const regionBanner  = REGION_BANNER[regionKor];
  const bgImage  = regionBanner?.bgImage || currentConfig?.bgImage;
  const subtitle = `${regionKor}${currentConfig?.subtitleSuffix}`;

  if (isInvalidRoute) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Suspense fallback={<ListSkeleton />}>
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
          {loading ? (
            <ListSkeleton />
          ) : (
            <currentConfig.Component rows={dataSet} wishedPlcNos={wishedPlcNos} /> // ✅ 추가
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default AreaListTemplate;
