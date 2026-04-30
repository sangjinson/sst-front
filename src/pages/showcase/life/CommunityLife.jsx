import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { getBadgeColor } from "@components/modules/area/arealist/areaListUtils";


// ✅ 라이프 게시글 더미 데이터 가져오기
import { lifePosts } from "./communityLifeData";

const CommunityLife = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    window.scrollTo(0, 0); // ✅ 페이지 진입 시 맨 위로 이동
  }, []);

  // ✅ 검색어 상태
  const [keyword, setKeyword] = useState("");

  // ✅ 검색 대상 상태
  const [searchType, setSearchType] = useState("all");

  // ✅ 정렬 상태
  const [sortType, setSortType] = useState("latest");

  // ✅ 찜 상태 관리
  const [wishlistedPosts, setWishlistedPosts] = useState({});

  // ✅ 찜 버튼 클릭 시 상태 변경
  const toggleWishlist = (postId) => {
    setWishlistedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const lifeCategories = ["전체", "볼거리", "먹거리", "놀거리"];

  // ✅ 검색 + 정렬 처리된 게시글 목록
  const filteredPosts = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    let result = lifePosts.filter((post) => {
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

      return (
        title.includes(trimmedKeyword) ||
        content.includes(trimmedKeyword) ||
        author.includes(trimmedKeyword) ||
        place.includes(trimmedKeyword) ||
        hashtags.includes(trimmedKeyword)
      );
    });

    result = [...result].sort((a, b) => {
      if (sortType === "latest") return new Date(b.regDt) - new Date(a.regDt);

      if (sortType === "popular") {
        return (
          b.viewCnt +
          b.wishCnt +
          b.commentCnt -
          (a.viewCnt + a.wishCnt + a.commentCnt)
        );
      }

      if (sortType === "view") return b.viewCnt - a.viewCnt;
      if (sortType === "wish") return b.wishCnt - a.wishCnt;
      if (sortType === "comment") return b.commentCnt - a.commentCnt;

      return 0;
    });

    return result;
  }, [keyword, searchType, sortType]);

  // ✅ 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const currentItems = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb
        paths={[{ label: "홈", to: "/" }, { label: "인생거리" }]}
        className="mb-4"
      />

      {/* ✅ 페이지 제목 영역 */}
      <section className="mt-8 mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600">Life Shot</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            인생거리
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 남긴 인생샷 장소와 순간을 모아봤어요.
          </p>
        </div>

        {/* ✅ 글쓰기 버튼 */}
        <Link to="/showcase/life/write" className="w-fit">
          <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:scale-95">
            글쓰기
          </button>
        </Link>
      </section>

      {/* ✅ 검색 / 필터 영역 */}
      <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
            <option value="all">전체 검색</option>
            <option value="title">제목 검색</option>
            <option value="content">내용 검색</option>
            <option value="author">작성자 검색</option>
            <option value="place">장소 검색</option>
            <option value="hashtag">해시태그 검색</option>
          </select>

          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="검색어를 입력하세요"
            className="h-11 rounded-xl border border-gray-200 px-4 fs-down-1 text-gray-700 outline-none focus:border-emerald-500"
          />

          <select
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="view">조회수순</option>
            <option value="wish">찜순</option>
            <option value="comment">댓글순</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between fs-down-1 text-gray-400">
          <span>
            총{" "}
            <strong className="text-emerald-600">
              {filteredPosts.length}
            </strong>
            개의 게시글
          </span>

          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setSearchType("all");
                setCurrentPage(1);
              }}
              className="font-semibold text-gray-400 hover:text-emerald-600">
              검색 초기화
            </button>
          )}
        </div>
      </section>

      {/* ✅ 카드 목록 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {currentItems.length > 0 ? (
          currentItems.map((post) => {
            const wished = !!wishlistedPosts[post.id];
            const wishCount = post.wishCnt + (wished ? 1 : 0);

            return (
              // ✅ 이미지 + 내용 전체를 하나의 카드로 감싸는 부분
              <article
                key={post.id}
                onClick={() => navigate(`/showcase/life/view/${post.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* ✅ 카드 이미지 영역 */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />

                  {/* ✅ 카테고리 */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${getBadgeColor(
                        lifeCategories,
                        post.category
                      )}`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* ✅ 카드 내용 영역 */}
                <div className="p-4 bg-white">
                  {/* ✅ 작성자 */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px]">
                      👤
                    </div>
                    <h4 className="text-[13px] font-bold text-[#E8956D]">
                      {post.author}
                    </h4>
                  </div>

                  {/* ✅ 제목 */}
                  <p className="line-clamp-1 text-[14px] font-bold leading-tight text-gray-800 transition-colors group-hover:text-emerald-600">
                    {post.title}
                  </p>

                  {/* ✅ 설명 */}
                  <p className="mt-2 line-clamp-2 fs-down-1 leading-relaxed text-gray-500">
                    {post.description}
                  </p>

                  {/* ✅ 해시태그 */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.hashtags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-emerald-600 fs-down-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* ✅ 조회수 / 댓글 / 찜 영역 */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 fs-down-1 text-gray-400">
                    {/* ✅ 왼쪽: 조회수 + 댓글 */}
                    <div className="flex items-center gap-3">
                      <span>👁 {post.viewCnt}</span>
                      <span>💬 {post.commentCnt}</span>
                    </div>

                    {/* ✅ 오른쪽: 핫플거리처럼 반응하는 찜 버튼 */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(post.id);
                      }}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all active:scale-95 ${
                        wished
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500"
                      }`}>
                      ❤️ {wishCount}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* ✅ 페이지네이션 영역 */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all">
            &lt;
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    currentPage === page
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-110"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}>
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all">
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityLife; 