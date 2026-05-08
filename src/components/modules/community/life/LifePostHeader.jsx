import React from "react";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// 이미지 아래 본문 박스 댓글 아이콘
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 translate-y-[1px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

// 이미지 아래 본문 박스 좋아요 아이콘
const LikeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 11v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3z" />
    <path d="M7 11l4.4-7.1A2 2 0 0 1 15 5v4h4a2 2 0 0 1 2 2.3l-1.2 8A2 2 0 0 1 17.8 21H7V11z" />
  </svg>
);

/**
 * LifePostHeader
 *
 * 인생거리 상세페이지의 "제목 + 메타 정보" 영역 컴포넌트
 *
 * 사용 예시:
 *
 * <LifePostHeader
 *   post={post}
 *   region={region}
 *   viewCount={viewCount}
 *   comments={comments}
 *   wishCount={wishCount}
 *   isLiked={isLiked}
 *   setIsLiked={setIsLiked}
 * />
 */
const LifePostHeader = ({
  post,
  viewCount,
  comments,
  wishCount,
  isLiked,
  setIsLiked,
  onCommentClick,
}) => {
  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 p-6 pr-32 pb-16 shadow-sm">
      <span className="absolute right-6 top-6 fs-down-1 font-medium text-gray-400">{post.regDt}</span>
      {/* 작성자 */}
      <div className="mb-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          😊
        </div>
        <span className="fs-down-1 font-semibold text-[#E8956D]">
          {post.author}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="fs-down-4 md:text-3xl font-extrabold text-gray-900 mb-3">
        {post.title}
      </h1>

      {/* 해시태그 + 메타 */}
      <div className="text-sm text-gray-400">
        {/* 해시태그 */}
        <div className="flex flex-wrap items-center gap-2">
          {(post.hashtags || []).map((tag) => (
            <span
              key={tag}
              className="fs-down-1 font-semibold text-[#0F9B73] pr-1"
            >
              #{tag}
            </span>
          ))}
        </div>
        {/* 좋아요 / 댓글 */}
        <div className="absolute bottom-5 left-6 flex flex-wrap items-center gap-4 fs-down-1">
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className={`shrink-0 inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold transition-colors active:scale-95 ${isLiked ? "text-blue-500" : "text-gray-900 hover:text-blue-500"}`}
          >
            <LikeIcon />
            {wishCount}
          </button>
          <button
            type="button"
            onClick={onCommentClick}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-gray-900 transition-colors hover:text-[#0F9B73]"
          >
            <CommentIcon />
            {comments.length}
          </button>
        </div>

        {/* 조회 */}
        <div className="absolute bottom-5 right-6 flex items-center fs-down-1 text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon />
            {viewCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LifePostHeader;