import { useMemo, useState } from "react";

/*
 * 상세 페이지에서 댓글 작성, 댓글 목록, 댓글 수정/삭제/신고 UI를 담당하는 컴포넌트입니다.
 */

const ReportIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M4 19h16" />
    <path d="M6 19v-5a6 6 0 0 1 12 0v5" />
    <path d="M5 21h14" />
    <path d="M12 2v2" />
    <path d="M4.9 4.9 6.3 6.3" />
    <path d="M19.1 4.9 17.7 6.3" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </svg>
);

const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 15H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const normalizeName = (name) => String(name || "").trim();

const getDisplayName = (item) => {
  if (typeof item === "string") return normalizeName(item) || "익명";

  return (
    normalizeName(
      item?.user ||
        item?.nickname ||
        item?.name ||
        item?.author ||
        item?.writer
    ) || "익명"
  );
};

const getCommentText = (comment, authorName = "") => {
  const rawText = String(
    comment?.text || comment?.content || comment?.comment || ""
  ).trim();

  const author = normalizeName(authorName);

  if (!author || !rawText.startsWith(author)) return rawText;

  return rawText
    .slice(author.length)
    .replace(/^\s*[:：-]?\s*/, "")
    .trim();
};

const CommentSection = ({
  comments = [],
  newComment,
  setNewComment,
  handleCommentSubmit,
  editingId,
  setEditingId,
  editText,
  setEditText,
  startEditing,
  handleSaveEdit,
  handleDeleteComment,
  openReportModal,
  currentUserId,
  postAuthor,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 5;
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const pagedComments = useMemo(() => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    return comments.slice(startIndex, endIndex);
  }, [comments, currentPage]);

  const handleSubmit = () => {
    handleCommentSubmit();
    setCurrentPage(1);
  };

  const goPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="border-t border-gray-100 pt-10">
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
        {/* 댓글 제목 */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
          <div>
            <h4 className="text-xl font-extrabold text-gray-900">
              댓글{" "}
              <span className="text-emerald-500">{comments.length}</span>
            </h4>
            <p className="mt-1 fs-down-1 text-gray-400">
              여행지에 대한 의견을 자유롭게 남겨보세요.
            </p>
          </div>
        </div>

        {/* 댓글 작성 */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-3 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 md:p-5">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-20 w-full resize-none bg-transparent text-base text-gray-700 outline-none"
            placeholder="이 여행지에 대해 궁금한 점이나 감상을 남겨주세요."
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 fs-down-1 font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95">
              댓글 등록
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
              <p className="font-bold text-gray-500">아직 댓글이 없습니다.</p>
              <p className="mt-1 fs-down-1 text-gray-400">
                첫 댓글을 남겨보세요.
              </p>
            </div>
          ) : (
            pagedComments.map((comment) => {
              const commentAuthor = getDisplayName(comment);
              console.log("댓글:", comment);
              const isOwnComment =
                Number(comment.cmntMbrId) === Number(currentUserId);

              const canEdit = isOwnComment;
              const canDelete = isOwnComment;
              const canReport = !isOwnComment;

              return (
                <div
                  key={comment.id}
                  className="relative rounded-2xl border border-gray-100 bg-white p-5 pb-14 transition hover:border-emerald-100 hover:bg-emerald-50/20 md:p-6 md:pb-14">
                  {editingId === comment.id ? (
                    <div className="absolute right-5 top-5 flex shrink-0 items-center gap-3 fs-down-1 font-semibold md:right-6 md:top-6">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment.id)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700">
                        저장
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="cursor-pointer text-gray-400 hover:text-gray-600">
                        취소
                      </button>
                    </div>
                  ) : (
                    canReport && (
                      <button
                        type="button"
                        onClick={() => openReportModal?.(comment)}
                        className="absolute right-5 top-5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-orange-500 active:scale-95 md:right-6 md:top-6"
                        aria-label="댓글 신고">
                        <ReportIcon />
                      </button>
                    )
                  )}

                  <div className="mb-4 flex items-start gap-4 pr-12">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-sm">
                      👤
                    </div>

                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {commentAuthor}
                      </p>
                      <p className="fs-down- text-gray-400">
                        {comment.date}
                      </p>
                    </div>
                  </div>

                  {editingId === comment.id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="3"
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap fs-down-2 leading-7 text-gray-700">
                      {getCommentText(comment, commentAuthor)}
                    </p>
                  )}

                  {editingId !== comment.id && (canEdit || canDelete) && (
                    <div className="absolute bottom-5 right-5 flex items-center gap-2 md:right-6">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              comment.id,
                              getCommentText(comment, commentAuthor)
                            )
                          }
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                          aria-label="댓글 수정">
                          <EditIcon />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                          aria-label="댓글 삭제">
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => goPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 px-3 py-2 fs-down-1 font-bold text-gray-500 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40">
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goPage(page)}
                  className={`h-9 w-9 rounded-lg fs-down-1 font-bold transition ${
                    currentPage === page
                      ? "bg-emerald-600 text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
                  }`}>
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 fs-down-1 font-bold text-gray-500 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40">
              다음
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;