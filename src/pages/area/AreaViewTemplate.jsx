// src/pages/area/AreaViewTemplate.jsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// ✅ 상세 페이지 컴포넌트 임포트 (고정된 구조의 별칭 사용)
import FoodView from '@pages/area/food/View';
// import TourView from '@pages/area/tour/View'; // 향후 명소 추가 시 임포트
// import StayView from '@pages/area/stay/View'; // 향후 숙소 추가 시 임포트

const AreaViewTemplate = () => {
  // URL에서 파라미터 추출 (예: /수원시/food/view -> type은 'food')
  const { type } = useParams();

  // type에 따라 보여줄 컴포넌트 결정
  const renderViewComponent = () => {
    switch (type) {
      case 'food':
        return <FoodView />;
      /* case 'tour':
        return <TourView />;
      case 'stay':
        return <StayView />;
      */
      default:
        // 잘못된 type 파라미터가 들어오면 홈으로 리다이렉트
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="area-view-template-wrapper">
      {/* 상위 레이아웃에서 Header/Footer를 처리하므로 여기선 내용만 렌더링 */}
      {renderViewComponent()}
    </div>
  );
};

export default AreaViewTemplate;    