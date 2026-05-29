import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

{/* Layouts */}
import UserLayout from '@layouts/UserLayout';
import AdminLayout from '@layouts/AdminLayout';
import LandingLayout from '@layouts/LandingLayout';


{/* Pages */}
import LandingPage from '@pages/landing/LandingPage';

import MainPage from '@pages/main/MainPage';
import Unauthorized from '@pages/error/Unauthorized';
import NotFoundPage from '@pages/error/NotFoundPage';
import ServerErrorPage from '@pages/error/ServerErrorPage';
import MyPage from '@pages/user/MyPage';

import Notice from "@pages/customersupport/Notice";
import Faq from "@pages/customersupport/Faq";
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



import CommonCodeList from '@pages/admin/CommonCodeList';

import { AIPlanProvider } from '@pages/aiplan/AIPlanContext';


{/* 관리자 - 대시보드 */}
import Home from '@pages/admin/Dashboard.jsx';

{/* 관리자 - 회원 관리 */}
import AdminMemberList from '@pages/admin/AdminMemberList';
import AdminManagerList from '@pages/admin/AdminManagerList';
import AdminMemberInfoForm from '@pages/admin/AdminMemberInfoForm';
import AdminMemberEdit from '@pages/admin/AdminMemberEdit';

{/* 관리자 - 관리자 관리 */}
import AdminManagerCreate from '@pages/admin/AdminManagerCreate';

{/* 관리자 - 놀거리, 먹거리, 잘거리, 볼거리 */}
import AdminStreetListPage from '@pages/admin/AdminStreetListPage';
import AdminStreetForm from '@pages/admin/AdminStreetForm';
import AdminSeeModify from '@pages/admin/area/AdminSeeModify';
import AdminFoodModify from '@pages/admin/area/AdminFoodModify';
import AdminPlayModify from '@pages/admin/area/AdminPlayModify';
import AdminSleepModify from '@pages/admin/area/AdminSleepModify';

{/* 관리자 - 핫플,인생거리 관리 */}
import AdminShowcaseList from '@pages/admin/AdminShowcaseList';
// import HotplaceList from '@pages/admin/HotplaceList';
// import LifeList from '@pages/admin/LifeList';

{/* 관리자 - 리뷰, 댓글 관리 */}
import AdminReplyList from '@pages/admin/AdminReplyList';

{/* 관리자 - 신고 관리 */}
import AdminReport from '@pages/admin/AdminReport';

{/* 관리자 - 고객 지원 관리 */}
import AdminSupportManage from '@pages/admin/AdminSupportManage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* 공개된 페이지 영역에 OAuth 콜백 주소 추가 */}

      {/* 랜딩 페이지 */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/403" element={<Unauthorized />} />
      <Route path="/500" element={<ServerErrorPage />} />
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
          <Route element={<AIPlanProvider />}>
            <Route path="/plan" element={<AIPlanPage />} />
            <Route path="/plan/result" element={<AIPlanResultPage />} />
          </Route>

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
          <Route path="common-codes" element={<CommonCodeList />} />

          {/* 회원 관리 */}
          <Route path="members">
            <Route index element={<AdminMemberList />} />
            <Route path="create" element={<AdminMemberInfoForm />} />
            <Route path="update" element={<AdminMemberInfoForm />} />
            <Route path="edit/:id" element={<AdminMemberEdit />} />
          </Route>
            <Route path="managers">
            <Route index element={<AdminManagerList />} />
            <Route path="create" element={<AdminManagerCreate />} />
          </Route>
          {/* 사거리 관리 */}
          <Route path="area">
            {/* /admin/street/:type 경로로 들어오면 StreetListPage를 보여줌 */}
            <Route path=":type" element={<AdminStreetListPage />} />
            
            {/* 필요한 경우 추가 경로 설정 */}
            <Route path=":type/create" element={<AdminStreetForm />} />
            <Route path=":type/update" element={<AdminStreetForm />} />
            <Route path="see/:plcNo" element={<AdminSeeModify />} />
            <Route path="food/:plcNo" element={<AdminFoodModify />} />
            <Route path="play/:plcNo" element={<AdminPlayModify />} />
            <Route path="sleep/:plcNo" element={<AdminSleepModify />} />
          </Route>
          
          <Route path="report" element={<AdminReport />} />

          <Route path="support">
            <Route path=":type" element={<AdminSupportManage />} />
          </Route>

          {/* 뽐낼거리(커뮤니티) 관리 */}
          <Route path="showcase">
            <Route path=":type" element={<AdminShowcaseList />} />
          </Route>
          {/* 댓글 관리 */}
            <Route path=":type" element={<AdminReplyList />} />
          
        </Route>
      </Route> 

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

