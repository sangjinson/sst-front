import React from "react";
import PageBreadcrumb from '@themeadmin/components/common/PageBreadCrumb';
import PageMeta from '@themeadmin/components/common/PageMeta';
// 위에서 만든 FaqManage 컴포넌트를 임포트합니다. (경로는 실제 파일 위치에 맞게 수정하세요)
import FaqManage from './FaqManage'; 

export default function FaqList() {
  return (
    <>
      {/* 페이지 SEO 및 메타 정보 설정 - 거리에섯 관리자 모드에 맞게 수정 */}
      <PageMeta
        title="FAQ 관리 | 거리에섯 관리자 패널"
        description="거리에섯 고객지원 자주 묻는 질문(FAQ) 관리 페이지입니다."
      />

      {/* 페이지 상단 경로 안내 (Breadcrumb) */}
      <PageBreadcrumb pageTitle="고객지원 관리" />

      {/* FAQ 관리 컨텐츠 메인 영역 */}
      <div className="space-y-6">
        {/* 
          참고: FaqManage 내부에 이미 흰색 카드 디자인(rounded-2xl border...)이 
          포함되어 있으므로 별도의 감싸는 div 없이 바로 호출하거나, 
          간격을 위해 최상위 div만 사용합니다.
        */}
        
      </div>
    </>
  );
}