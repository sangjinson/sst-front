import React from "react";
import IconSVG from "@components/Icon/IconSVG";

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

const THEME_COLOR = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700",
];

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CommentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 translate-y-[1px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const LikeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M7 11v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3z" />
    <path d="M7 11l4.4-7.1A2 2 0 0 1 15 5v4h4a2 2 0 0 1 2 2.3l-1.2 8A2 2 0 0 1 17.8 21H7V11z" />
  </svg>
);

const CommunityLifeCard = ({
  post,
  onClick,

  // 현재 사용자가 좋아요를 눌렀는지 여부
  liked = false,

  // 좋아요 버튼 클릭 시 실행될 함수
  onToggleLike,
}) => {
  // 화면에 보여줄 좋아요 수
  const likeCount = post.wishCnt;

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
      <div className="flex flex-col md:flex-row md:h-[230px]">
        {/* 썸네일 */}
        <div className="relative w-full h-[220px] md:w-[280px] md:h-full md:shrink-0 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 fs-down-1 font-semibold text-gray-900 shadow-sm">
            <IconSVG
              name="location"
              size={15}
              className="shrink-0 fill-none stroke-gray-900"
              strokeWidth={2}
            />
            {post.region}
          </span>
        </div>

        {/* 내용 */}
        <div className="relative flex-1 min-w-0 p-5 pb-16 md:p-6 md:pb-16 flex flex-col overflow-hidden">
          {/* 날짜 */}
          <span className="absolute right-5 top-5 fs-down-1 text-gray-400 md:right-6 md:top-6">
            {post.regDt}
          </span>

          <div className="overflow-hidden pr-20 md:pr-28">
            {/* 작성자 */}
            <div className="mb-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">
                😊
              </div>

              <span className="fs-down-1 font-semibold text-[#E8956D] truncate">
                {post.author}
              </span>
            </div>

            {/* 제목 */}
            <h3 className="fs-down-3 font-extrabold text-gray-900 mb-2 line-clamp-1 hover:text-[#0F9B73] transition break-all">
              {post.title}
            </h3>

            {/* 설명 */}
            <p className="fs-down-1 text-gray-500 leading-relaxed line-clamp-2 mb-3 break-all">
              {post.description}
            </p>

            {/* 테마 뱃지 */}
            {(post.themes || []).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap overflow-hidden md:max-h-[26px]">
                {(post.themes || []).map((theme, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-0.5 rounded-full fs-down-1 font-semibold ${
                      THEME_COLOR[i % THEME_COLOR.length]
                    }`}>
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 좋아요 / 댓글 */}
          <div className="absolute bottom-5 left-5 flex items-center gap-4 fs-down-1 font-bold text-gray-900 md:left-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike?.(post.id);
              }}
              className={`inline-flex min-w-[58px] cursor-pointer items-center gap-1.5 transition-colors active:scale-95 ${
                liked ? "text-blue-500" : "hover:text-blue-500"
              }`}>
              <LikeIcon />
              {likeCount}
            </button>

            <span className="inline-flex items-center gap-1.5">
              <CommentIcon />
              {post.commentCnt}
            </span>
          </div>

          {/* 조회 */}
          <div className="absolute bottom-5 right-5 flex items-center fs-down-1 text-gray-400 md:right-6">
            <span className="inline-flex items-center gap-1.5">
              <EyeIcon />
              {post.viewCnt}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CommunityLifeCard;