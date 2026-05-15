import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import { ConfigProvider } from '@context/ConfigContext';

const UserLayout = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1}}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default UserLayout;