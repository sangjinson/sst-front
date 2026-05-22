import React from 'react';
import { ThemeProvider } from '@layouts/admin/tailadmin/context/ThemeContext';
import { SidebarProvider, useSidebar } from '@layouts/admin/tailadmin/context/SidebarContext';
import { Outlet } from 'react-router-dom';
import AppHeader from '@layouts/admin/tailadmin/layout/AppHeader';
import Backdrop from '@layouts/admin/tailadmin/layout/Backdrop';
import AppSidebar from '@layouts/admin/tailadmin/layout/AppSidebar';
import '@assets/css/admin.css';

import BasicBreadcrumb from '@layouts/admin/tailadmin/components/ui/breadcrumb/BasicBreadcrumb';

// 1. 실제 UI 렌더링을 담당하는 컴포넌트 (useSidebar 사용 가능)
function AdminLayoutContent() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

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
    <ThemeProvider>
      <SidebarProvider>
        <AdminLayoutContent />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default AdminLayout;