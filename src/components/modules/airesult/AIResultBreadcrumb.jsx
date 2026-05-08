import React from 'react';
import Breadcrumb from '@components/common/Breadcrumb';


// 브레드크럼
const AIResultBreadcrumb = ({ existingId }) => {
  return (
    <Breadcrumb
      paths={[
        { label: '홈', to: '/' },
        { label: '내거리', to: '/plan' },
        { label: existingId ? '내 일정 수정' : '추천거리' },
      ]}
      className="mb-4"
    />
  );
};

export default AIResultBreadcrumb;