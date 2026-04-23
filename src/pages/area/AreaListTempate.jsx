import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const PlayList = lazy(() => import('./play/PlayList'));
const FoodList = lazy(() => import('./food/FoodList'));
const SeeList = lazy(() => import('./see/SeeList'));
const SleepList = lazy(() => import('./sleep/SleepList'));


function AreaListTempate() {
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

export default AreaListTempate;