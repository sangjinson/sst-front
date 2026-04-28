import React, { useState } from 'react';
import Swal from 'sweetalert2';

/**
 * AreaActionButtons - 뷰 페이지 공통 공유/찜 버튼 컴포넌트
 *
 * ────────────────────────────────────────────────
 * 사용 예시:
 *
 * // 1. import
 * import { ClipButton, HeartButton } from '@components/modules/AreaActionButtons';
 *
 * // 2. JSX에서 사용
 * <ClipButton />
 * <HeartButton liked={isWished} onClick={() => setIsWished((prev) => !prev)} />
 * ────────────────────────────────────────────────
 *
 * ClipButton props:
 * - 없음 (공유 팝업 + 복사 로직 내장)
 *
 * HeartButton props:
 * - liked   : 찜 상태 (boolean)
 * - onClick : 클릭 핸들러
 */

// 공유(링크 복사) 버튼 - 팝업 및 복사 로직 내장
export const ClipButton = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    Swal.fire({
      icon: 'success',
      title: '복사 완료!',
      text: '링크가 클립보드에 복사되었습니다.',
      timer: 1500,
      showConfirmButton: false,
    });
    setIsShareOpen(false);
  };

  return (
    <div className="relative">
      {/* 공유 버튼 */}
      <button
        onClick={() => setIsShareOpen((prev) => !prev)}
        className="p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 hover:text-emerald-300 active:scale-90 transition cursor-pointer border-none outline-none"
        aria-label="링크 공유"
      >
        <svg
          className="w-5 h-5 transition-all duration-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L10 5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
        </svg>
      </button>

      {/* 공유 URL 팝업 */}
      {isShareOpen && (
        <div className="absolute top-[46px] right-0 w-[300px] max-w-[calc(100vw-32px)] rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl z-10">
          <p className="text-xs font-semibold text-gray-500 mb-2">페이지 링크</p>
          <div className="flex gap-2">
            <input
              value={window.location.href}
              readOnly
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F9B73] transition cursor-pointer"
            >
              복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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