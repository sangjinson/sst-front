import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";
import CommunitySearchBar from "@components/modules/community/common/CommunitySearchBar";
import api from "@api/axios";
import CommunityHotplaceSkeleton from "@components/skeleton/CommunityHotplaceSkeleton";

const CommunityHotplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x400";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  const [likedPosts, setLikedPosts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [searchType, setSearchType] = useState(searchParams.get("searchType") || "all");
  const [sortType, setSortType] = useState(searchParams.get("sortType") || "latest");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const ITEMS_PER_PAGE = 15;
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPosts = () => {
    api
      .get("/community", {
        params: {
          catCd: "CMM002",
          searchType,
          keyword,
          sortType,
          page: currentPage,
          size: ITEMS_PER_PAGE,
        },
      })
      .then((res) => {
        const mappedData = res.data.list.map((item) => ({
          id: item.commNo,
          title: item.commTitle,
          description: item.commContent,
          author: item.mbrNickname,
          place: item.plcName || "장소 미등록",
          region: item.rgnName || "지역 미정",
          hashtags: item.hashtagText
            ? item.hashtagText.split(",")
            : [],
          img: getImageUrl(item.commMainImgUrl),
          regDt: item.commRegDate,
          wishCnt: item.commLikeCnt,
          commentCnt: item.commCmntCnt,
          viewCnt: item.commInqireCnt,
          size: "wide",
        }));

        setPosts(mappedData);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => {
        console.log("커뮤니티 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 로그인 사용자 조회: 처음 한 번만
  useEffect(() => {

    api
      .get("/auth/me")
      .then((res) => {
        setCurrentUserId(res.data.data.mbrId);
      })
      .catch((err) => {
        console.error("로그인 사용자 조회 실패:", err);
      });
  }, []);

  useEffect(() => {
    const nextParams = {};

    if (currentPage !== 1) nextParams.page = currentPage;
    if (searchType !== "all") nextParams.searchType = searchType;
    if (keyword.trim() !== "") nextParams.keyword = keyword;
    if (sortType !== "latest") nextParams.sortType = sortType;

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, searchType, keyword, sortType, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, searchType, sortType, currentPage]);

  // 페이지 변경 시 맨 위로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // 페이지 이동 시 검색 상태 초기화
  useEffect(() => {
    const nextKeyword = searchParams.get("keyword") || "";
    const nextSearchType = searchParams.get("searchType") || "all";
    const nextSortType = searchParams.get("sortType") || "latest";
    const nextPage = Number(searchParams.get("page")) || 1;

    setKeyword(nextKeyword);
    setSearchType(nextSearchType);
    setSortType(nextSortType);
    setCurrentPage(nextPage);
  }, [searchParams]);

  const toggleLike = (postId) => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    api
      .post(`/community/${postId}/like`, null, {
        params: {
          mbrId: currentUserId,
        },
      })
      .then((res) => {
        const liked = res.data;

        setLikedPosts((prev) => ({
          ...prev,
          [postId]: liked,
        }));

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  wishCnt: liked
                    ? post.wishCnt + 1
                    : Math.max(post.wishCnt - 1, 0),
                }
              : post
          )
        );
      })
      .catch((err) => {
        console.error("좋아요 처리 실패:", err);
      });
  };

  const getImageRatio = (size) => {
    if (size === "wide") return "aspect-[4/3]";
    if (size === "square") return "aspect-square";
    return "aspect-[3/4]";
  };

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const CommentIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 translate-y-[1px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );

  const LikeIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 11v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3z" />
      <path d="M7 11l4.4-7.1A2 2 0 0 1 15 5v4h4a2 2 0 0 1 2 2.3l-1.2 8A2 2 0 0 1 17.8 21H7V11z" />
    </svg>
  );

  if (loading) {
    return <CommunityHotplaceSkeleton />;
  }

  return (
    <div className="paperlogy max-w-[1420px] mx-auto px-4 py-6 md:py-10 mb-20 font-sans">
      <Breadcrumb paths={[{ label: "홈", to: "/" }, { label: "핫플거리", to: "/showcase" }]} className="mb-4" />
      
      {/* 제목 영역 */}
      <section className="mt-8 mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">Hotplace</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                핫플거리
              </h2>
              <Link
                to="/showcase/life"
                className="group mb-1 inline-flex h-8 items-center gap-1.5 rounded-full text-gray-400 transition-all duration-200 hover:text-[#0F9B73]"
                aria-label="인생거리로 전환">
                <span className="inline-flex h-8 w-8 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="fs-down-1 md:text-lg font-bold">
                  인생거리
                </span>
              </Link>
            </div>
            <p className="mt-2 text-sm md:text-base text-gray-500">
              여행자들이 직접 발견한 장소와 분위기를 사진 카드로 모아봤어요.
            </p>
          </div>
        <Link to="/showcase/hotplace/write" className="w-fit">
          <button className="min-w-[120px] text-center cursor-pointer rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md active:scale-95">
            글쓰기
          </button>
        </Link>
      </section>

      <CommunitySearchBar
        keyword={keyword}
        setKeyword={(value) => {
          setKeyword(value);
          setCurrentPage(1);
        }}
        searchType={searchType}
        setSearchType={(value) => {
          setSearchType(value);
          setCurrentPage(1);
        }}
        sortType={sortType}
        setSortType={(value) => {
          setSortType(value);
          setCurrentPage(1);
        }}
        totalCount={totalCount}
        onSearch={fetchPosts}
        onReset={() => {
          setKeyword("");
          setSearchType("all");
          setCurrentPage(1);
        }}
        popularTags={["성수카페", "제주맛집", "부산야경", "혼자여행", "데이트코스"]}
        searchOptions={[
          { value: "all", label: "전체 검색" },
          { value: "title", label: "제목 검색" },
          { value: "content", label: "내용 검색" },
          { value: "author", label: "작성자 검색" },
          { value: "place", label: "장소 검색" },
          { value: "region", label: "지역 검색" },
          { value: "hashtag", label: "해시태그 검색" },
        ]}
      />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {posts.map((post) => {
            const liked = !!likedPosts[post.id];
            const likeCount = post.wishCnt;
            return (
              <article key={post.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                <button type="button" onClick={() => navigate(`/showcase/hotplace/view/${post.id}`)} className="block w-full cursor-pointer text-left">
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
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchType("hashtag");
                          setKeyword(tag);
                          setCurrentPage(1);
                        }}
                        className="fs-down-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700">
                        #{tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3 fs-down-1">
                    <div className="flex items-center gap-4 font-bold text-gray-900">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`inline-flex min-w-[58px] cursor-pointer items-center gap-1.5 transition-colors active:scale-95 ${
                          liked ? "text-blue-500" : "hover:text-blue-500"
                        }`}>
                        <LikeIcon />
                        {likeCount}
                      </button>
                      <span className="inline-flex items-center gap-1.5"><CommentIcon />{post.commentCnt}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-gray-400"><EyeIcon />{post.viewCnt}</span>
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
      {totalPages > 1 && (
        <AreaPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CommunityHotplace;