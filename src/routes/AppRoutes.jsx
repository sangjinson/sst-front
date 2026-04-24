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
import NoticeDetail from "@pages/customersupport/NoticeDetail";
import Faq from "@pages/customersupport/Faq";
import AreaBaseTemplate from '@pages/area/AreaBaseTemplate';
import AreaListTemplate from '@pages/area/AreaListTemplate';
import AreaViewTemplate from '@pages/area/AreaViewTemplate';

import Community from '@pages/showcase/Community';
import CommunityDetail from "@pages/showcase/CommunityDetail";
import CommunityWrite from "@pages/showcase/CommunityWrite";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 공개 접근 가능 페이지 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      

      {/* 일반 사용자 권한 (USER, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>

        {/* 마이페이지 */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="mypage" element={<MyPage />} /> {/* 이 줄을 추가하세요! */}
        </Route>

        {/* 커뮤니티 (뽐낼거리) 추가 */}
          <Route path="/showcase" element={<UserLayout />}>
            {/* /showcase 접속 시 바로 목록 출력 */}
            <Route index element={<Community />} /> 
            {/* 상세 보기 주소: /showcase/view/1 */}
            <Route path="view/:id" element={<CommunityDetail />} />
            {/* 3. 뽐낼거리 글쓰기 페이지 */}
            <Route path="write" element={<CommunityWrite />} />
          </Route>
        

        {/* 고객센터 */}
        <Route path="/customersupport" element={<UserLayout />}>
          <Route path="notice" element={<Notice />} />
          <Route path="notice/:id" element={<NoticeDetail />} />
          <Route path="faq" element={<Faq />} />
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