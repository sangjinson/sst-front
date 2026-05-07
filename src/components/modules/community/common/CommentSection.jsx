/*
 * 상세 페이지에서 댓글 작성, 댓글 목록, 댓글 수정/삭제/신고 UI를 담당하는 컴포넌트입니다.

* 사용 예시:
 *
 * import CommentSection from "@components/modules/community/comment/CommentSection";
 * 
 * const [comments, setComments] = useState([]);
 * const [newComment, setNewComment] = useState("");
 * const [editingId, setEditingId] = useState(null);
 * const [editText, setEditText] = useState("");
 * 
 * 상태 업데이트 로직
 * const handleCommentSubmit = () => {};
 * const startEditing = (id, text) => {};
 * const handleSaveEdit = (id) => {};
 * const handleDeleteComment = (id) => {};
 * const openReportModal = (type) => {};
 *
 * <CommentSection
 *   comments={comments}  // 댓글 목록 배열
 *   newComment={newComment} // 새 댓글 입력값 (textarea 값)
 *   setNewComment={setNewComment} // 새 댓글 입력값을 변경하는 함수
 *   handleCommentSubmit={handleCommentSubmit} // 댓글 등록 버튼 클릭 시 실행되는 함수
 *   editingId={editingId} // 현재 수정 중인 댓글의 id (없으면 null)
 *   setEditingId={setEditingId} // 수정 상태를 변경하는 함수
 *   editText={editText} // 수정 중인 댓글 내용
 *   setEditText={setEditText} // 수정 중인 댓글 내용을 변경하는 함수
 *   startEditing={startEditing} // 댓글 수정 버튼 클릭 시 실행되는 함수 (수정 모드 진입)
 *   handleSaveEdit={handleSaveEdit} // 수정 완료(저장) 시 실행되는 함수
 *   handleDeleteComment={handleDeleteComment} // 댓글 삭제 함수
 *   openReportModal={openReportModal} // 신고 버튼 클릭 시 실행되는 함수 ("comment" 타입 전달)
*/

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  return normalizeName(item?.user || item?.nickname || item?.name || item?.author || item?.writer) || "익명";
};

const getCommentText = (comment, authorName = "") => {
  const rawText = String(comment?.text || comment?.content || comment?.comment || "").trim();
  const author = normalizeName(authorName);

  if (!author || !rawText.startsWith(author)) return rawText;

  return rawText.slice(author.length).replace(/^\s*[:：-]?\s*/, "").trim();
};

const CommentSection = ({
  comments,
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
  currentUser = "경기도민",
  postAuthor,
}) => {
  return (
    <section className="mt-12 border-t border-gray-100 pt-10">
      <h4 className="mb-6 text-xl font-extrabold text-gray-900">
        댓글 <span className="text-emerald-500">{comments.length}</span>
      </h4>

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
            className="rounded-xl bg-emerald-600 px-6 py-2.5 fs-down-1 font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            댓글 등록
          </button>
        </div>
      </div>

      <div className="mb-16 space-y-4">
        {comments.map((comment) => {
          const commentAuthor = getDisplayName(comment);
          const postOwner = getDisplayName(postAuthor);
          const isOwnComment = normalizeName(commentAuthor) === normalizeName(currentUser) || normalizeName(commentAuthor) === "나";
          const isOwnPost = normalizeName(postOwner) === normalizeName(currentUser);
          const canEdit = isOwnComment;
          const canDelete = isOwnComment || isOwnPost;
          const canReport = !isOwnComment;

          return (
            <div
              key={comment.id}
              className="relative rounded-3xl border border-gray-100 bg-white p-5 pb-14 shadow-sm transition hover:shadow-md md:p-6 md:pb-14">
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
                    onClick={() => openReportModal?.("comment")}
                    className="absolute right-5 top-5 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-orange-500 active:scale-95 md:right-6 md:top-6"
                    aria-label="댓글 신고"
                  >
                    <ReportIcon />
                  </button>
                )
              )}

              <div className="mb-4 flex items-start gap-4 pr-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-sm">
                    👤
                  </div>

                  <div>
                    <p className="text-base font-bold text-gray-900">{commentAuthor}</p>
                    <p className="fs-down-1 text-gray-400">{comment.date}</p>
                  </div>
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
                <p className="whitespace-pre-wrap fs-down-1 leading-7 text-gray-700">
                  {getCommentText(comment, commentAuthor)}
                </p>
              )}

              {editingId !== comment.id && (canEdit || canDelete) && (
                <div className="absolute bottom-5 right-5 flex items-center gap-2 md:right-6">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => startEditing(comment.id, getCommentText(comment, commentAuthor))}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                      aria-label="댓글 수정"
                    >
                      <EditIcon />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                      aria-label="댓글 삭제"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CommentSection;