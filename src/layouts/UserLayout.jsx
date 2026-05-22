import { Outlet } from 'react-router-dom';
import { ConfigProvider } from '@context/ConfigContext';

{/* Layouts */}
import MainHeader from '@layouts/user/headers/MainHeader';
import MainFooter from '@layouts/user/footers/MainFooter';


const UserLayout = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header 영역 */}
        <MainHeader />

        {/* Content 영역 */}
        <main style={{ flex: 1}}>
          <Outlet />
        </main>

        {/* Footer 영역 */}
        <MainFooter />
      </div>
    </ConfigProvider>
  );
};

export default UserLayout;