import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toKorRegion } from '@utils/regionMap';
import Breadcrumb from '@components/common/Breadcrumb';


//const PlayView = lazy(() => import('./play/View'));
const FoodView = lazy(() => import('./food/View'));
const SeeView = lazy(() => import('./see/View'));
const SleepView = lazy(() => import('./sleep/View'));

const AreaViewTemplate = () => {

  const { region, type } = useParams();
  const regionKor = toKorRegion(region); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type, region]);

  const renderList = () => {
    switch (type) {
      // case 'play':
      //   return <PlayView />;
      case 'food':
        return <FoodView />;
       case 'see':
        return (
          <div className='bg-[#f8f6f0]'>

            <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10 max-w-[1000px]'>

              <Breadcrumb 
                paths={[
                  { label: '홈', to: '/' },
                  { label: regionKor, to: `/${region}` },
                  { label: '볼거리', to: `/${region}/see/list` },
                  { label: '상세정보' }
                ]} 
                className="mb-6"
              />

              <SeeView />
            </div>
          </div>
        );
      case 'sleep':
        return (
            <>
              <div className='bg-[#f8f6f0]'>
                <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10 max-w-[900px]'>
                  {/* 브레드크럼 */}
                  <Breadcrumb 
                    paths={[
                      { label: '홈', to: '/' },
                      { label: regionKor, to: `/${region}` },
                      { label: '잘거리', to: `/${region}/sleep/list` },
                      { label: '상제정보' , to: `/${region}/sleep/view` }
                    ]} 
                    className="mb-6" // 🚀 여기서는 좁은 여백을 던져줍니다!
                  />
                  <SleepView />
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
};

export default AreaViewTemplate;    