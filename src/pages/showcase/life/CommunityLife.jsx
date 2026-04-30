import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { getAllLifePosts, COMPANION_EMOJI } from "./communityLifeData";

const CommunityLife = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [sortType, setSortType] = useState("latest");

  const posts = getAllLifePosts();

  const filteredPosts = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    let result = posts.filter((post) => {
      if (!kw) return true;
      const title = post.title.toLowerCase();
      const content = post.description.toLowerCase();
      const author = post.author.toLowerCase();
      const region = post.region.toLowerCase();
      const hashtags = post.hashtags.join(" ").toLowerCase();

      if (searchType === "title") return title.includes(kw);
      if (searchType === "content") return content.includes(kw);
      if (searchType === "author") return author.includes(kw);
      if (searchType === "region") return region.includes(kw);
      if (searchType === "hashtag") return hashtags.includes(kw);
      return title.includes(kw) || content.includes(kw) || author.includes(kw) || region.includes(kw) || hashtags.includes(kw);
    });

    result = [...result].sort((a, b) => {
      if (sortType === "latest") return new Date(b.regDt) - new Date(a.regDt);
      if (sortType === "popular") return (b.viewCnt + b.wishCnt + b.commentCnt) - (a.viewCnt + a.wishCnt + a.commentCnt);
      if (sortType === "view") return b.viewCnt - a.viewCnt;
      if (sortType === "wish") return b.wishCnt - a.wishCnt;
      if (sortType === "comment") return b.commentCnt - a.commentCnt;
      return 0;
    });

    return result;
  }, [posts, keyword, searchType, sortType]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb paths={[{ label: "홈", to: "/" }, { label: "인생거리", to: "/showcase/life" }]} className="mb-4" />

      <section className="mt-8 mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73]">Life Course</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">인생거리</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">여행자들이 직접 만든 인생 여행 코스를 공유해요.</p>
        </div>
        <button
          onClick={() => navigate('/showcase/life/write')}
          className="w-fit rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0F9B73] hover:shadow-md active:scale-95">
          코스 공유하기
        </button>
      </section>

      {/* 검색/필터 */}
      <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0F9B73]">
            <option value="all">전체 검색</option>
            <option value="title">제목 검색</option>
            <option value="content">내용 검색</option>
            <option value="author">작성자 검색</option>
            <option value="region">지역 검색</option>
            <option value="hashtag">해시태그 검색</option>
          </select>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-[#0F9B73]" />
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0F9B73]">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="view">조회수순</option>
            <option value="wish">찜순</option>
            <option value="comment">댓글순</option>
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span>총 <strong className="text-[#0F9B73]">{filteredPosts.length}</strong>개의 코스</span>
          {keyword && (
            <button onClick={() => { setKeyword(""); setSearchType("all"); }}
              className="font-semibold text-gray-400 hover:text-[#0F9B73]">검색 초기화</button>
          )}
        </div>
      </section>

      {/* 게시글 목록 */}
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-5">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/showcase/life/view/${post.id}`)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">

                {/* 썸네일 */}
                <div className="w-full md:w-[280px] h-[200px] md:h-auto shrink-0 overflow-hidden">
                  <img src={post.thumbnail} alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>

                {/* 내용 */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
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

                    {/* 본문 미리보기 */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {post.description}
                    </p>

                    {/* ✅ 동행유형 + 여행테마 태그 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 동행 유형 */}
                      {post.companion && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                          {COMPANION_EMOJI[post.companion] || '👤'} {post.companion}
                        </span>
                      )}
                      {/* 여행 테마 */}
                      {(post.themes || []).map((theme, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#f0fdf9] text-[#0F9B73] text-xs font-semibold rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 하단 작성자 + 통계 */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">😊</div>
                      <span className="text-sm font-semibold text-[#E8956D]">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>👁 {post.viewCnt}</span>
                      <span>💬 {post.commentCnt}</span>
                      <span>❤️ {post.wishCnt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default CommunityLife;