import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Swal from 'sweetalert2';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-6 md:py-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10"><Skeleton width="25%" height={24} /></div>
        <div className="flex justify-center mb-10"><Skeleton width="33%" height={32} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <Skeleton height={256} borderRadius={16} />
          <div className="hidden sm:block"><Skeleton height={256} borderRadius={16} /></div>
          <div className="hidden lg:block"><Skeleton height={256} borderRadius={16} /></div>
          <div className="hidden lg:block"><Skeleton height={256} borderRadius={16} /></div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
        Swal.fire({
          icon: 'warning',
          title: '로그인이 필요합니다',
          text: '로그인 후 이용 가능한 페이지입니다.',
          confirmButtonText: '로그인하러 가기',
          confirmButtonColor: '#0F9B73',
          cancelButtonText: '닫기',
          cancelButtonColor: '#9ca3af',
          showCancelButton: true,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login', {
              state: { from: location },
              replace: true,
          });
        } else {
          navigate(-1); // 닫기 누르면 이전 페이지로
        }
      });
    }
  }, [loading, user, navigate, location]);

  if (loading || !user) return <SkeletonLoader />;

  if (!allowedRoles.includes(user.memberRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;