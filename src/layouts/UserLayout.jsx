import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

const UserLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, backgroundColor: '#f9f9f9'}}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;