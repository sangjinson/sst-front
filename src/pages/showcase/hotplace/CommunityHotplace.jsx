import React, { useEffect, useState } from "react";
import {useNavigate, useSearchParams } from "react-router-dom";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";
import CommunitySearchBar from "@components/modules/community/common/CommunitySearchBar";
import api from "@api/axios";
import CommunityHotplaceSkeleton from "@components/skeleton/CommunityHotplaceSkeleton";
import CommunityListHeader from "@components/modules/community/common/CommunityListHeader";
import CommunityHotplaceCard from "@components/modules/community/hotplace/CommunityHotplaceCard";
import LoginRequiredModal from "@components/modules/community/common/LoginRequiredModal";
import AOS from "aos";
import "aos/dist/aos.css";

const CommunityHotplace = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/600x400";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
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
  const [popularTags, setPopularTags] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
          mbrProfileImgUrl: item.mbrProfileImgUrl,
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

  // 인기 해시태그 API 호출
  useEffect(() => {
    api
      .get("/community/popular-hashtags", {
        params: {
          catCd: "CMM002",
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

    if (currentPage !== 1) nextParams.page = currentPage;
    if (searchType !== "all") nextParams.searchType = searchType;
    if (keyword.trim() !== "") nextParams.keyword = keyword;
    if (sortType !== "latest") nextParams.sortType = sortType;

    setSearchParams(nextParams, { replace: true });
  }, [currentPage, searchType, keyword, sortType, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 200);

    return () => clearTimeout(timer);
  }, [keyword, searchType, sortType, currentPage]);

  // AOS 스크롤 애니메이션
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refreshHard();
    }
  }, [loading, posts]);

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
      setShowLoginModal(true);
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
    return <CommunityHotplaceSkeleton />;
  }

  return (
    <>
      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
        />
      )}
    <div className="paperlogy container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20 font-sans">
      <CommunityListHeader
        breadcrumb={[
          { label: "홈", to: "/" },
          { label: "핫플거리", to: "/showcase" },
        ]}
        label="Hotplace"
        title="핫플거리"
        description="여행자들이 직접 발견한 장소와 분위기를 사진 카드로 모아봤어요."
        switchTo={{ label: "인생거리", to: "/showcase/life" }}
        writeText="글쓰기"
        onWriteClick={() => {
          if (!currentUserId) {
            setShowLoginModal(true);
            return;
          }

          navigate("/showcase/hotplace/write");
        }}
      />

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
          setSortType("latest");
          setCurrentPage(1);
        }}
        popularTags={popularTags}
      />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {posts.map((post) => (
            <div key={post.id} data-aos="fade-up" data-aos-once="true">
            <CommunityHotplaceCard
              post={post}
              liked={!!likedPosts[post.id]}
              onClick={() => navigate(`/showcase/hotplace/view/${post.id}`)}
              onToggleLike={() => toggleLike(post.id)}
              onTagClick={(tag) => {
                setSearchType("hashtag");
                setKeyword(tag);
                setCurrentPage(1);
              }}/>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
      <AreaPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
     </div>
    </>
  );
};

export default CommunityHotplace;