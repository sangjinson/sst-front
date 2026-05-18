import React from "react";

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

const CommunityHotplaceCard = ({
  post,
  liked,
  onClick,
  onToggleLike,
  onTagClick,
}) => {
  const getImageRatio = (size) => {
    if (size === "wide") return "aspect-[4/3]";
    if (size === "square") return "aspect-square";
    return "aspect-[3/4]";
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
      <button
        type="button"
        onClick={onClick}
        className="block w-full cursor-pointer text-left">
        <div className={`relative w-full overflow-hidden bg-gray-100 ${getImageRatio(post.size)}`}>
          <img
            src={post.img}
            alt={post.title}
            className="h-full w-full object-cover block transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-90" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="line-clamp-2 fs-down-2 font-extrabold leading-snug text-white drop-shadow-sm">
              {post.title}
            </h4>

            <p className="mt-1 line-clamp-1 fs-down-1 font-medium text-white/85">
              {post.place}
            </p>
          </div>
        </div>
      </button>

      <div className="p-4 bg-white">
        <p className="mb-8 line-clamp-2 fs-down-2 leading-relaxed text-gray-700">
          {post.description}
        </p>

        <div className="mb-3 flex items-center justify-between gap-3 fs-down-1 text-gray-500">
          <div className="min-w-0">
            <span className="mr-2">by</span>
            <strong className="fs-down-2 text-[#E8956D] truncate">
              {post.author}
            </strong>
          </div>

          <span className="shrink-0">{post.regDt}</span>
        </div>

        <div className="mb-4 h-7 flex flex-wrap gap-2">
          {post.hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="fs-down-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700">
              #{tag}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3 fs-down-1">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <button
              type="button"
              onClick={onToggleLike}
              className={`inline-flex min-w-[58px] cursor-pointer items-center gap-1.5 transition-colors active:scale-95 ${
                liked ? "text-blue-500" : "hover:text-blue-500"}`}>
              <LikeIcon />
              {post.wishCnt}
            </button>

            <span className="inline-flex items-center gap-1.5">
              <CommentIcon />
              {post.commentCnt}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-gray-400">
            <EyeIcon />
            {post.viewCnt}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CommunityHotplaceCard;