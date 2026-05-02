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
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-sm">
                  👤
                </div>

                <div>
                  <p className="font-bold text-gray-900">{comment.user}</p>
                  <p className="fs-down-1 text-gray-400">{comment.date}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 fs-down-1 font-semibold">
                {editingId === comment.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(comment.id)}
                      className="text-blue-500 hover:text-blue-700">
                      저장
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                      className="text-gray-400 hover:text-gray-600">
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEditing(comment.id, comment.text)}
                      className="text-gray-400 hover:text-blue-500">
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-500">
                      삭제
                    </button>

                    <button
                      type="button"
                      onClick={() => openReportModal("comment")}
                      className="text-gray-400 hover:text-orange-500">
                      신고
                    </button>
                  </>
                )}
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
                {comment.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;