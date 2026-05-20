import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AreaActionButtons - 공통 공유/찜 버튼 컴포넌트
 */

// 공유(링크 복사) 버튼
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
      <button
        onClick={() => setIsShareOpen((prev) => !prev)}
        className="group/link w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md hover:bg-white hover:scale-105 active:scale-90 transition-all duration-200 cursor-pointer border-none outline-none"
        aria-label="링크 공유"
      >
        <svg
          className="w-6 h-6 text-gray-500 transition-all duration-200 group-hover/link:text-[#0F9B73] group-hover/link:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L10 5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
        </svg>
      </button>

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

// ✅ WishlistHeartButton - 비로그인 시 팝업 처리
export const WishlistHeartButton = ({ item, itemType, region, initialWished }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isWished, toggleWish } = useWishlist(item?.id, itemType, user, initialWished);

  const handleClick = (e) => {
    e.stopPropagation();

    // ✅ 비로그인 시 팝업
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: '로그인이 필요합니다',
        text: '로그인 후 이용 가능한 서비스입니다.',
        confirmButtonText: '로그인하러 가기',
        confirmButtonColor: '#0F9B73',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', {
            state: { from: location },
            replace: true,
          });
        }
      });
      return;
    }

    toggleWish({
      id: item.id,
      name: item.name || item.title,
      image: item.image,
      category: item.category || item.tag,
      address: item.address || item.location,
      type: itemType,
      region,
    });
  };

  return <HeartButton liked={isWished} onClick={handleClick} />;
};

// 찜(하트) 버튼 - 순수 UI
export const HeartButton = ({ liked, onClick }) => (
  <button
    onClick={onClick}
    className={`group/heart w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md transition-colors duration-200 cursor-pointer border-none outline-none
      ${liked ? 'bg-white shadow-md' : 'bg-white/80 hover:bg-white'}
      active:scale-90`}
    aria-label="좋아요"
  >
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 transition-all duration-200 ${
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