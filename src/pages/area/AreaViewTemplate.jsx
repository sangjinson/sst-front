import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


//const PlayView = lazy(() => import('./play/View'));
const FoodView = lazy(() => import('./food/View'));
const SeeView = lazy(() => import('./see/View'));
const SleepView = lazy(() => import('./sleep/View'));

const AreaViewTemplate = () => {
  const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    const { type } = useParams();
    const renderList = () => {
      switch (type) {
        // case 'play':
        //   return <PlayView />;
        case 'food':
          return <FoodView />;
        case 'see':
          return <SeeView />;
        case 'sleep':
          return <SleepView />;

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