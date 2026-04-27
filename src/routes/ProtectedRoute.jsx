import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// 🚀 라이브러리와 기본 CSS를 import 합니다
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ----------------------------------------------------
// 라이브러리를 활용한 스켈레톤 UI 컴포넌트
// ----------------------------------------------------
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-6 md:py-10">
      <div className="max-w-[1200px] mx-auto">
        
        {/* 브레드크럼 위치 스켈레톤 */}
        <div className="mb-10">
          <Skeleton width="25%" height={24} />
        </div>
        
        {/* 중앙 타이틀 위치 스켈레톤 */}
        <div className="flex justify-center mb-10">
          <Skeleton width="33%" height={32} />
        </div>

        {/* 카드 그리드 영역 스켈레톤 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* borderRadius로 카드의 둥근 모서리까지 표현 가능합니다 */}
          <Skeleton height={256} borderRadius={16} />
          <div className="hidden sm:block"><Skeleton height={256} borderRadius={16} /></div>
          <div className="hidden lg:block"><Skeleton height={256} borderRadius={16} /></div>
          <div className="hidden lg:block"><Skeleton height={256} borderRadius={16} /></div>
        </div>
        
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 보호된 라우트 컴포넌트
// ----------------------------------------------------
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <SkeletonLoader />;
  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;