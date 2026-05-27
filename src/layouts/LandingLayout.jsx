import { Outlet } from 'react-router-dom';

import { ThemeProvider } from '@context/ThemeContext'; // 🚀 위치 확인

{/* Layouts */}
import LandingHeader from '@layouts/user/headers/LandingHeader';
import MainFooter from '@layouts/user/footers/MainFooter';



const LandingLayout = () => {
  return (
    <ThemeProvider>
      <div className="page-wrapper min-h-screen bg-[#f8f6f0]">
        {/* Header 영역 */}
        <LandingHeader />
        
        {/* Content 영역 */}
        <main className="container-fluid flex flex-col mt-10 pb-[5vw]">
          <Outlet />
        </main>

        {/* Footer 영역 */}
        <MainFooter />
      </div>
    </ThemeProvider>
  );
};

export default LandingLayout;