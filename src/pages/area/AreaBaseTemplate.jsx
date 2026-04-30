import { Outlet, useParams } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

const AreaBaseTemplate = () => {
  const { region } = useParams();
  const { type } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1}}>
          <Outlet context={
            { 
              selectedRegion: region ?? "",
              selectedType: type ?? "" 
            }
          } />
      </main>
      <Footer />
    </div>
  );
};

export default AreaBaseTemplate;