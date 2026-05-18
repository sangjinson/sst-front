import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "@api/axios";
import Breadcrumb from "@components/common/Breadcrumb";
import CommunityLifeCard from "@components/modules/community/life/CommunityLifeCard";
import Pagination from "@components/common/Pagination";
import CommunitySearchBar from "@components/modules/community/common/CommunitySearchBar";
import CommunityLifeSkeleton from "@components/skeleton/CommunityLifeSkeleton";


const CommunityLife = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [searchType, setSearchType] = useState(searchParams.get("searchType") || "all");
  const [sortType, setSortType] = useState(searchParams.get("sortType") || "latest");
  const [likedPosts, setLikedPosts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });

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
    api
      .get("/community/popular-hashtags", {
        params: {
          catCd: "CMM001",
        },
      })
      .then((res) => {
        setPopularTags(res.data);
      })
      .catch((err) => {
        console.error("인기 해시태그 조회 실패:", err);
      });
  }, []);

  useEffect(() => {
    const nextParams = {};

    if (page !== 1) nextParams.page = page;
    if (searchType !== "all") nextParams.searchType = searchType;
    if (keyword.trim() !== "") nextParams.keyword = keyword;
    if (sortType !== "latest") nextParams.sortType = sortType;

    setSearchParams(nextParams, { replace: true });
  }, [page, searchType, keyword, sortType, setSearchParams]);

  useEffect(() => {
    const nextKeyword = searchParams.get("keyword") || "";
    const nextSearchType = searchParams.get("searchType") || "all";
    const nextSortType = searchParams.get("sortType") || "latest";
    const nextPage = Number(searchParams.get("page")) || 1;

    setKeyword(nextKeyword);
    setSearchType(nextSearchType);
    setSortType(nextSortType);
    setPage(nextPage);
  }, [searchParams]);

  const getImageUrl = (url) => {
    if (!url) return "/images/community/default-life.jpg";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  const fetchPosts = () => {
    setLoading(true);
    api
      .get("/community", {
        params: {
          catCd: "CMM001",
          searchType,
          keyword,
          sortType,
          page,
          size: pageSize,
        },
      })
      .then((res) => {
        console.log(res.data.list);
        const mappedData = res.data.list.map((item) => {
          const imageUrl = getImageUrl(item.commMainImgUrl);

          return {
            id: item.commNo,
            title: item.commTitle,
            description: item.commContent,
            author: item.mbrNickname,
            place: item.plcName || "장소 미정",
            region: item.rgnName || "지역 미정",
            hashtags: item.hashtagText
              ? item.hashtagText.split(",")
              : [],
              themes: [
              item.theme1Name,
              item.theme2Name,
              item.theme3Name,
            ].filter(Boolean),
            thumbnail: imageUrl,
            images: item.commMainImgUrl ? [imageUrl] : [],
            regDt: item.commRegDate,
            viewCnt: item.commInqireCnt,
            wishCnt: item.commLikeCnt,
            commentCnt: item.commCmntCnt,
          };
        });

        setPosts(mappedData);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => {
        console.error("인생거리 목록 조회 실패:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, searchType, sortType, page]);

  // 게시글 목록 좋아요 상태 조회
  useEffect(() => {
    if (!currentUserId || posts.length === 0) return;

    api
      .get("/community/likes", {
        params: {
          commNos: posts.map((post) => post.id),
          mbrId: currentUserId,
        },
      })
      .then((res) => {
        const nextLikedPosts = {};

        res.data.forEach((commNo) => {
          nextLikedPosts[commNo] = true;
        });

        setLikedPosts(nextLikedPosts);
      })
      .catch((err) => {
        console.error("게시글 목록 좋아요 상태 조회 실패:", err);
      });
  }, [currentUserId, posts]);

  //  좋아요 토글 함수 (핵심 추가)
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

  if (loading) {
    return <CommunityLifeSkeleton />;
  }

  return (
    <div className="paperlogy max-w-[1420px] mx-auto px-4 py-6 md:py-10 mb-20 font-sans">
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
        ]}
        className="mb-4"
      />

      {/* 제목 영역 */}
      <section className="mt-8 mb-8 flex flex-col gap-6 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73]">Life Course</p>

          <div className="mt-1 flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                인생거리
              </h2>
              <Link
                to="/showcase/hotplace"
                className="group mb-1 inline-flex h-8 items-center gap-1.5 rounded-full text-gray-400 transition-all duration-200 hover:text-[#0F9B73]"
                aria-label="핫플거리로 전환">
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
                  핫플거리
                </span>
              </Link>
            </div>

          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 직접 만든 인생 여행 코스를 공유해요.
          </p>
        </div>

        <Link to="/showcase/life/write" className="w-fit">
          <button className="min-w-[120px] text-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0F9B73] hover:shadow-md active:scale-95">
            코스 공유하기
          </button>
        </Link>
      </section>

      {/* 검색/필터 */}
      <CommunitySearchBar
        keyword={keyword}
        setKeyword={(value) => {
          setKeyword(value);
          setPage(1);
        }}
        searchType={searchType}
        setSearchType={(value) => {
          setSearchType(value);
          setPage(1);
        }}
        sortType={sortType}
        setSortType={(value) => {
          setSortType(value);
          setPage(1);
        }}
        totalCount={totalCount}
        onSearch={fetchPosts}
        onReset={() => {
          setKeyword("");
          setSearchType("all");
          setPage(1);
        }}
        popularTags={popularTags}
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

      {/* 게시글 목록 */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <CommunityLifeCard
              key={post.id}
              post={post}

              //  좋아요 상태 전달
              liked={!!likedPosts[post.id]}

              //  좋아요 클릭 이벤트 전달
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
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CommunityLife;