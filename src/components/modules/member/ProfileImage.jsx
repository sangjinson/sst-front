import React, { memo, useContext } from 'react';
import { useConfig } from '@hooks/useConfig'; // Config 훅

const ProfileImage = ({ user: propsUser, size = 'sm', className = "", preview = null }) => {
  const { getConfig } = useConfig();
  
  // 🚀 1. 전역 설정(Config)에 저장된 최신 유저 정보를 우선 참조
  // 이렇게 하면 MemberInfo에서 수정한 내용이 즉시 반영됩니다.
  const globalUser = getConfig('profile');
  const currentUser = propsUser || globalUser;

  const defaultProfile = "/images/user/default-user.png";

  const baseStyle = "rounded-full overflow-hidden flex items-center justify-center bg-white border-[#0F9B73]";

  const sizeStyles = {
    sm: {
      container: "w-[38px] h-[38px] md:w-[42px] md:h-[42px] border-2",
      text: "text-xs",
    },
    lg: {
      container: "w-full h-full border-[3px]",
      text: "text-xl",
    },
    xl: {
      container: "w-full h-full border-[3px] shadow-md",
      text: "text-2xl",
    }
  };

  const currentStyle = sizeStyles[size] || sizeStyles.sm;

  // 이미지 표시 우선순위
  // [1순위] 로컬 파일 선택 시 미리보기(preview) 
  // [2순위] 전역 상태 혹은 props의 서버 이미지 경로
  // [3순위] 닉네임 첫 글자 아바타 (이미지 없을 시)
  const displayImage = preview || currentUser?.profileIcon?.filePath  ;

  

  return (
    <div className={`${baseStyle} ${currentStyle.container} ${className}`}>
      {displayImage ? (
        <img
          key={displayImage} // 💡 경로 변경 시 이미지를 확실히 새로고침하기 위한 키값
          src={displayImage}
          alt="프로필"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultProfile;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
          <span className={`text-gray-500 font-bold ${currentStyle.text}`}>
            {currentUser?.mbrNickname?.charAt(0) || 'U'}
          </span>
        </div>
      )}
    </div>
  );
};

// 💡 전역 상태를 구독하므로, 메모이제이션 조건에 전역 상태 값의 변화도 고려되어야 합니다.
export default memo(ProfileImage, (prev, next) => {
  return (
    prev.preview === next.preview &&
    prev.user?.profileIcon?.filePath === next.user?.profileIcon?.filePath &&
    prev.user?.mbrNickname === next.user?.mbrNickname &&
    prev.size === next.size &&
    prev.className === next.className
  );
});