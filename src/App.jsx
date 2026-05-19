import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from '@routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 401 에러 발생 시 불필요한 재시도 방지
      refetchOnWindowFocus: false, // 창 포커스 시 API 자동 재호출 방지
      staleTime: 1000 * 60 * 5, // 5분 동안 캐시된 데이터를 신선(stale)하다고 판단
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {/* 개발 환경에서 쿼리 캐시 상태를 확인할 수 있는 툴 (선택사항) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;