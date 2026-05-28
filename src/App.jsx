import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import AppRoutes from '@routes/AppRoutes';
import { useAuth } from '@hooks/useAuth';
import { useConfig } from '@hooks/useConfig';

function App() {
  // 1. 인증 상태 확인
  const { loading } = useAuth();
  
  // 2. 설정값에서 현재 페이지 제목 가져오기
  const { getConfig } = useConfig();
  const pageTitle = getConfig('pageTitle') || '거리에섯';

  // 3. 로딩 처리
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-gray-500">
        인증 정보를 확인 중입니다...
      </div>
    );
  }

  return (
    <HelmetProvider>
      {/* 🚀 앱 최상단에서 통합 관리되는 전역 Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
