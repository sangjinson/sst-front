import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '@pages/landing/LandingPage';
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

import MainPage from '@pages/main/MainPage';
import AdminDashboard from '@pages/admin/Dashboard';
import Unauthorized from '@pages/error/Unauthorized';
import MyPage from '@pages/user/MyPage';

import Notice from "@pages/customersupport/Notice";
import Faq from "@pages/customersupport/Faq";
import AreaBaseTemplate from '@pages/area/AreaBaseTemplate';
import AreaListTemplate from '@pages/area/AreaListTemplate';
import AreaViewTemplate from '@pages/area/AreaViewTemplate';

import AIPlanPage from '@pages/aiplan/AIPlanPage';
import AIPlanResultPage from '@pages/aiplan/AIPlanResultPage';

// 🚀 새롭게 분리된 커뮤니티 컴포넌트들
import CommunityHotplace from "@pages/showcase/hotplace/CommunityHotplace";
import CommunityHotplaceDetail from "@pages/showcase/hotplace/CommunityHotplaceDetail";
import CommunityHotplaceWrite from "@pages/showcase/hotplace/CommunityHotplaceWrite";

import CommunityLife from "@pages/showcase/life/CommunityLife";
import CommunityLifeDetail from "@pages/showcase/life/CommunityLifeDetail";
import CommunityLifeWrite from "@pages/showcase/life/CommunityLifeWrite";

import SearchPage from '@pages/search/SearchPage';
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';

import OAuthRedirectHandler from '@pages/auth/OAuthRedirectHandler';

import AdminHome from '@pages/user/Home';
import MemberList from '@pages/admin/MemberList';
import AreaPostList from '@pages/admin/AreaPostList';
import ReportList from '@pages/admin/ReportList';
import ReportDetail from '@pages/admin/ReportDetail';
import HotplaceList from '@pages/admin/HotplaceList';
import LifeList from '@pages/admin/LifeList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🚀 공개된 페이지 영역에 OAuth 콜백 주소 추가 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/signup" element={<SignupPage />} />
      
      {/* 🚀 백엔드가 돌려보내 줄 주소와 정확히 일치시켜야 해! */}
      <Route path="/oauth/redirect" element={<OAuthRedirectHandler />} />

      {/* 🚀 2. 비로그인 사용자도 "조회"는 가능한 페이지 영역 (UserLayout 적용) */}
      <Route element={<UserLayout />}>
        <Route path="/search/:keyword" element={<SearchPage />} />

        {/* 고객센터 */}
        <Route path="/customersupport/notice" element={<Notice />} />
        <Route path="/customersupport/faq" element={<Faq />} />

        {/* 🚀 커뮤니티 - 핫플레이스 (목록 및 상세) */}
        <Route path="/showcase/hotplace" element={<CommunityHotplace />} /> 
        <Route path="/showcase/hotplace/view/:id" element={<CommunityHotplaceDetail />} />

        {/* 🚀 커뮤니티 - 일상 (목록 및 상세) */}
        <Route path="/showcase/life" element={<CommunityLife />} /> 
        <Route path="/showcase/life/view/:id" element={<CommunityLifeDetail />} />

        {/* 메인페이지 및 사거리 템플릿 (조회 전용) */}
        <Route path="/:region" element={<MainPage />} />
        <Route path="/:region/:type/list" element={<AreaListTemplate />} />
        <Route path="/:region/:type/view" element={<AreaViewTemplate />} />
      </Route>

      {/* 🚀 3. 반드시 로그인이 필요한 페이지 영역 */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
        <Route element={<UserLayout />}>
          
          {/* 마이페이지 */}
          <Route path="/user/mypage" element={<MyPage />} />

          {/* 🚀 커뮤니티 - 핫플레이스 / 일상 글쓰기 (작성은 무조건 보호됨) */}
          <Route path="/showcase/hotplace/write" element={<CommunityHotplaceWrite />} />
          <Route path="/showcase/hotplace/write/:id" element={<CommunityHotplaceWrite />} />
          <Route path="/showcase/life/write" element={<CommunityLifeWrite />} />
          <Route path="/showcase/life/write/:id" element={<CommunityLifeWrite />} />

          {/* 내거리(일정 관리) */}
          <Route path="/plan" element={<AIPlanPage />} />
          <Route path="/plan/result" element={<AIPlanResultPage />} />
        </Route>
      </Route>

      {/* 🚀 4. 관리자 전용 권한 (ROLE_ 접두사 확인 주의!) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* 추가된 어드민 라우트들이 있다면 여기에 넣으면 돼! */}
        </Route>
      </Route> 
    </Routes>
  );
};

export default AppRoutes;