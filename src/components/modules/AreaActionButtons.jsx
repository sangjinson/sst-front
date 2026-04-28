import React from 'react';

/**
 * AreaActionButtons - 뷰 페이지 공통 공유/찜 버튼 컴포넌트
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import { ClipButton, HeartButton } from '@components/modules/areaview/AreaActionButtons';
 *
 * // 2. JSX에서 사용
 * <ClipButton onClick={handleShareClick} />
 * <HeartButton liked={isWished} onClick={() => setIsWished((prev) => !prev)} />
 * ────────────────────────────────────────────────
 *
 * ClipButton props:
 * - onClick : 클릭 핸들러
 *
 * HeartButton props:
 * - liked   : 찜 상태 (boolean)
 * - onClick : 클릭 핸들러
 */

// 공유(링크 복사) 버튼
export const ClipButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-none outline-none cursor-pointer"
    aria-label="링크 공유"
  >
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 transition-all duration-200 fill-none stroke-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L10 5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
    </svg>
  </button>
);

// 찜(하트) 버튼
export const HeartButton = ({ liked, onClick }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors border-none outline-none cursor-pointer"
    aria-label="좋아요"
  >
    <svg
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-500'}`}
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </button>
);
