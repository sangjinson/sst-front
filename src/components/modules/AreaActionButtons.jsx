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
    className={`group/heart w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border-none outline-none
      ${liked ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white'}
      hover:scale-105 active:scale-90`}
    aria-label="좋아요"
  >
    <svg
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-all duration-200 ${
        liked
          ? 'scale-110 text-rose-500 fill-rose-500'
          : 'text-gray-500 group-hover/heart:text-rose-400 group-hover/heart:scale-110'
      }`}
      fill={liked ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>
  </button>
);
