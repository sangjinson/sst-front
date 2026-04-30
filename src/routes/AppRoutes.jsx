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

import CommunityHotplace from "@pages/showcase/hotplace/CommunityHotplace";
import CommunityHotplaceDetail from "@pages/showcase/hotplace/CommunityHotplaceDetail";
import CommunityHotplaceWrite from "@pages/showcase/hotplace/CommunityHotplaceWrite";

import CommunityLife from "@pages/showcase/life/CommunityLife";
import CommunityLifeDetail from "@pages/showcase/life/CommunityLifeDetail";
import CommunityLifeWrite from "@pages/showcase/life/CommunityLifeWrite";

import SearchPage from '@pages/search/SearchPage';
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';

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

      {/* 관리자 임시 경로!! */}
      <Route path="/admin1" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="members" element={<MemberList />} />
        <Route path="area/:type" element={<AreaPostList />} />
        <Route path="report" element={<ReportList />} />
        <Route path="report/:id" element={<ReportDetail />} />
        <Route path="showcase/hotplace" element={<HotplaceList />} />
        <Route path="showcase/life" element={<LifeList />} />
      </Route>

      {/* 공개 접근 가능 페이지 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<UserLayout />}>
        <Route path="/search/:keyword" element={<SearchPage />} />
      </Route>

      {/* 로그인/회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/signup" element={<SignupPage />} />

      {/* 일반 사용자 권한 (USER, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>

        {/* 마이페이지 */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="mypage" element={<MyPage />} />
        </Route>

        {/* 커뮤니티 (뽐낼거리) */}
        <Route path="/showcase" element={<UserLayout />}>
          <Route index element={<CommunityHotplace />} />

          {/* 핫플거리 */}
          <Route path="hotplace" element={<CommunityHotplace />} />
          <Route path="hotplace/view/:id" element={<CommunityHotplaceDetail />} />
          <Route path="hotplace/write" element={<CommunityHotplaceWrite />} />
          <Route path="hotplace/write/:id" element={<CommunityHotplaceWrite />} />

          {/* 인생거리 */}
          <Route path="life" element={<CommunityLife />} />
          <Route path="life/view/:id" element={<CommunityLifeDetail />} />
          <Route path="life/write" element={<CommunityLifeWrite />} />
        </Route>

        {/* 고객센터 */}
        <Route path="/customersupport" element={<UserLayout />}>
          <Route path="notice" element={<Notice />} />
          <Route path="faq" element={<Faq />} />
        </Route>

        {/* 내거리(일정) */}
        <Route path="/plan" element={<UserLayout />}>
          <Route index element={<AIPlanPage />} />
          <Route path="result" element={<AIPlanResultPage />} />
        </Route>

        {/* 메인페이지 */}
        <Route path="/:region">
          <Route element={<UserLayout />}>
            <Route index element={<MainPage />} />
          </Route>
        </Route>

        {/* 사거리 탬플릿 */}
        <Route path="/:region" element={<AreaBaseTemplate />}>
          <Route path=":type/list" element={<AreaListTemplate />} />
          <Route path=":type/view" element={<AreaViewTemplate />} />
        </Route>

      </Route>

      {/* 관리자 전용 권한 (ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;