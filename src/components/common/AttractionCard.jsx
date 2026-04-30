import React, { useState } from 'react';
import Toast from '@components/common/Toast';

const AttractionCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 👉 로그인 여부 (나중에 실제 auth로 교체)
  const isLogin = false;

  const handleLike = () => {
    if (!isLogin) {
      setShowToast(true);
      return;
    }
    setLiked(!liked);
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

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
            className="absolute top-3 right-3 p-2.5 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-5 h-5 transition-colors ${
                liked ? 'text-red-500' : 'text-white'
              }`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </button>

          {/* 태그 */}
          <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
            {item.tag}
          </span>
        </div>

        {/* 내용 */}
        <div className="p-4">
          <div className="flex justify-between items-center">

            {/* 제목 */}
            <h3 className="font-semibold text-sm">{item.title}</h3>

            {/* ⭐ 평점 */}
            <div className="flex items-center gap-1 text-orange-500 font-semibold shrink-0 bg-orange-500/10 px-2 py-0.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>

              <span>0.0</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {item.desc}
          </p>

          {/* 📍 위치 */}
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {item.location}
          </p>
        </div>
      </div>

      {/* 🔥 토스트 */}
      {showToast && (
        <Toast
          message="로그인이 필요합니다"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default AttractionCard;