import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";

const CommunityHotplace = () => {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState({});

  const posts = [
    {
      id: 16,
      title: "서울 야경 명소 발견!",
      author: "서울시민",
      likes: 45,
      img: "https://picsum.photos/seed/hotplace-16/720/920",
      description: "해가 진 뒤에 더 예뻐지는 전망 포인트예요. 산책 코스로도 좋았습니다.",
      size: "tall",
    },
    {
      id: 15,
      title: "제주도 숨은 카페",
      author: "여행가J",
      likes: 88,
      img: "https://picsum.photos/seed/hotplace-15/720/640",
      description: "창가 자리에서 바다가 바로 보여서 사진 찍기 좋은 곳이에요.",
      size: "wide",
    },
    {
      id: 14,
      title: "강릉 바다 힐링 여행",
      author: "파도사랑",
      likes: 23,
      img: "https://picsum.photos/seed/hotplace-14/720/900",
      description: "사람이 많지 않은 시간대에 가면 바다 소리까지 온전히 즐길 수 있어요.",
      size: "tall",
    },
    {
      id: 13,
      title: "부산 밀면 맛집 인증",
      author: "미식가",
      likes: 120,
      img: "https://picsum.photos/seed/hotplace-13/720/720",
      description: "웨이팅은 있었지만 한입 먹자마자 기다린 보람이 느껴졌습니다.",
      size: "square",
    },
    {
      id: 12,
      title: "전주 한옥마을 산책",
      author: "한옥러버",
      likes: 56,
      img: "https://picsum.photos/seed/hotplace-12/720/860",
      description: "골목마다 분위기가 달라서 천천히 걸을수록 더 재밌는 코스예요.",
      size: "tall",
    },
    {
      id: 11,
      title: "속초 중앙시장 먹거리",
      author: "먹방러",
      likes: 77,
      img: "https://picsum.photos/seed/hotplace-11/720/620",
      description: "짧은 일정에도 들르기 좋은 시장 코스입니다. 간식 종류가 정말 많아요.",
      size: "wide",
    },
    {
      id: 10,
      title: "가을 단풍 구경",
      author: "단풍맨",
      likes: 34,
      img: "https://picsum.photos/seed/hotplace-10/720/930",
      description: "오후 햇빛이 들어올 때 색감이 가장 좋았어요.",
      size: "tall",
    },
    {
      id: 9,
      title: "인천 월미도 나들이",
      author: "바다아이",
      likes: 12,
      img: "https://picsum.photos/seed/hotplace-9/720/720",
      description: "바다와 놀이기구를 한 번에 즐기기 좋은 당일치기 장소입니다.",
      size: "square",
    },
    {
      id: 8,
      title: "경기도 화성 1일차",
      author: "경기도 청년",
      likes: 30,
      img: "https://picsum.photos/seed/hotplace-8/720/840",
      description: "생각보다 볼 곳이 많아서 하루 코스로 꽉 채워 다녀왔어요.",
      size: "tall",
    },
  ];

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getImageRatio = (size) => {
    if (size === "wide") return "aspect-[4/3]";
    if (size === "square") return "aspect-square";
    return "aspect-[3/4]";
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb
        paths={[{ label: "홈", to: "/" }, { label: "뽐낼거리", to: "/showcase" }]}
        className="mb-4"
      />

      <section className="mt-8 mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600">Hotplace</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">핫플거리</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 직접 발견한 장소와 분위기를 사진 카드로 모아봤어요.
          </p>
        </div>

        <Link to="/showcase/hotplace/write" className="w-fit">
          <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-emerald-600 transition-all active:scale-95">
            글쓰기
          </button>
        </Link>
      </section>

      <div className="columns-1 md:columns-2 xl:columns-3 gap-5 md:gap-6">
        {posts.map((post) => {
          const liked = !!likedPosts[post.id];
          const likeCount = post.likes + (liked ? 1 : 0);

          return (
            <article
              key={post.id}
              className="mb-5 md:mb-6 break-inside-avoid overflow-hidden rounded-xl border border-[#eee] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.09)] group"
            >
              <button
                type="button"
                onClick={() => navigate(`/showcase/hotplace/view/${post.id}`)}
                className="block w-full text-left"
              >
                <div className="p-4 bg-white">
                  <h4 className="fs-up-3 font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                </div>

                <div className={`w-full overflow-hidden bg-gray-100 ${getImageRatio(post.size)}`}>
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>

              <div className="p-5 relative bg-white">
                <p className="fs-up-2 text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-xs text-gray-400 mb-0.5">작성자</span>
                    <strong className="block text-sm text-gray-900 truncate">{post.author}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-bold transition-all active:scale-95 ${
                      liked
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-500"
                    }`}
                    aria-label={`${post.title} 좋아요`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill={liked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {likeCount}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityHotplace;
