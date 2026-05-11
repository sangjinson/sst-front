import React from 'react';
import { SidebarProvider, useSidebar } from '@layouts/admin/tailadmin/context/SidebarContext';
import { Outlet } from 'react-router-dom';
import AppHeader from '@layouts/admin/tailadmin/layout/AppHeader';
import Backdrop from '@layouts/admin/tailadmin/layout/Backdrop';
import AppSidebar from '@layouts/admin/tailadmin/layout/AppSidebar';
import '@assets/css/admin.css';

<<<<<<< HEAD
import BasicBreadcrumb from '@layouts/admin/tailadmin/components/ui/breadcrumb/BasicBreadcrumb';

// 1. 실제 UI 렌더링을 담당하는 컴포넌트 (useSidebar 사용 가능)
function AdminLayoutContent() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
=======
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    member: true,
    area: true,
    showcase: true,
    report: true,
    support: true,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname === path;
  const isActiveStart = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      key: 'member',
      label: '회원 관리',
      children: [{ label: '회원 목록', path: '/admin/members' }], 
    },
    {
      key: 'area',
      label: '사거리 관리',
      children: [
        { label: '볼거리 관리', path: '/admin/area/see' },     
        { label: '먹거리 관리', path: '/admin/area/food' },    
        { label: '잘거리 관리', path: '/admin/area/sleep' },   
        { label: '놀거리 관리', path: '/admin/area/play' },    
      ],
    },
    {
      key: 'showcase',
      label: '뽐낼거리 관리',
      children: [
        { label: '핫플거리 관리', path: '/admin/showcase/hotplace' }, 
        { label: '인생거리 관리', path: '/admin/showcase/life' },    
      ],
    },
    {
      key: 'report',
      label: '신고 관리',
      children: [{ label: '신고 관리', path: '/admin/report' }],   
    },
    {
      key: 'support',
      label: '고객지원 관리',
      children: [
        { label: '공지사항 관리', path: '/admin/notices' },
        { label: 'FAQ 관리', path: '/admin/faq' },
      ],
    },
  ];
>>>>>>> develop

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// 2. 외부에서 Provider로 감싸주는 메인 컴포넌트
function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}

export default AdminLayout;