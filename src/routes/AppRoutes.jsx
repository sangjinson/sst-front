import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '@pages/landing/LandingPage';
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

import MainPage from '@pages/main/MainPage';
import AdminDashboard from '@pages/admin/Dashboard';
import Unauthorized from '@pages/error/Unauthorized';
import MyPage from '@pages/user/MyPage';

import SeeList from '@pages/area/see/List';

import Notice from "@pages/customersupport/Notice";
import NoticeDetail from "@pages/customersupport/NoticeDetail";
import Faq from "@pages/customersupport/Faq";
import FaqDetail from "@pages/customersupport/FaqDetail";
import AreaBaseTemplate from '@pages/area/AreaBaseTemplate';
import AreaListTemplate from '@pages/area/AreaListTemplate';
import AreaViewTemplate from '@pages/area/AreaViewTemplate';


const AppRoutes = () => {
  return (
    <Routes>
      {/* 공개 접근 가능 페이지 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* 볼거리 페이지 */}
      <Route path="/see" element={<SeeList />} />

      {/* 일반 사용자 권한 (USER, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<MainPage />} />
          <Route path="mypage" element={<MyPage />} /> {/* 이 줄을 추가하세요! */}
        </Route>
        <Route path="/customersupport" element={<UserLayout />}>
          <Route path="notice" element={<Notice />} />
          <Route path="notice/:id" element={<NoticeDetail />} />
          <Route path="faq" element={<Faq />} />
          <Route path="faq/:id" element={<FaqDetail />} />
        </Route>

        {/* 사거리 탬플릿 */}
        <Route path="/area" element={<AreaBaseTemplate />}>
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