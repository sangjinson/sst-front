import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '@layouts/AppHeader';
import AppSidebar from '@layouts/AppSidebar';
import '@assets/css/admin.css';

function AdminLayout() {
return (
    // 최상위 html에 자동으로 .dark가 붙기 때문에, 
    // 여기를 포함한 모든 하위 컴포넌트는 오직 Tailwind의 dark: 유틸리티 클래스로만 반응하면 됩니다.
    <div className="min-h-screen">
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <AppSidebar />
        <div className="ml-[90px] xl:ml-[290px]">
          <AppHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;