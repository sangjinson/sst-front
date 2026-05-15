import React from 'react';

const ProfileImage = ({ user, size = 'sm', className = "" }) => {
  const defaultProfile = "/assets/images/default-user.png";

  // 공통 테두리 및 원형 스타일
  const baseStyle = "rounded-full overflow-hidden flex items-center justify-center bg-white border-[#0F9B73]";

  const sizeStyles = {
    sm: {
      container: "w-[38px] h-[38px] md:w-[42px] md:h-[42px] border-2", // 헤더용
      text: "text-xs",
    },
    lg: {
      container: "w-full h-full border-[3px]", // 사이드바용 (부모가 24h/24w)
      text: "text-xl",
    },
    xl: {
      container: "w-full h-full border-[3px] shadow-md", // 회원정보 수정용 (부모가 32h/32w)
      text: "text-2xl",
    }
  };

  const currentStyle = sizeStyles[size] || sizeStyles.sm;

  return (
    <div className={`${baseStyle} ${currentStyle.container} ${className}`}>
      {user?.mbrProfileInfo?.filePath ? (
        <img
          src={user.mbrProfileInfo.filePath}
          alt="프로필"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultProfile;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
          <span className={`text-gray-500 font-bold ${currentStyle.text}`}>
            {user?.mbrNickname?.charAt(0) || 'U'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;