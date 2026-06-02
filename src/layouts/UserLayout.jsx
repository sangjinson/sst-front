import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '@context/ThemeContext'; //  위치 확인

{/* Layouts */}
import MainHeader from '@layouts/user/headers/MainHeader';
import MainFooter from '@layouts/user/footers/MainFooter';


const UserLayout = () => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default UserLayout;