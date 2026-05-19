import { fileURLToPath, URL } from 'url';
// 🚀 1. vite에서 제공하는 loadEnv 함수를 추가로 import 합니다.
import { defineConfig, loadEnv } from 'vite'; 
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";

// 🚀 2. 기존 객체 반환 방식에서, 화살표 함수를 반환하는 방식으로 변경합니다.
// 함수 인자로 현재 모드(development, production)를 받습니다.
export default defineConfig(({ mode }) => {
  // 🚀 3. loadEnv를 통해 현재 작업 디렉토리(process.cwd())에 있는 .env 파일의 변수들을 불러옵니다.
  const env = loadEnv(mode, process.cwd(), '');

  // 🚀 4. .env에 VITE_API_URL이 선언되어 있다면 그 값을 쓰고, 없으면 로컬 기본값을 사용합니다.
  const apiUrl = env.VITE_API_URL || 'http://localhost:8080';
  // AI 서버 역시 환경 변수 처리를 해두면 나중에 서버 분리/배포 시 매우 편리합니다.
  const aiUrl = env.VITE_AI_API_URL || 'http://localhost:8090';

  return {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@public': fileURLToPath(new URL('./public', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@modules': fileURLToPath(new URL('./src/components/modules', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
        '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
        '@themeadmin': fileURLToPath(new URL('./src/layouts/admin/tailadmin', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl, // 🚀 동적으로 할당된 백엔드 API 주소 적용
          changeOrigin: true,
        },
        '/ai': {
          target: aiUrl, // 🚀 AI 서버 주소 적용
          changeOrigin: true,
        },
        '/uploads': {
          target: apiUrl, // 🚀 이미지/파일 업로드도 스프링 부트 서버를 향하므로 동일한 apiUrl 사용
          changeOrigin: true,
        },
      },
    },
  };
});