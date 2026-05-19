import React, { memo } from 'react';
import { useConfig } from '@hooks/useConfig';

const ProfileCover = ({ user: propsUser, preview = null, className = "" }) => {
  const { getConfig } = useConfig();
  
  // 전역 설정의 프로필 정보 참조
  const globalUser = getConfig('profile');
  const currentUser = propsUser || globalUser;
  
  // 기본 이미지
  const defaultCover = '/images/user/default-cover.jpg';


  // 이미지 표시 우선순위: 1. 미리보기(DataURL), 2. 서버 경로, 3. 기본 이미지
  const displayImage = preview || currentUser?.profileBg?.filePath;


  return (
    <div className={`w-full h-full overflow-hidden bg-gray-100 ${className}`}>
      <img 
        src={displayImage || defaultCover}
        alt="배경" 
        className="w-full h-full object-cover" 
        onError={(e) => {
          e.target.src = defaultCover;
        }}
      />
    </div>
  );
};

export default memo(ProfileCover, (prev, next) => {
  return (
    prev.preview === next.preview &&
    prev.user?.profileBg?.filePath === next.user?.profileBg?.filePath &&
    prev.className === next.className
  );
});