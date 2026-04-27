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
          return  (
            <>
              {/* 히어로 배너 */}
              <HeroBanner 
                bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
                title={regionKor}
                subtitle={`${regionKor}의 대표 먹거리를 소개합니다`}
              />
              <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10'>
                {/* 브레드크럼 */}
                  <Breadcrumb 
                    paths={[
                      { label: '홈', to: '/' },
                      { label: regionKor, to: `/${region}` },
                      { label: '먹거리', to: `/${region}/play/list` }
                      ]} 
                    className="mb-6" // 🚀 여기서는 좁은 여백을 던져줍니다!
                  />
                <FoodList />
              </div>
            </>
            );
            
        case 'see':
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
                    { label: '볼거리', to: `/${region}/see/list` }
                  ]} 
                  className="mb-6" // 🚀 여기서는 좁은 여백을 던져줍니다!
                />
                <SeeList />
              </div>
            </>
          );

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

        default:
          return <div>Not Found</div>;
      }
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        {renderList()}
      </Suspense>
    );
}

export default AreaListTemplate;