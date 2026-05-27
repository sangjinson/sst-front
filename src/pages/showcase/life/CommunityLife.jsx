import React, { useEffect, useState } from "react";
import {useNavigate, useSearchParams } from "react-router-dom";
import api from "@api/axios";
import CommunityLifeCard from "@components/modules/community/life/CommunityLifeCard";
import AreaPagination from "@components/modules/area/arealist/AreaPagination";
import CommunitySearchBar from "@components/modules/community/common/CommunitySearchBar";
import CommunityLifeSkeleton from "@components/skeleton/CommunityLifeSkeleton";
import CommunityListHeader from "@components/modules/community/common/CommunityListHeader";
import SchedulePickerModal from "@components/modules/community/life/SchedulePickerModal";
import LoginRequiredModal from "@components/modules/community/common/LoginRequiredModal";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 처음 진입 시 로그인 사용자 조회
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

  // AOS 스크롤 애니메이션
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refreshHard();
    }
  }, [loading, posts]);

  // 내 AI 일정 목록 조회
  useEffect(() => {
    if (!currentUserId) return;

    api
      .get("/community/life/schedules", {
        params: {
          mbrId: currentUserId,
        },
      })
      .then((res) => {
        setSchedules(res.data);
      })
      .catch((err) => {
        console.error("내 AI 일정 목록 조회 실패:", err);
      });
  }, [currentUserId]);

  // 페이지 변경 시 맨 위로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

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

  const getRegionBannerImage = (regionName) => {
    if (!regionName || regionName === "지역 미정") {
      return "/images/community/default-life.jpg";
    }

    return `/banners/${regionName}.webp`;
  };

  const getImageUrl = (url, regionName) => {
    // 업로드 이미지가 있는 경우
    if (url) {
      if (url.startsWith("http")) return url;
      return `${import.meta.env.VITE_API_URL}${url}`;
    }

    // 업로드 이미지가 없으면 지역 배너 사용
    return getRegionBannerImage(regionName);
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
        const mappedData = res.data.list.map((item) => {
          const imageUrl = getImageUrl(
            item.commMainImgUrl,
            item.rgnName || "지역 미정"
          );

          return {
            id: item.commNo,
            title: item.commTitle,
            description: item.commContent,
            author: item.mbrNickname,
            mbrProfileImgUrl: item.mbrProfileImgUrl,
            place: item.plcName || "장소 미정",
            region: item.rgnName || "지역 미정",
            hashtags: (item.hashtagText || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
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
    }, 200);

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
    return <CommunityLifeSkeleton />;
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
    {showModal && (
      <SchedulePickerModal
        schedules={schedules}
        onClose={() => setShowModal(false)}
        onSelect={(places, schedule) => {
          navigate("/showcase/life/write", {
            state: {
              selectedPlaces: places,
              selectedSchedule: schedule,
            },
          });
        }}
      />
    )}
    <div className="paperlogy container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20 font-sans">
      <CommunityListHeader
        breadcrumb={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
        ]}
        label="Life Course"
        title="인생거리"
        description="여행자들이 직접 만든 인생 여행 코스를 공유해요."
        switchTo={{ label: "핫플거리", to: "/showcase/hotplace" }}
        writeText="내거리 공유하기"
        onWriteClick={() => {
          if (!currentUserId) {
            setShowLoginModal(true);
            return;
          }

          setShowModal(true);
        }}
      />

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
          setSortType("latest");
          setPage(1);
        }}
        popularTags={popularTags}
      />

      {/* 게시글 목록 */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <div key={post.id} data-aos="fade-up" data-aos-once="true">
            <CommunityLifeCard
              post={post}

              //  좋아요 상태 전달
              liked={!!likedPosts[post.id]}

              //  좋아요 클릭 이벤트 전달
              onToggleLike={toggleLike}

              // 카드 클릭
              onClick={() =>
                navigate(`/showcase/life/view/${post.id}`)
              }/>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
      <AreaPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      </div>
    </>
  );
};

export default CommunityLife;