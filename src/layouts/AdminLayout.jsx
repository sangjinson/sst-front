import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@layouts/AppHeader';
import AppSidebar from '@layouts/AppSidebar';
import '@assets/css/admin.css';
import { useSidebar } from "@context/SidebarContext";
import { AdminThemeProvider } from '@context/AdminThemeContext'; //  위치 확인

function AdminLayout() {
  const { isExpanded, isHovered } = useSidebar();

  const marginLeftClass = (isExpanded || isHovered) 
    ? "lg:ml-[290px]" 
    : "lg:ml-[90px]";

  return (
    <AdminThemeProvider>
      <div className="min-h-screen">
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
          <AppSidebar />
          <div className={`ml-0 ${marginLeftClass} transition-[margin] duration-300 ease-in-out`}>
            <AppHeader />
            <main className="p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminThemeProvider>
  )
}
export default AdminLayout;