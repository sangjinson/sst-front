import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const PlayList = lazy(() => import('./play/List'));
const FoodList = lazy(() => import('./food/List'));
const SeeList = lazy(() => import('./see/List'));
const SleepList = lazy(() => import('./sleep/List'));


function AreaListTemplate() {
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