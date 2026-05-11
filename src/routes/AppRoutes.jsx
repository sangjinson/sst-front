import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '@pages/landing/LandingPage';
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';

import MainPage from '@pages/main/MainPage';
import AdminDashboard from '@pages/admin/Dashboard';
import Unauthorized from '@pages/error/Unauthorized';
import NotFoundPage from '@pages/error/NotFoundPage';
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

import AreaPostList from '@pages/admin/AreaPostList';
import ReportList from '@pages/admin/ReportList';
import ReportDetail from '@pages/admin/ReportDetail';
import HotplaceList from '@pages/admin/HotplaceList';
import LifeList from '@pages/admin/LifeList';
import NoticeManage from '@pages/admin/NoticeManage';
import FaqManage from '@pages/admin/FaqManage';


/* 관리자 */
{/* 
import SignIn from '@layouts/admin/tailadmin/layout/pages/AuthPages/SignIn';
import SignUp from '@layouts/admin/tailadmin/layout/pages/AuthPages/SignUp';
import NotFound from '@layouts/admin/tailadmin/layout/pages/OtherPage/NotFound';
import UserProfiles from '@layouts/admin/tailadmin/layout/pages/UserProfiles';
import Videos from '@layouts/admin/tailadmin/layout/pages/UiElements/Videos';
import Images from '@layouts/admin/tailadmin/layout/pages/UiElements/Images';
import Alerts from '@layouts/admin/tailadmin/layout/pages/UiElements/Alerts';
import Badges from '@layouts/admin/tailadmin/layout/pages/UiElements/Badges';
import Avatars from '@layouts/admin/tailadmin/layout/pages/UiElements/Avatars';
import Buttons from '@layouts/admin/tailadmin/layout/pages/UiElements/Buttons';
import LineChart from '@layouts/admin/tailadmin/layout/pages/Charts/LineChart';
import BarChart from '@layouts/admin/tailadmin/layout/pages/Charts/BarChart';
import Calendar from '@layouts/admin/tailadmin/layout/pages/Calendar';
import BasicTables from '@layouts/admin/tailadmin/layout/pages/Tables/BasicTables';
import FormElements from '@layouts/admin/tailadmin/layout/pages/Forms/FormElements';
import Blank from '@layouts/admin/tailadmin/layout/pages/Blank';
import AppLayout from '@layouts/admin/tailadmin/layout/layout/AppLayout';
import { ScrollToTop } from '@layouts/admin/tailadmin/layout/components/common/ScrollToTop';
*/}
import Home from '@themeadmin/pages/Dashboard/Home';
{/* 관리자 - 회원 관리 */}
import AdinMemberList from '@themeadmin/pages/Members/AdminMemberList';
import AdminMemberInfoForm from '@themeadmin/pages/Members/AdminMemberInfoForm';

{/* 관리자 - 놀거리, 먹거리, 잘거리, 볼거리 */}
import AdminStreetListPage from '@themeadmin/pages/Streets/AdminStreetListPage';
import AdminStreetForm from '@themeadmin/pages/Streets/AdminStreetForm';






const AppRoutes = () => {
  return (
    <Routes>
      {/* 공개된 페이지 영역에 OAuth 콜백 주소 추가 */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/signup" element={<SignupPage />} />
      
      {/* 백엔드가 돌려보내 줄 주소와 정확히 일치시켜야 해! */}
      <Route path="/oauth/redirect" element={<OAuthRedirectHandler />} />

      {/* 2. 비로그인 사용자도 "조회"는 가능한 페이지 영역 (UserLayout 적용) */}
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

          {/* 커뮤니티 - 핫플레이스 / 일상 글쓰기 (작성은 무조건 보호됨) */}
          <Route path="/showcase/hotplace/write" element={<CommunityHotplaceWrite />} />
          <Route path="/showcase/hotplace/write/:id" element={<CommunityHotplaceWrite />} />
          <Route path="/showcase/life/write" element={<CommunityLifeWrite />} />
          <Route path="/showcase/life/write/:id" element={<CommunityLifeWrite />} />

          {/* 내거리(일정 관리) */}
          <Route path="/plan" element={<AIPlanPage />} />
          <Route path="/plan/result" element={<AIPlanResultPage />} />
          </Route>
          </Route>

      {/* 4. 관리자 전용 권한 (ROLE_ 접두사 확인 주의!) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* 
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<MemberList />} />
          <Route path="notices" element={<NoticeManage />} />
          <Route path="faq" element={<FaqManage />} />
          {/* 추가된 어드민 라우트들이 있다면 여기에 넣으면 돼! */}
          <Route index element={<Home />} />

          {/* 회원 관리 */}
          <Route path="members">
            <Route index element={<AdinMemberList />} />
            <Route path="create" element={<AdminMemberInfoForm />} />
            <Route path="update" element={<AdminMemberInfoForm />} />
          </Route>

          {/* 사거리 관리 */}
          <Route path="area">
            {/* /admin/street/:type 경로로 들어오면 StreetListPage를 보여줌 */}
            <Route path=":type" element={<AdminStreetListPage />} />
            
            {/* 필요한 경우 추가 경로 설정 */}
            <Route path=":type/create" element={<AdminStreetForm />} />
            <Route path=":type/update" element={<AdminStreetForm />} />
            
          </Route>
          

          <Route path="support">
            <Route path="notices" element={<NoticeManage />} />
            <Route path="faq" element={<FaqManage />} />
          </Route>
        </Route>
      </Route> 

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;