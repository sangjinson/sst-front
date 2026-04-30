import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { ClipButton } from "@components/modules/ActionButtons";
import { lifePosts, lifeComments } from "./communityLifeData";
import { getBadgeColor } from "@components/modules/area/arealist/areaListUtils";

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ 현재 게시글 찾기
  const post = lifePosts.find((item) => item.id === Number(id));

  // ✅ 찜 상태
  const [isLiked, setIsLiked] = useState(false);

  // ✅ 댓글 상태
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(lifeComments);

  // ✅ 댓글 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ 페이지 진입 시 화면 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ 게시글이 없을 때
  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // ✅ 배지 색상용 카테고리 배열
  const lifeCategories = ["전체", "볼거리", "먹거리", "놀거리"];

  // ✅ 찜 수 계산
  const wishCount = post.wishCnt + (isLiked ? 1 : 0);

  // ✅ 내 일정으로 가져오기
  const handleAddSchedule = () => {
    alert("내 일정으로 가져왔습니다.");
  };

  // ✅ 게시글 신고
  const handleReport = () => {
    if (window.confirm("이 게시물을 신고하시겠습니까?")) {
      alert("신고가 접수되었습니다.");
    }
  };

  // ✅ 댓글 등록
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

  // ✅ 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  // ✅ 댓글 수정 시작
  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

  // ✅ 댓글 수정 저장
  const handleSaveEdit = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: editText } : comment
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // ✅ 댓글 신고
  const handleReportComment = () => {
    if (window.confirm("이 댓글을 신고하시겠습니까?")) {
      alert("댓글 신고가 접수되었습니다.");
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      {/* ✅ 상단 경로 */}
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
          { label: "상세보기" },
        ]}
        className="mb-6"
      />

      {/* ✅ 상단 페이지 제목 영역 */}
      <section className="mt-6 mb-8 border-b border-gray-200 pb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-emerald-600">Life Detail</p>

          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            인생거리
          </h2>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 남긴 인생샷 장소와 순간을 모아봤어요.
          </p>
        </div>

        {/* ✅ 목록으로 버튼 */}
        <button
          type="button"
          onClick={() => navigate("/showcase/life")}
          className="shrink-0 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">
          목록으로
        </button>
      </section>

      {/* ✅ 대표 이미지 Hero 영역 */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
        <div className="relative h-[360px] md:h-[520px]">
          {/* ✅ 첫 번째 이미지 = 썸네일 */}
          <img
            src={post.img}
            alt={post.title}
            className="h-full w-full object-cover"
          />

          {/* ✅ 이미지 위 어두운 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* ✅ 이미지 위 제목 정보 */}
          <div className="absolute left-5 right-5 bottom-6 md:left-10 md:right-10 md:bottom-10 text-white">
            {/* ✅ 카테고리 배지 */}
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm ${getBadgeColor(
                lifeCategories,
                post.category
              )}`}
            >
              {post.category}
            </span>

            {/* ✅ 게시글 제목 */}
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">
              {post.title}
            </h1>

            {/* ✅ 장소 / 작성일 / 조회수 */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm md:text-base text-white/90">
              <span>📍 {post.place}</span>
              <span>🗓 {post.regDt}</span>
              <span>👁 {post.viewCnt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ 액션 버튼 영역 */}
      <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {/* ✅ 내 일정으로 가져오기 */}
          <button
            type="button"
            onClick={handleAddSchedule}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
          >
            내 일정으로 가져오기
          </button>

          {/* ✅ 기존 공통 링크 클립 버튼 */}
          <ClipButton />

          {/* ✅ 게시글 신고 */}
          <button
            type="button"
            onClick={handleReport}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:border-red-300 hover:text-red-500"
          >
            🚩 신고
          </button>
        </div>

        {/* ✅ 찜 버튼 */}
        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition-all active:scale-95 ${
            isLiked
              ? "bg-red-50 text-red-500"
              : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span>{wishCount}</span>
        </button>
      </section>

      {/* ✅ 블로그형 본문 + 오른쪽 요약 카드 */}
      <main className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ✅ 왼쪽 본문 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
          {/* ✅ 작성자 정보 */}
          <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl">
              👤
            </div>

            <div>
              <p className="font-bold text-gray-800">{post.author}</p>
              <p className="text-sm text-gray-400">
                {post.regDt} 작성 · {post.place}
              </p>
            </div>
          </div>

          {/* ✅ 여행 소개 */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900">
              여행 소개
            </h2>

            <p className="text-base leading-8 text-gray-600">
              {post.description}
            </p>

            <p className="mt-4 text-base leading-8 text-gray-600">
              이곳은 사진으로 남기기 좋은 분위기를 가진 장소예요. 여행 중
              특별한 장면을 기록하고 싶다면 천천히 둘러보면서 마음에 드는
              구도를 찾아보는 것을 추천합니다.
            </p>
          </section>

          
          {/* ✅ 해시태그 */}
          <section>
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        </article>

        {/* ✅ 오른쪽 여행 정보 요약 카드 */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h3 className="mb-5 text-lg font-extrabold text-gray-900">
            여행 정보
          </h3>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">장소</span>
              <strong className="text-right text-gray-800">{post.place}</strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">작성일</span>
              <strong className="text-gray-800">{post.regDt}</strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">작성자</span>
              <strong className="text-gray-800">{post.author}</strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">조회수</span>
              <strong className="text-gray-800">{post.viewCnt}</strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">댓글</span>
              <strong className="text-gray-800">{comments.length}</strong>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-400">찜</span>
              <strong className="text-red-500">{wishCount}</strong>
            </div>
          </div>
        </aside>
      </main>

      {/* ✅ 댓글 영역 */}
      <section className="mt-12 border-t border-gray-100 pt-10">
        <h4 className="mb-6 text-xl font-extrabold text-gray-900">
          댓글 <span className="text-emerald-500">{comments.length}</span>
        </h4>

        {/* ✅ 댓글 입력 */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-24 w-full resize-none bg-transparent text-sm outline-none md:text-base"
            placeholder="이 여행지에 대한 감상이나 질문을 남겨주세요."
          />

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCommentSubmit}
              className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow transition-all hover:bg-emerald-700 active:scale-95"
            >
              등록
            </button>
          </div>
        </div>

        {/* ✅ 댓글 리스트 */}
        <div className="mb-16 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-inner transition-all hover:bg-white md:p-7"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-xs shadow">
                    👤
                  </div>

                  <div>
                    <p className="font-bold text-gray-800">{comment.user}</p>
                    <p className="text-xs text-gray-400">{comment.date}</p>
                  </div>
                </div>

                {/* ✅ 댓글 수정 / 삭제 / 신고 */}
                <div className="flex gap-3 pt-1 text-xs font-semibold md:text-sm">
                  {editingId === comment.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-blue-600 hover:text-blue-800"
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

              {/* ✅ 댓글 수정 입력 / 일반 댓글 내용 */}
              {editingId === comment.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows="3"
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 md:text-[15px]">
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

export default CommunityLifeDetail;