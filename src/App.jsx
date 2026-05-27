import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from '@routes/AppRoutes';
import { ThemeProvider } from '@context/ThemeContext'; // 🚀 위치 확인
import { SidebarProvider } from '@context/SidebarContext'; // 🚀 위치 확인

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
    // 🚀 Context 최상단 배치: Router보다 위에 있어야 전체 페이지가 상태를 공유함
    <ThemeProvider>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
