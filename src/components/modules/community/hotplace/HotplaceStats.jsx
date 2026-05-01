
const HotplaceStats = ({
  currentPost,
  viewCount,
  comments,
  wishCount,
  isLogin,
  navigate,
}) => {
  return (
    <>
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div>
          <p className="mb-3 text-sm font-bold text-gray-500">해시태그</p>
          <div className="flex flex-wrap gap-2">
            {currentPost.hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
          <div className="rounded-2xl bg-gray-50 px-3 py-4">
            <p className="text-xs text-gray-400">조회</p>
            <strong className="mt-1 block text-lg text-gray-900">{viewCount}</strong>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-4">
            <p className="text-xs text-gray-400">댓글</p>
            <strong className="mt-1 block text-lg text-gray-900">{comments.length}</strong>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-4">
            <p className="text-xs text-gray-400">찜</p>
            <strong className="mt-1 block text-lg text-gray-900">{wishCount}</strong>
          </div>
        </div>

        {isLogin && (
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => navigate(`/showcase/hotplace/write/${currentPost.id}`)}
              className="rounded-xl border border-gray-200 px-4 py-3 fs-down-1 font-bold text-gray-600 transition hover:border-emerald-300 hover:text-emerald-600">수정</button>

            <button type="button" onClick={() => alert("삭제 컴포넌트 연결 예정입니다.")}
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 fs-down-1 font-bold text-red-500 transition hover:bg-red-100">삭제</button>
          </div>
        )}
      </div>
    </>
  );
};

export default HotplaceStats;