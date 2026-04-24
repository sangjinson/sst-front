import React, { useState } from 'react';

const AttractionCard = ({ item }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition">

      {/* 이미지 영역 */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[180px] object-cover"
        />

        {/* ❤️ 좋아요 버튼 */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 active:scale-90 transition cursor-pointer border-none outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all duration-200 ${
              liked ? 'text-red-500 scale-110' : 'text-white'
            }`}
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>

        {/* 🔥 지역 + 카테고리 */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="bg-white/95 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full font-semibold shadow">
            {item.region}
          </span>

          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            {item.tag}
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-4">

        {/* 제목 + 평점/댓글 */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-sm leading-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-500">

            {/* ⭐ 평점 */}
            <div className="flex items-center gap-1 text-orange-500 font-semibold">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
              <span>0.0</span>
            </div>

            {/* 💬 댓글 */}
            <div className="flex items-center gap-1 text-gray-400">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>12</span>
            </div>

          </div>
        </div>

        {/* 🔥 해시태그 (진짜 태그) */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {item.hashtags?.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-gray-100 px-2 py-1 rounded-full text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {item.desc}
        </p>

        {/* 📍 위치 */}
        <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {item.location}
        </p>
      </div>
    </div>
  );
};

export default AttractionCard;