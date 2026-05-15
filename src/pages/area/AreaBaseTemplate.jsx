import { Outlet, useParams } from 'react-router-dom';


{/* Layouts */}
import MainHeader from '@layouts/user/headers/MainHeader';
import MainFooter from '@layouts/user/footers/MainFooter';

const AreaBaseTemplate = () => {
  const { region } = useParams();
  const { type } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header 영역 */}
      <MainHeader />

      {/* Content 영역 */}
      <main style={{ flex: 1}}>
          <Outlet context={
            { 
              selectedRegion: region ?? "",
              selectedType: type ?? "" 
            }
          } />
      </main>

      {/* Footer 영역 */}
      <MainFooter />
    </div>
  );
};

export default AreaBaseTemplate;