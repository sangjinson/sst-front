import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroBanner from '../../components/common/HeroBanner';
import NavText from '@modules/NavText';

const PlayList = lazy(() => import('./play/List'));
const FoodList = lazy(() => import('./food/List'));
const SeeList = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

function AreaListTemplate() {
    const { pathname } = useLocation();
    const { region, type } = useParams(); {/* URL 파라메터 */}
    const navigate = useNavigate(); // 

    {/* Navigation Text // */}
    const categoryMap = {
      see: '볼거리',
      food: '먹거리',
      sleep: '숙박',
      play: '놀거리',
    };
    const makeNavItems = ({ region, type }) => {
      const key = type?.toLowerCase();
      return [
        { label: '홈', path: '/' },
        { label: region, path: `/${region}` },
        {
          label: categoryMap[key] || type,
          path: `/${region}/${type}`,
        },
      ];
    };
    {/* // Navigation Text  */}


   

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

   
    const renderList = () => {
      switch (type) {
        case 'play':
          return (
            <>
            {/* 히어로 배너 */}
            <HeroBanner 
              bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
              title={region}
              subtitle={`${region}의 거리에서 놀아보자`}
            />
            <div className='container px-2 sm:px-4 md:px-6 lg:px-0 m-auto py-10'>
              <NavText
                items={makeNavItems({ region, type })}
                className="text-xs sm:text-sm md:text-base mb-6"
                itemClassName="text-gray-500 hover:text-green-600"
                activeClassName="text-black font-semibold"
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
          return <SleepList />;

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