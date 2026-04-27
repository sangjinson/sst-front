import { Outlet, useParams } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

const AreaBaseTemplate = () => {
  const { region } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1}}>
          <Outlet context={{ selectedRegion: region ?? "" }} />
      </main>
      <Footer />
    </div>
  );
};

export default AreaBaseTemplate;