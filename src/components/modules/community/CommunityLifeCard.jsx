import React from "react";
import { TYPE_LABEL, TYPE_COLOR } from "@pages/showcase/life/communityLifeData";

/*
  사용법 예시

  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <CommunityLifeCard
      post={post}
      liked={!!likedPosts[post.id]}
      onClick={() => console.log("카드 클릭")}
      onToggleLike={toggleLike}
    />
  );
*/

const CommunityLifeCard = ({
  post,
  onClick,

  // 현재 사용자가 좋아요를 눌렀는지 여부
  liked = false,

  // 좋아요 버튼 클릭 시 실행될 함수
  onToggleLike,
}) => {
  // 화면에 보여줄 좋아요 수
  // liked가 true면 기존 wishCnt에서 +1 해서 보여줌
  const likeCount = liked ? post.wishCnt + 1 : post.wishCnt;

  return (
    <article
      onClick={onClick}
      className="h-[230px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <div className="flex h-full">
        {/* 썸네일 */}
        <div className="w-[280px] h-full shrink-0 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* 내용 */}
        <div className="flex-1 h-full p-5 md:p-6 flex flex-col justify-between overflow-hidden">
          <div className="overflow-hidden">
            {/* 지역 + 날짜 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#f0fdf9] text-[#0F9B73] text-xs font-semibold rounded-full">
                📍 {post.region}
              </span>
              <span className="text-xs text-gray-400">{post.regDt}</span>
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-extrabold text-gray-900 mb-2 line-clamp-1 hover:text-[#0F9B73] transition">
              {post.title}
            </h3>

            {/* 설명 */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {post.description}
            </p>

            {/* 코스 */}
            <div className="flex items-center gap-2 flex-wrap overflow-hidden max-h-[26px]">
              {(post.course || []).slice(0, 4).map((c, i) => (
                <React.Fragment key={c.order || i}>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        TYPE_COLOR[c.type]
                      }`}
                    >
                      {TYPE_LABEL[c.type]}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      {c.name}
                    </span>
                  </div>

                  {i < Math.min((post.course || []).length, 4) - 1 && (
                    <span className="text-gray-300 text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 작성자 + 통계 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* 작성자 */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">
                😊
              </div>
              <span className="text-sm font-semibold text-[#E8956D]">
                {post.author}
              </span>
            </div>

            {/* 조회수 + 댓글 + 좋아요 */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>👁 {post.viewCnt}</span>
              <span>💬 {post.commentCnt}</span>

              {/* 좋아요 버튼 */}
              <button
                type="button"
                onClick={(e) => {
                  // 좋아요 버튼 클릭 시 article의 onClick이 같이 실행되는 것을 방지
                  e.stopPropagation();

                  // 부모 컴포넌트에서 받은 좋아요 토글 함수 실행
                  onToggleLike?.(post.id);
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all active:scale-95 ${
                  liked
                    ? "bg-blue-50 text-blue-500"
                    : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-500"
                }`}
              >
                👍 {likeCount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommunityLifeCard;