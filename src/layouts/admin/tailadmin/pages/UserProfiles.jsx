import React from "react";
import PageBreadcrumb from '@themeadmin/components/common/PageBreadCrumb';
import UserMetaCard from '@themeadmin/components/UserProfile/UserMetaCard';
import UserInfoCard from '@themeadmin/components/UserProfile/UserInfoCard';
import UserAddressCard from '@themeadmin/components/UserProfile/UserAddressCard';
import PageMeta from '@themeadmin/components/common/PageMeta';

export default function UserProfiles() {
  return (
    <>
      {/* 페이지 SEO 및 메타 정보 설정 */}
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      {/* 페이지 상단 경로 안내 (Breadcrumb) */}
      <PageBreadcrumb pageTitle="Profile" />

      {/* 프로필 컨텐츠 메인 카드 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        {/* 카드 섹션 리스트: 메타 정보, 상세 정보, 주소 정보 */}
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}