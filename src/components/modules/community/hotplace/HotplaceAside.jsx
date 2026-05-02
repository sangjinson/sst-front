
/*
 * 핫플거리 상세 페이지에서 우측 사이드 영역을 담당하는 컴포넌트입니다.

 * 사용 예시:

 * import HotplaceAside from "@components/modules/community/hotplace/HotplaceAside";
 *
 * const [isLiked, setIsLiked] = useState(false);
 *
 * const openReportModal = (type) => {
 *   console.log(type); // "post"
 * };
 *
 * <HotplaceAside
 *   currentPost={post}
 *   isLiked={isLiked}
 *   setIsLiked={setIsLiked}
 *   wishCount={post.wishCnt}
 *   openReportModal={openReportModal}
 * />

*/

import { ClipButton } from "@components/modules/ActionButtons";

const HotplaceAside = ({
  currentPost,
  isLiked,
  setIsLiked,
  wishCount,
  openReportModal,
}) => {
  return (
    <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6 space-y-6 h-full">

      {/* 공유/신고 */}
      <div className="flex items-center gap-2">
        {/* 공유 버튼 (작게) */}
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500">
          <ClipButton />
        </div>

        {/* 신고 버튼 */}
        <button
          type="button"
          onClick={() => openReportModal("post")}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 flex items-center gap-1.5">
          <svg viewBox="0 0 64 64" className="w-4 h-4">
            <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor"/>
            <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(45 32 32)"/>
            <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(90 32 32)"/>
            <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(135 32 32)"/>
            <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(-45 32 32)"/>
            <path d="M12 34 A20 20 0 0 1 52 34 Z" fill="currentColor"/>
            <rect x="10" y="34" width="44" height="11" rx="5" fill="currentColor"/>
            <rect x="8" y="45" width="48" height="10" rx="5" fill="#2d2d4e"/>
          </svg>
          신고
        </button>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        {/* 왼쪽: 작성자 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-xl shadow-sm">
            😊
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-400">작성자</p>
            <h4 className="truncate text-lg font-bold text-gray-900">
              {currentPost.author}
            </h4>
          </div>
        </div>

        {/* 오른쪽: 좋아요 버튼 */}
        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all active:scale-95 ${
            isLiked
              ? "bg-blue-50 text-blue-500"
              : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-500"
          }`}
        >
          👍 {wishCount}
        </button>
      </div>

      {/* 작성일 */}
      <div className="rounded-2xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-400 fs-down-1">작성일</span>
          <strong className="text-gray-700 fs-down-1">{currentPost.regDt}</strong>
        </div>
      </div>

      {/* 제목 */}
      <div className="pb-4 border-b border-gray-100">
        <span className="fs-down-1 font-semibold text-emerald-600 mb-1 block">제목</span>
        <h3 className="fs-down-2 font-extrabold text-gray-900">{currentPost.title}</h3>
      </div>

      {/* 본문 */}
      <div>
        <span className="fs-down-1 font-semibold text-gray-400 mb-3 block">본문</span>
        <p className="whitespace-pre-wrap fs-down-1 leading-8 text-gray-700">{currentPost.description}</p>
      </div>
    </aside>
  );
};

export default HotplaceAside;