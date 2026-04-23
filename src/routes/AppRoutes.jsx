import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '@pages/landing/LandingPage';
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

import UserHome from '@pages/user/Home';
import AdminDashboard from '@pages/admin/Dashboard';
import Unauthorized from '@pages/error/Unauthorized';
import MyPage from '@pages/user/MyPage';

import Notice from "@pages/customersupport/Notice";
import Faq from "@pages/customersupport/Faq";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 공개 접근 가능 페이지 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 일반 사용자 권한 (USER, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="mypage" element={<MyPage />} /> {/* 이 줄을 추가하세요! */}
        </Route>
        <Route path="/customersupport" element={<UserLayout />}>
          <Route path="notice" element={<Notice />} />
        </Route>
        <Route path="/customersupport" element={<UserLayout />}>
          <Route path="faq" element={<Faq />} />
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