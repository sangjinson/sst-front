import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';
/**
 * AreaActionButtons - 공통 공유/찜 버튼 컴포넌트
 *
 * ────────────────────────────────────────────────
 * [ClipButton] 공유 버튼 - props 없음, 어디서든 사용 가능
 *
 * import { ClipButton } from '@components/modules/AreaActionButtons';
 * <ClipButton />
 * ────────────────────────────────────────────────
 *
 * ────────────────────────────────────────────────
 * [HeartButton] 찜 버튼 - 마이페이지 찜목록 연동 불필요한 곳에서 사용
 * (예: 커뮤니티 상세, 단순 UI 토글이 필요한 곳)
 *
 * import { HeartButton } from '@components/modules/AreaActionButtons';
 *
 * const [liked, setLiked] = useState(false);
 * <HeartButton liked={liked} onClick={() => setLiked(prev => !prev)} />
 *
 * props:
 * - liked   : 찜 상태 (boolean)
 * - onClick : 클릭 핸들러
 * ────────────────────────────────────────────────
 *
 * ────────────────────────────────────────────────
 * [WishlistHeartButton] 찜 버튼 - 마이페이지 찜목록 연동이 필요한 곳에서 사용
 * (예: 볼거리/먹거리/잘거리 리스트·뷰 페이지)
 * - 찜 상태가 localStorage에 저장되어 마이페이지 찜목록과 연동됨
 * - 마이페이지에서 클릭 시 /{region}/{itemType}/view?id= 로 이동
 *
 * import { WishlistHeartButton } from '@components/modules/AreaActionButtons';
 *
 * // 뷰 페이지에서 사용 예시 (renderHeart prop으로 전달)
 * <AreaDetailHero
 *   ...
 *   renderHeart={() => (
 *     <WishlistHeartButton item={item} itemType="see" region={region} />
 *   )}
 * />
 *
 * // 리스트 페이지에서 사용 예시 (AreaListCard의 renderHeart prop으로 전달)
 * <AreaListCard
 *   ...
 *   renderHeart={() => (
 *     <WishlistHeartButton item={item} itemType="food" region={region} />
 *   )}
 * />
 *
 * props:
 * - item     : 장소 데이터 객체 { id, name|title, image, category|tag, address|location }
 * - itemType : 카테고리 타입 ('see' | 'food' | 'sleep')
 * - region   : URL 지역 파라미터 (영문, 예: 'suwon')
 * ────────────────────────────────────────────────
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

// 리스트 페이지용 - 찜 로직 내장 (원복: 이 컴포넌트 전체 삭제 + import 삭제)
export const WishlistHeartButton = ({ item, itemType, region, initialWished }) => {
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist(item?.id, itemType, user, initialWished); // ✅ initialWished 추가

  const handleClick = (e) => {
    e.stopPropagation();
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


// 찜(하트) 버튼 - 순수 UI (liked, onClick을 외부에서 주입)
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
