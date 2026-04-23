// 서버 실행
>> yarn dev

// tailwind 설치
>> yarn add tailwindcss @tailwindcss/vite

// 구조
src/
├── assets/               # CSS, 이미지, 폰트 등 정적 리소스
│   ├── css/landing.css
│   └── images/logo.png
├── components/           # 공통/역할별 UI 컴포넌트
│   ├── common/Header.jsx
│   └── common/Footer.jsx
├── context/              # 전역 상태 관리
│   └── AuthContext.jsx
├── hooks/                # 커스텀 훅 모음
│   ├── useAuth.js
│   └── useApi.js
├── layouts/              # 공통 레이아웃
│   ├── UserLayout.jsx
│   └── AdminLayout.jsx
├── pages/                # 실제 렌더링되는 페이지들
│   ├── landing/LandingPage.jsx
│   ├── user/Home.jsx
│   ├── admin/Dashboard.jsx
│   └── error/Unauthorized.jsx
├── routes/               # 라우팅 및 권한 가드
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── utils/                # 설정 및 유틸 함수
│   ├── axiosInstance.js
│   └── api.js
├── App.jsx               # 최상위 컴포넌트
└── main.jsx              # React 진입점
