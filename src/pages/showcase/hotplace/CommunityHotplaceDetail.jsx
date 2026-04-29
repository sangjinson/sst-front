import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { ClipButton } from "@components/modules/ActionButtons";
import { hotplacePosts, hotplaceComments } from "./communityHotplaceData";

const CommunityHotplaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLogin = true;

  // 찜 상태
  const [isLiked, setIsLiked] = useState(false);

  // 현재 보고 있는 이미지 번호
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 새 댓글 입력값
  const [newComment, setNewComment] = useState("");

  // 댓글 더미 데이터
  const [comments, setComments] = useState(hotplaceComments);

  // 수정 중인 댓글 ID
  const [editingId, setEditingId] = useState(null);

  // 수정 중인 댓글 내용
  const [editText, setEditText] = useState("");

  // 페이지 진입 시 상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  /*
    목록 페이지에서 쓰던 더미 데이터와 동일한 구조

    COMMUNITY
    - post_no      → id
    - title        → title
    - content      → description
    - member_id    → author
    - place_no     → place
    - view_cnt     → viewCnt
    - wish_cnt     → wishCnt
    - comment_cnt  → commentCnt
    - reg_dt       → regDt

    HASHTAG
    - hashtag_name → hashtags 배열
  */
  const posts = hotplacePosts;

  // URL의 id와 일치하는 게시글 찾기
  const currentPost = posts.find((post) => post.id === Number(id));

  // 게시글이 없을 때
  if (!currentPost) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // 슬라이드에 사용할 이미지 목록
  // 나중에 DB/API에서 images 배열을 받으면 currentPost.images를 사용하면 됨
  const slideImages = currentPost.images || [
    currentPost.img,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub1/900/650`,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub2/900/650`,
  ];

  // 이전 이미지 보기
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? slideImages.length - 1 : prev - 1
    );
  };

  // 다음 이미지 보기
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === slideImages.length - 1 ? 0 : prev + 1
    );
  };

  // 상세 페이지에 들어오면 조회수가 1 증가한 것처럼 보여주기 위한 값
  const viewCount = currentPost.viewCnt + 1;

  // 찜 수 계산
  const wishCount = currentPost.wishCnt + (isLiked ? 1 : 0);

  // 게시글 신고
  const handleReportPost = () => {
    if (window.confirm("이 게시물을 신고하시겠습니까?")) {
      alert("신고가 접수되었습니다.");
    }
  };

  // 댓글 등록
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const newObj = {
      id: Date.now(),
      user: "나",
      text: newComment,
      date: new Date().toLocaleDateString(),
    };

    setComments([newObj, ...comments]);
    setNewComment("");
  };

  // 댓글 수정 시작
  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

  // 댓글 수정 저장
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: editText } : comment
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // 댓글 삭제
  // 나중에 삭제 컴포넌트를 찾으면 이 부분에 연결하면 됨
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  // 댓글 신고
  const handleReportComment = () => {
    if (window.confirm("이 댓글을 신고하시겠습니까?")) {
      alert("댓글 신고가 접수되었습니다.");
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      {/* 상단 경로 표시 */}
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "핫플거리", to: "/showcase/hotplace" },
          { label: "상세보기" },
        ]}
        className="mb-4"
      />

      {/* 페이지 헤더 */}
      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600 pt-2">Hotplace Detail</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            핫플거리
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자가 남긴 장소의 분위기와 이야기를 자세히 확인해보세요.
          </p>
        </div>

        {/* 목록으로 돌아가기 */}
        <button
          type="button"
          onClick={() => navigate("/showcase/hotplace")}
          className="w-fit rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-sm active:scale-95"
        >
          목록으로
        </button>
      </section>

      {/* 상세 메인 영역 */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        {/* 왼쪽: 이미지 + 본문 영역 */}
        <div className="space-y-6 ">
          {/* 이미지 영역 */}
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-[400px] overflow-hidden bg-gray-100">
              <img
                src={slideImages[currentImageIndex]}
                alt={currentPost.title}
                className="h-full w-full object-cover"
              />

              {/* 이미지 위 장소 표시 */}
              <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm">
                {currentPost.place}
              </div>

              {/* 이미지 위 찜 버튼 */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
                  isLiked
                    ? "bg-red-50 text-red-500"
                    : "bg-white/90 text-gray-500 hover:text-red-500"
                }`}
                aria-label={`${currentPost.title} 찜하기`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill={isLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* 이전 이미지 버튼 */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95"
                aria-label="이전 이미지"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* 다음 이미지 버튼 */}
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white active:scale-95"
                aria-label="다음 이미지"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* 이미지 점 표시 */}
              <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center gap-2">
                {slideImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      currentImageIndex === index
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`${index + 1}번 이미지 보기`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 본문 영역 */}
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-5 text-xl font-extrabold text-gray-900 md:text-2xl">
              {currentPost.title}
            </h3>

            <p className="whitespace-pre-wrap text-base leading-8 text-gray-700 md:text-lg">
              {currentPost.description}
            </p>
          </article>
        </div>

        {/* 오른쪽: 상세 정보 카드 영역 */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          {/* 공유/신고 버튼 */}
          <div className="mb-6 flex items-center gap-2">
            <ClipButton />
            <button
              type="button"
              onClick={handleReportPost}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              🚩 신고
            </button>
          </div>

          {/* 작성자 정보 */}
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-6">
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

          {/* 제목 */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold text-emerald-600">Title</p>
            <h3 className="text-2xl font-extrabold leading-snug text-gray-900">
              {currentPost.title}
            </h3>
          </div>

          {/* 장소 / 작성일 */}
          <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-400">장소</span>
              <strong className="text-right text-gray-700">
                {currentPost.place}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-400">작성일</span>
              <strong className="text-gray-700">{currentPost.regDt}</strong>
            </div>
          </div>

          {/* 해시태그 */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-bold text-gray-500">해시태그</p>
            <div className="flex flex-wrap gap-2">
              {currentPost.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 조회수 / 댓글수 / 찜수 */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6 text-center">
            <div className="rounded-2xl bg-gray-50 px-3 py-4">
              <p className="text-xs text-gray-400">조회</p>
              <strong className="mt-1 block text-lg text-gray-900">
                {viewCount}
              </strong>
            </div>

            <div className="rounded-2xl bg-gray-50 px-3 py-4">
              <p className="text-xs text-gray-400">댓글</p>
              <strong className="mt-1 block text-lg text-gray-900">
                {comments.length}
              </strong>
            </div>

            <div className="rounded-2xl bg-red-50 px-3 py-4">
              <p className="text-xs text-red-300">찜</p>
              <strong className="mt-1 block text-lg text-red-500">
                {wishCount}
              </strong>
            </div>
          </div>

          {/* 수정 / 삭제 버튼 */}
            {isLogin && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/showcase/hotplace/write/${currentPost.id}`)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:border-emerald-300 hover:text-emerald-600"
                >
                  수정
                </button>

                <button
                  type="button"
                  onClick={() => alert("삭제 컴포넌트 연결 예정입니다.")}
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            )}
        </aside>
      </section>

      {/* 댓글 영역 */}
      <section className="mt-12 border-t border-gray-100 pt-10">
        <h4 className="mb-6 text-xl font-extrabold text-gray-900">
          댓글 <span className="text-emerald-500">{comments.length}</span>
        </h4>

        {/* 댓글 입력 */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-28 w-full resize-none bg-transparent text-base text-gray-700 outline-none"
            placeholder="이 여행지에 대해 궁금한 점이나 감상을 남겨주세요."
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleCommentSubmit}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              댓글 등록
            </button>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="mb-16 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                {/* 댓글 작성자 정보 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-sm">
                    👤
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">{comment.user}</p>
                    <p className="text-sm text-gray-400">{comment.date}</p>
                  </div>
                </div>

                {/* 댓글 수정 / 삭제 / 신고 */}
                <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">
                  {editingId === comment.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditing(comment.id, comment.text)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        삭제
                      </button>
                      <button
                        type="button"
                        onClick={handleReportComment}
                        className="text-gray-400 hover:text-orange-500"
                      >
                        신고
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 댓글 내용 또는 수정 입력창 */}
              {editingId === comment.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <p className="whitespace-pre-wrap text-base leading-7 text-gray-700">
                  {comment.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunityHotplaceDetail;