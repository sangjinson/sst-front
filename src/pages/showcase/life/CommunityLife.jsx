import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";

const CommunityLife = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // 검색어 상태
  const [keyword, setKeyword] = useState("");

  // 검색 대상 상태
  const [searchType, setSearchType] = useState("all");

  // 정렬 상태
  const [sortType, setSortType] = useState("latest");

  // 찜 상태 관리
  const [wishlistedPosts, setWishlistedPosts] = useState({});

  const toggleWishlist = (postId) => {
    setWishlistedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const posts = [
    {
      id: 16,
      title: "서울 야경 명소 발견!",
      author: "서울시민",
      place: "서울 남산타워",
      regDt: "2026-04-29",
      viewCnt: 312,
      wishCnt: 45,
      commentCnt: 8,
      hashtags: ["야경", "서울", "핫플"],
      img: "https://picsum.photos/seed/life-16/400/533",
      description: "인생샷 남기기 좋은 서울 야경 명소예요.",
      category: "볼거리",
    },
    {
      id: 15,
      title: "제주도 숨은 카페 공유해요",
      author: "여행가J",
      place: "제주 애월 카페거리",
      regDt: "2026-04-28",
      viewCnt: 521,
      wishCnt: 88,
      commentCnt: 14,
      hashtags: ["제주", "카페", "바다뷰"],
      img: "https://picsum.photos/seed/life-15/400/533",
      description: "창가 자리에서 인생샷 찍기 좋은 카페였어요.",
      category: "먹거리",
    },
    {
      id: 14,
      title: "강릉 바다 힐링 여행",
      author: "파도사랑",
      place: "강릉 안목해변",
      regDt: "2026-04-27",
      viewCnt: 198,
      wishCnt: 23,
      commentCnt: 5,
      hashtags: ["강릉", "바다", "힐링"],
      img: "https://picsum.photos/seed/life-14/400/533",
      description: "바다를 배경으로 사진 찍기 좋은 여행 코스예요.",
      category: "볼거리",
    },
    {
      id: 13,
      title: "부산 밀면 맛집 인증",
      author: "미식가",
      place: "부산 서면",
      regDt: "2026-04-26",
      viewCnt: 742,
      wishCnt: 120,
      commentCnt: 21,
      hashtags: ["부산", "맛집", "밀면"],
      img: "https://picsum.photos/seed/life-13/400/533",
      description: "음식 사진도 예쁘게 나오는 부산 맛집이에요.",
      category: "먹거리",
    },
    {
      id: 12,
      title: "전주 한옥마을 산책",
      author: "한옥러버",
      place: "전주 한옥마을",
      regDt: "2026-04-25",
      viewCnt: 355,
      wishCnt: 56,
      commentCnt: 9,
      hashtags: ["전주", "한옥마을", "산책"],
      img: "https://picsum.photos/seed/life-12/400/533",
      description: "한복 입고 찍으면 분위기 좋은 인생샷 코스예요.",
      category: "놀거리",
    },
    {
      id: 11,
      title: "속초 중앙시장 먹거리 탐방",
      author: "먹방러",
      place: "속초 중앙시장",
      regDt: "2026-04-24",
      viewCnt: 410,
      wishCnt: 77,
      commentCnt: 11,
      hashtags: ["속초", "시장", "먹거리"],
      img: "https://picsum.photos/seed/life-11/400/533",
      description: "시장 분위기와 먹거리 사진을 남기기 좋아요.",
      category: "먹거리",
    },
    {
      id: 10,
      title: "가을 단풍 구경 다녀옴",
      author: "단풍맨",
      place: "내장산 국립공원",
      regDt: "2026-04-23",
      viewCnt: 167,
      wishCnt: 34,
      commentCnt: 3,
      hashtags: ["단풍", "가을", "등산"],
      img: "https://picsum.photos/seed/life-10/400/533",
      description: "단풍 배경으로 사진 찍기 정말 좋았어요.",
      category: "볼거리",
    },
    {
      id: 9,
      title: "인천 월미도 나들이",
      author: "바다아이",
      place: "인천 월미도",
      regDt: "2026-04-22",
      viewCnt: 94,
      wishCnt: 12,
      commentCnt: 2,
      hashtags: ["인천", "월미도", "나들이"],
      img: "https://picsum.photos/seed/life-9/400/533",
      description: "놀이기구와 바다 배경이 잘 어울리는 곳이에요.",
      category: "놀거리",
    },
    {
      id: 8,
      title: "경기도 화성 1일차",
      author: "경기도 청년",
      place: "경기도 화성",
      regDt: "2026-04-21",
      viewCnt: 226,
      wishCnt: 30,
      commentCnt: 6,
      hashtags: ["경기도", "화성", "당일치기"],
      img: "https://picsum.photos/seed/life-8/400/533",
      description: "당일치기로 다녀오기 좋은 사진 코스였어요.",
      category: "볼거리",
    },
  ];

  // 검색 + 정렬 처리된 게시글 목록
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

      return (
        title.includes(trimmedKeyword) ||
        content.includes(trimmedKeyword) ||
        author.includes(trimmedKeyword) ||
        place.includes(trimmedKeyword) ||
        hashtags.includes(trimmedKeyword)
      );
    });

    result = [...result].sort((a, b) => {
      if (sortType === "latest") {
        return new Date(b.regDt) - new Date(a.regDt);
      }

      if (sortType === "popular") {
        return b.viewCnt + b.wishCnt + b.commentCnt - (a.viewCnt + a.wishCnt + a.commentCnt);
      }

      if (sortType === "view") {
        return b.viewCnt - a.viewCnt;
      }

      if (sortType === "wish") {
        return b.wishCnt - a.wishCnt;
      }

      if (sortType === "comment") {
        return b.commentCnt - a.commentCnt;
      }

      return 0;
    });

    return result;
  }, [keyword, searchType, sortType]);

  // 페이지네이션 계산
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

      {/* 페이지 제목 영역 */}
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

        {/* 글쓰기 버튼 */}
        <Link to="/showcase/life/write" className="w-fit">
          <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:scale-95">
            글쓰기
          </button>
        </Link>
      </section>

      {/* 검색 / 필터 영역 */}
      <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-500"
          >
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
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-emerald-500"
          />

          <select
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-emerald-500"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="view">조회수순</option>
            <option value="wish">찜순</option>
            <option value="comment">댓글순</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span>
            총 <strong className="text-emerald-600">{filteredPosts.length}</strong>개의 게시글
          </span>

          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setSearchType("all");
                setCurrentPage(1);
              }}
              className="font-semibold text-gray-400 hover:text-emerald-600"
            >
              검색 초기화
            </button>
          )}
        </div>
      </section>

      {/* 카드 그리드: 반응형 1 -> 2 -> 3 -> 4열로 최적화 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {currentItems.length > 0 ? (
          currentItems.map((post) => {
            const wished = !!wishlistedPosts[post.id];
            const wishCount = post.wishCnt + (wished ? 1 : 0);

            return (
              <div
                key={post.id}
                onClick={() => navigate(`/showcase/life/view/${post.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 shadow-sm mb-4">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />

                  {/* 리스트의 찜 버튼 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(post.id);
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-75 shadow-lg ${
                      wished
                        ? "bg-white text-red-500"
                        : "bg-black/20 text-white hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill={wished ? "currentColor" : "none"}
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
                  </button>

                  {/* 이미지 위 카테고리 태그 표시 */}
                  <div className="absolute bottom-3 left-3 rounded bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>

                <div className="px-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px]">
                      👤
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-800">
                      {post.author}
                    </h4>
                  </div>

                  <p className="line-clamp-1 text-[14px] font-medium leading-tight text-gray-600 transition-colors group-hover:text-emerald-600">
                    {post.title}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>👁 {post.viewCnt}</span>
                    <span>💬 {post.commentCnt}</span>
                    <span>❤️ {wishCount}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.hashtags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-emerald-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-gray-400 text-lg">
              검색 결과가 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all"
          >
            &lt;
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-110"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityLife;