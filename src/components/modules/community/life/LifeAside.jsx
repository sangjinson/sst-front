import React from "react";
import { ClipButton } from "@components/modules/ActionButtons";

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

const CalendarPlanIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="5" width="16" height="16" rx="4" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M4 10h16" />
    <path d="M8.5 14h.01" />
    <path d="M12 14h.01" />
    <path d="M15.5 14h.01" />
    <path d="M8.5 17.5h.01" />
    <path d="M12 17.5h.01" />
    <path d="M15.5 17.5h.01" />
  </svg>
);


/**
 * LifeAside
 *
 * 인생거리 상세페이지 오른쪽 사이드 정보 영역입니다.
 *
 * 사용 예시:
 *
 * <LifeAside
 *   post={post}
 *   region={region}
 *   courseList={courseList}
 *   viewCount={viewCount}
 *   comments={comments}
 *   wishCount={wishCount}
 *   isLiked={isLiked}
 *   setIsLiked={setIsLiked}
 *   isLogin={isLogin}
 *   navigate={navigate}
 *   handleImportSchedule={handleImportSchedule}
 *   handleMakePlan={handleMakePlan}
 * />
 */
const LifeAside = ({
  post,
  courseList,
  viewCount,
  comments,
  wishCount,
  isLiked,
  setIsLiked,
  handleLikeClick,
  isLogin,
  isOwner,
  navigate,
  handleImportSchedule,
  handleMakePlan,
  onCommentClick,
  handleDeletePost,
  openReportModal,
}) => {
  return (
    <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-28 space-y-6">
      {/* 공유/신고 */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500">
          <ClipButton />
        </div>

        {/* 로그인 + 내 글 아님 */}
        {isLogin && !isOwner && (
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
        )}
      </div>

      {/* 작성자 */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-xl shadow-sm">
          😊
        </div>

        <div>
          <p className="fs-down-1 text-gray-400">작성자</p>
          <h4 className="fs-down-1 font-bold text-gray-900">
            {post.author}
          </h4>
        </div>
      </div>

      {/* 지역 + 작성일 */}
      <div className="space-y-3 rounded-2xl bg-gray-50 p-4">

        <div className="flex items-center justify-between fs-down-1">
          <span className="text-gray-400">작성일</span>
          <strong className="text-gray-700">{post.regDt}</strong>
        </div>

        <div className="flex items-center justify-between fs-down-1">
          <span className="text-gray-400">코스</span>
          <strong className="text-gray-700">
            {courseList.length}개 장소
          </strong>
        </div>
      </div>

      {/* 해시태그 */}
      <div>
        <p className="mb-3 fs-down-1 font-bold text-gray-500">해시태그</p>

        <div className="flex flex-wrap gap-2">
          {(post.hashtags || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-3 py-1.5 fs-down-1 font-bold text-emerald-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 좋아요/댓글/조회 */}
      <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`rounded-2xl cursor-pointer px-3 py-4 transition ${
            isLiked ? "bg-blue-50" : "bg-gray-50 hover:bg-blue-50"
          }`}>
          <p className="fs-down-1 text-gray-400">좋아요</p>
          <strong className="mt-1 block text-lg text-gray-900">
            {wishCount}
          </strong>
        </button>

        <button
          type="button"
          onClick={onCommentClick}
          className="rounded-2xl bg-gray-50 px-3 py-4 transition hover:bg-emerald-50 cursor-pointer"
        >
          <p className="fs-down-1 text-gray-400">댓글</p>
          <strong className="mt-1 block text-lg text-gray-900">
            {comments.length}
          </strong>
        </button>

        <div className="rounded-2xl bg-gray-50 px-3 py-4">
          <p className="fs-down-1 text-gray-400">조회</p>
          <strong className="mt-1 block text-lg text-gray-900">
            {viewCount}
          </strong>
        </div>
      </div>
      {/* 수정/삭제 */}
      {isLogin && isOwner && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate(`/showcase/life/write/${post.id}`)}
            className="rounded-xl border border-gray-200 px-4 py-3 fs-down-1 font-bold text-gray-600 transition hover:border-[#0F9B73] hover:text-[#0F9B73]">
            수정
          </button>

          <button
            type="button"
            onClick={handleDeletePost}
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 fs-down-1 font-bold text-red-500 transition hover:bg-red-100">
            삭제
          </button>
        </div>
      )}

      {/* 사이드바 일정 버튼 */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <button
          type="button"
          onClick={handleImportSchedule}
          className="inline-flex w-full items-center justify-center gap-2 py-3 leading-none bg-[#0F9B73] text-white fs-down-1 font-bold rounded-xl hover:bg-[#0d8a66] transition">
          <DownloadIcon />
          <span className="leading-none">내 일정으로 가져오기</span>
        </button>
      </div>
    </aside>
  );
};

export default LifeAside;