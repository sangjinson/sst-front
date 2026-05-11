import React from "react";

// 사이즈별 클래스 매핑
const sizeClasses = {
  xsmall: "h-6 w-6 max-w-6",
  small: "h-8 w-8 max-w-8",
  medium: "h-10 w-10 max-w-10",
  large: "h-12 w-12 max-w-12",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

// 상태 표시등 사이즈 매핑
const statusSizeClasses = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

// 상태별 색상 매핑
const statusColorClasses = {
  online: "bg-green-500", // success-500 대용
  offline: "bg-red-400",   // error-400 대용
  busy: "bg-yellow-500",  // warning-500 대용
};

const Avatar = ({
  src,
  alt = "User Avatar",
  size = "medium",
  status = "none",
}) => {
  return (
    <div className={`relative rounded-full ${sizeClasses[size] || sizeClasses.medium}`}>
      {/* 아바타 이미지 */}
      <img 
        src={src} 
        alt={alt} 
        className="h-full w-full object-cover rounded-full" 
      />

      {/* 상태 표시등 (status가 none이 아닐 때만 렌더링) */}
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
            statusSizeClasses[size] || statusSizeClasses.medium
          } ${statusColorClasses[status] || ""}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;