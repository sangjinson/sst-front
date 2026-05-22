import React from "react";

/**
 * 컴포넌트를 감싸는 카드 레이아웃
 * @param {string} title - 카드의 제목
 * @param {React.ReactNode} children - 카드 내부에 들어갈 컨텐츠
 * @param {string} className - 추가적인 커스텀 스타일 클래스
 * @param {string} desc - 제목 아래에 표시될 설명 문구
 */
const ComponentCard = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* 카드 헤더 섹션 */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* 카드 바디 섹션 (내용물) */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;