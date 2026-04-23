import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

const PlayList = lazy(() => import('./play/list'));
const FoodList = lazy(() => import('./food/list'));

function AreaListTempate() {
  const { type } = useParams();

  const renderList = () => {
    switch (type) {
      case 'play':
        return <PlayList />;
      case 'food':
        return <FoodList />;
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