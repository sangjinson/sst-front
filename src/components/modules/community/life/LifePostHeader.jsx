import React from "react";

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
  region,
  viewCount,
  comments,
  wishCount,
  isLiked,
  setIsLiked,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      {/* 지역 + 해시태그 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-3 py-1 bg-[#f0fdf9] text-[#0F9B73] fs-down-1 font-semibold rounded-full">
          📍 {region}
        </span>

        {(post.hashtags || []).map((tag) => (
          <span
            key={tag}
            className="fs-down-1 font-semibold text-[#0F9B73] pr-1">
            #{tag}
          </span>
        ))}
      </div>

      {/* 제목 */}
      <h1 className="fs-down-4 md:text-3xl font-extrabold text-gray-900 mb-3">
        {post.title}
      </h1>

      {/* 작성자 + 메타 */}
      <div className="flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        {/* 작성자 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            😊
          </div>
          <span className="fs-down-1 font-semibold text-[#E8956D]">
            {post.author}
          </span>
        </div>

        {/* 조회 / 댓글 / 찜 / 날짜 */}
        <div className="flex flex-wrap items-center gap-4 fs-down-1 justify-end">
          <span>👁 {viewCount}</span>
          <span>💬 {comments.length}</span>

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

          <span>{post.regDt}</span>
        </div>
      </div>
    </div>
  );
};

export default LifePostHeader;