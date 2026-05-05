import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { getAllLifePosts } from "./communityLifeData";
import CommunityLifeCard from "@components/modules/community/life/CommunityLifeCard";

const CommunityLife = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [sortType, setSortType] = useState("latest");

  // 좋아요 상태 관리 (핵심 추가)
  // { postId: true/false }
  const [likedPosts, setLikedPosts] = useState({});

  // 좋아요 토글 함수 (핵심 추가)
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

      return (
        title.includes(kw) ||
        content.includes(kw) ||
        author.includes(kw) ||
        region.includes(kw) ||
        hashtags.includes(kw)
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
  }, [posts, keyword, searchType, sortType]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 mb-20 font-sans">
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
        ]}
        className="mb-4"
      />

      {/* 제목 영역 */}
      <section className="mt-8 mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73]">Life Course</p>

          <div className="mt-1 flex items-end gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              인생거리
            </h2>

            <Link
              to="/showcase/hotplace"
              className="mb-1 fs-down-1 md:text-lg font-bold text-gray-400 transition-all hover:text-emerald-600 hover:scale-110">
              / 핫플거리
            </Link>
          </div>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 직접 만든 인생 여행 코스를 공유해요.
          </p>
        </div>

        <Link to="/showcase/life/write" className="w-fit">
          <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0F9B73] hover:shadow-md active:scale-95">
            코스 공유하기
          </button>
        </Link>
      </section>

      {/* 검색/필터 */}
      <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
            <option value="all">전체 검색</option>
            <option value="title">제목 검색</option>
            <option value="content">내용 검색</option>
            <option value="author">작성자 검색</option>
            <option value="region">지역 검색</option>
            <option value="hashtag">해시태그 검색</option>
          </select>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="h-11 rounded-xl border border-gray-200 px-4 fs-down-1 text-gray-700 outline-none focus:border-emerald-500"
          />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
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
              }}
              className="font-semibold text-gray-400 hover:text-emerald-600"
            >
              검색 초기화
            </button>
          )}
        </div>
      </section>

      {/* 게시글 목록 */}
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {filteredPosts.map((post) => (
            <CommunityLifeCard
              key={post.id}
              post={post}

              // 좋아요 상태 전달
              liked={!!likedPosts[post.id]}

              // 좋아요 클릭 이벤트 전달
              onToggleLike={toggleLike}

              // 카드 클릭
              onClick={() =>
                navigate(`/showcase/life/view/${post.id}`)
              }
            />
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