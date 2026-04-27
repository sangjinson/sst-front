import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroBanner from '../../components/common/HeroBanner';


const PlayList = lazy(() => import('./play/List'));
const FoodList = lazy(() => import('./food/List'));
const SeeList = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));

function AreaListTemplate() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    const { type } = useParams();
    const renderList = () => {
      switch (type) {
        case 'play':
          return <PlayList />;
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