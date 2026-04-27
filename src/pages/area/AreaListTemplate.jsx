import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import HeroBanner from '../../components/common/HeroBanner';
import Breadcrumb from '@components/common/Breadcrumb';
import { toKorRegion } from '@utils/regionMap';

const PlayList = lazy(() => import('./play/List'));
const FoodList = lazy(() => import('./food/List'));
const SeeList = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

// ----------------------------------------------------
// 리스트 페이지 전용 스켈레톤 UI (로딩 바)
// ----------------------------------------------------
const ListSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f0] animate-pulse">
      {/* 1. 상단 배너 스켈레톤 */}
      <div className="w-full h-[300px] md:h-[400px] bg-gray-200"></div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* 2. 브레드크럼 스켈레톤 */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 md:mb-10"></div>

        {/* 3. 필터 및 정렬 버튼 영역 스켈레톤 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2">
            <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* 4. 카드 그리드 스켈레톤 (기본 6개 노출) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* 썸네일 이미지 영역 */}
              <div className="h-48 w-full bg-gray-200"></div>
              {/* 카드 텍스트 정보 영역 */}
              <div className="p-4">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                {/* 하단 위치 및 가격 영역 */}
                <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function AreaListTemplate() {
  
    const { region, type } = useParams(); {/* URL 파라메터 */}
    const regionKor = toKorRegion(region); 

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [type, region]);
   
    const renderList = () => {
      switch (type) {
        case 'play':
          return (
            <>
              {/* 히어로 배너 */}
              <HeroBanner 
                bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
                title={regionKor}
                subtitle={`${regionKor}의 거리에서 놀아보자`}
              />
              <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10'>
                {/* 브레드크럼 */}
                <Breadcrumb 
                  paths={[
                    { label: '홈', to: '/' },
                    { label: regionKor, to: `/${region}` },
                    { label: '놀거리', to: `/${region}/play/list` }
                  ]} 
                  className="mb-6" // 🚀 여기서는 좁은 여백을 던져줍니다!
                />
                <PlayList />
              </div>
            </>
          );
        case 'food':
          return <FoodList />;
        case 'see':
          return <SeeList />;
        case 'sleep':
          return (
            <>
              <div className='bg-[#f8f6f0]'>
                {/* 히어로 배너 */}
                <HeroBanner 
                  bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
                  title={regionKor}
                  subtitle={`${regionKor}의 편안한 숙소를 찾아보세요`}
                />
                <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10 max-w-[1200px]'>
                  {/* 브레드크럼 */}
                  <Breadcrumb 
                    paths={[
                      { label: '홈', to: '/' },
                      { label: regionKor, to: `/${region}` },
                      { label: '잘거리', to: `/${region}/sleep/list` }
                    ]} 
                    className="mb-6" // 🚀 여기서는 좁은 여백을 던져줍니다!
                  />
                  <SleepList />
                </div>
              </div>
            </>
          );

  return (
    // 기존 <div>Loading...</div> 대신 스켈레톤 UI 컴포넌트를 fallback으로 지정
    <Suspense fallback={<ListSkeletonLoader />}>
      {renderList()}
    </Suspense>
  );
}

export default AreaListTemplate;