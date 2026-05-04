import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { getAllPosts } from "./communityHotplaceData"; // ✅ 변경

const CommunityHotplace = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // ✅ 페이지 진입 시 맨 위로 이동
  }, []);

  // 사용자가 좋아요를 눌렀는지 저장하는 상태
  const [likedPosts, setLikedPosts] = useState({});
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [sortType, setSortType] = useState("latest");

  // ✅ 더미 + 유저 게시글 합쳐서 사용
  const posts = getAllPosts();

  const filteredPosts = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    let result = posts.filter((post) => {
      if (!trimmedKeyword) return true;
      const title = post.title.toLowerCase();
      const content = post.description.toLowerCase();
      const author = post.author.toLowerCase();
      const place = post.place.toLowerCase();
      const hashtags = post.hashtags.join(" ").toLowerCase();

      if (searchType === "title") return title.includes(trimmedKeyword);
      if (searchType === "content") return content.includes(trimmedKeyword);
      if (searchType === "author") return author.includes(trimmedKeyword);
      if (searchType === "place") return place.includes(trimmedKeyword);
      if (searchType === "hashtag") return hashtags.includes(trimmedKeyword);
      return title.includes(trimmedKeyword) || content.includes(trimmedKeyword) ||
        author.includes(trimmedKeyword) || place.includes(trimmedKeyword) || hashtags.includes(trimmedKeyword);
    });

    result = [...result].sort((a, b) => {
      if (sortType === "latest") return new Date(b.regDt) - new Date(a.regDt);
      if (sortType === "popular") return b.viewCnt + b.wishCnt + b.commentCnt - (a.viewCnt + a.wishCnt + a.commentCnt);
      if (sortType === "view") return b.viewCnt - a.viewCnt;
      if (sortType === "wish") return b.wishCnt - a.wishCnt;
      if (sortType === "comment") return b.commentCnt - a.commentCnt;
      return 0;
    });

    return result;
  }, [posts, keyword, searchType, sortType]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getImageRatio = (size) => {
    if (size === "wide") return "aspect-[4/3]";
    if (size === "square") return "aspect-square";
    return "aspect-[3/4]";
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 mb-20 font-sans">
      <Breadcrumb paths={[{ label: "홈", to: "/" }, { label: "핫플거리", to: "/showcase" }]} className="mb-4" />

      <section className="mt-8 mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">Hotplace</p>
            {/* 제목 + 이동 탭 */}
            <div className="mt-1 flex items-end gap-3">
              {/* 현재 페이지 */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                핫플거리
              </h2>
              {/* 이동 (인생거리) */}
              <Link
                to="/showcase/life"
                className="mb-1 fs-down-1 md:text-lg font-bold text-gray-400 transition-all hover:text-[#0F9B73] hover:scale-110">
                / 인생거리
              </Link>
            </div>
            <p className="mt-2 text-sm md:text-base text-gray-500">
              여행자들이 직접 발견한 장소와 분위기를 사진 카드로 모아봤어요.
            </p>
          </div>
        <Link to="/showcase/hotplace/write" className="w-fit">
          <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:scale-95">
            글쓰기
          </button>
        </Link>
      </section>

      <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
            <option value="all">전체 검색</option>
            <option value="title">제목 검색</option>
            <option value="author">작성자 검색</option>
            <option value="place">장소 검색</option>
          </select>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-11 rounded-xl border border-gray-200 px-4 fs-down-1 text-gray-700 outline-none focus:border-emerald-500" />
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="view">조회수순</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between fs-down-1 text-gray-400">
          <span>총 <strong className="text-emerald-600">{filteredPosts.length}</strong>개의 게시글</span>
          {keyword && (
            <button type="button" onClick={() => { setKeyword(""); setSearchType("all"); }}
              className="font-semibold text-gray-400 hover:text-emerald-600">검색 초기화</button>
          )}
        </div>
      </section>

      {filteredPosts.length > 0 ? (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-5 md:gap-6">
          {filteredPosts.map((post) => {
            const liked = !!likedPosts[post.id];
            const likeCount = post.wishCnt + (liked ? 1 : 0);
            return (
              <article key={post.id}
                className="mb-5 md:mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                <button type="button" onClick={() => navigate(`/showcase/hotplace/view/${post.id}`)} className="block w-full text-left">
                  <div className={`relative w-full overflow-hidden bg-gray-100 ${getImageRatio(post.size)}`}>
                    <img src={post.img} alt={post.title}
                      className="h-full w-full object-cover block transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="line-clamp-2 fs-down-2 font-extrabold leading-snug text-white drop-shadow-sm">{post.title}</h4>
                      <p className="mt-1 line-clamp-1 fs-down-1 font-medium text-white/85">{post.place}</p>
                    </div>
                  </div>
                </button>
                <div className="p-4 bg-white">
                  <p className="mb-8 line-clamp-2 fs-down-2 leading-relaxed text-gray-700">{post.description}</p>
                  <div className="mb-3 flex items-center justify-between gap-3 fs-down-1 text-gray-500">
                    <div className="min-w-0">
                      <span className="mr-2">by</span>
                      <strong className="fs-down-2 text-[#E8956D] truncate">{post.author}</strong>
                    </div>
                    <span className="shrink-0">{post.regDt}</span>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <span key={tag} className="fs-down-1 font-semibold text-emerald-600 hover:text-emerald-700">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3 fs-down-1 text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>👁 {post.viewCnt}</span>
                      <span>💬 {post.commentCnt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all active:scale-95 ${
                        liked
                          ? "bg-blue-50 text-blue-500"
                          : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-500"
                      }`}>
                      👍 {likeCount}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default CommunityHotplace;