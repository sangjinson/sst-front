import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '@pages/landing/LandingPage';
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

import UserHome from '@pages/user/Home';
import AdminDashboard from '@pages/admin/Dashboard';
import Unauthorized from '@pages/error/Unauthorized';
import MyPage from '@pages/user/MyPage';

import AreaBaseTempate from '@pages/area/AreaBaseTempate';
import AreaListTempate from '@pages/area/AreaListTempate';
import AreaViewTempate from '@pages/area/AreaViewTempate';


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

        {/* 놀거리 */}
        <Route path="/area" element={<AreaBaseTempate />}>
          <Route path=":type/list" element={<AreaListTempate />} />
          <Route path=":type/view" element={<AreaViewTempate />} />
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