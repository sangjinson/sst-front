import React, { useEffect, useState } from "react";
import api from "@api/axios";
import { useParams, useNavigate } from "react-router-dom";
import CommunityDetailHeader from "@components/modules/community/common/CommunityDetailHeader";
import Swal from "sweetalert2";
import CommentSection from "@components/modules/community/common/CommentSection";
import LifeCourseView from "@components/modules/community/life/LifeCourseView";
import LifeAside from "@components/modules/community/life/LifeAside";
import LifePostHeader from "@components/modules/community/life/LifePostHeader";
import { openReportModal } from "@components/modules/community/common/reportModal";
import IconSVG from "@components/Icon/IconSVG";
import ImageSlider from "@components/modules/community/common/ImageSlider";
import LoginRequiredModal from "@components/modules/community/common/LoginRequiredModal";
import CommunityLifeDetailSkeleton from "@components/skeleton/CommunityLifeDetailSkeleton";

import { useApi } from '@hooks/useApi';       // API 사용
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값

const BASE_URL = import.meta.env.VITE_API_URL;

const CommunityLifeDetail = () => {
  const apiTool = useApi(); // Api 의 사용
  const {getConfig} = useConfig();   // Config 값 가져오기
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const isLogin = getConfig('user.isAuth');
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [reportedCommentIds, setReportedCommentIds] = useState([]);

  // 최초 진입 시 맨 위로 스크롤 이동
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // 로그인 사용자 정보 조회
  useEffect(() => {
    // 회원 정보 인증 조회
    let userId = getConfig('user.mbrId')
    if(userId) setCurrentUserId(userId)
  }, []);

  // 인생거리 상세 게시글 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const userId = getConfig("user.mbrId");

        if (userId) {
          setCurrentUserId(userId);
        }

        // 조회수 중복 방지 키
        const viewedKey = userId
          ? `life_viewed_user_${userId}_${id}`
          : `life_viewed_guest_${id}`;

        // 처음 조회 시에만 조회수 증가
        if (!sessionStorage.getItem(viewedKey)) {
          await api.put(`/community/${id}/view`);
          sessionStorage.setItem(viewedKey, "true");
        }
        // 게시글 상세 조회
        const res = await apiTool.getCommunityDetail(id);
        const item = res.data;

        // 여행 코스 목록
        let course = [];

        // AI 일정 기반 코스 조회
        if (item.commAisNo) {
          const placeRes = await api.get(
            `/community/life/schedules/${item.commAisNo}/places`
          );

          // 코스 데이터 매핑
          course = placeRes.data.map((place, index) => ({
            order: index + 1,
            name: place.name || place.plcName || "",
            address: place.address || place.plcAddress || "",
            type: place.type || place.plcType || "see",
            image: place.image || place.plcImgUrl || "",
            desc: place.desc || place.description || "",
            dayNo: place.dayNo,
            placeId: place.plcNo,
          }));
        }

        // 지역 기본 배너 이미지 반환
        const getRegionBannerImage = (regionName) => {
          if (!regionName || regionName === "장소 정보 없음") {
            return "/images/community/default-life.jpg";
          }
          return `/banners/${regionName}.webp`;
        };

        // 대표 이미지 URL 생성
        const imageUrl = item.commMainImgUrl
          ? item.commMainImgUrl.startsWith("http")
            ? item.commMainImgUrl
            : `${import.meta.env.VITE_API_URL}${item.commMainImgUrl}`
          : getRegionBannerImage(item.rgnName || item.plcName);

        // 게시글 데이터 매핑
        const mappedPost = {
          id: item.commNo,
          commNo: item.commNo,
          mbrId: item.commMbrId,
          title: item.commTitle,
          description: item.commContent,
          author: item.mbrNickname,
          mbrProfileImgUrl: item.mbrProfileImgUrl,
          theme1Name: item.theme1Name,
          theme2Name: item.theme2Name,
          theme3Name: item.theme3Name,
          region: item.rgnName || item.plcName || "장소 정보 없음",
          hashtags: item.hashtagText ? item.hashtagText.split(",") : [],
          thumbnail: imageUrl,
          images: item.images || [],
          regDt: item.commRegDate,
          viewCnt: item.commInqireCnt,
          wishCnt: item.commLikeCnt,
          commentCnt: item.commCmntCnt,
          commAisNo: item.commAisNo,
          course,
        };

        setPost(mappedPost);
      } catch (err) {
          console.error("인생거리 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    // 상세 게시글 조회 실행
    fetchPostDetail();
  }, [id]);

  // 댓글 목록 조회 함수
  const fetchComments = (commNo) => {
    api
      .get(`/comments/${commNo}`)
      .then((res) => {
        const mappedComments = res.data.map((comment) => ({
          id: comment.cmntNo,
          user: comment.mbrNickname,
          text: comment.cmntContent,
          date: comment.cmntRegDate?.substring(0, 10),
          mbrProfileImgUrl: comment.mbrProfileImgUrl,
          cmntNo: comment.cmntNo,
          cmntCommNo: comment.cmntCommNo,
          cmntMbrId: comment.cmntMbrId,
        }));
        setComments(mappedComments);
      })
      .catch((err) => {
        console.error("댓글 조회 실패:", err);
      });
  };

  // 게시글 변경 시 댓글 목록 조회
  useEffect(() => {
    if (!post) return;
    const commNo = post.commNo ?? post.id;
    fetchComments(commNo);
  }, [post]);

  // 댓글 신고 여부 조회
  useEffect(() => {
    if (!currentUserId || comments.length === 0) return;

    const fetchReportedComments = async () => {
      try {
        const reportedIds = [];

        for (const comment of comments) {
          const cmntNo = comment.cmntNo ?? comment.id;
          const res = await api.get("/reports/check", {
            params: {
              type: "comment",
              cmntNo,
            },
          });

          if (res.data) {
            reportedIds.push(cmntNo);
          }
        }
        setReportedCommentIds(reportedIds);
      } catch (err) {
        console.error("댓글 신고 상태 조회 실패:", err);
      }
    };

    fetchReportedComments();
  }, [currentUserId, comments]);

  // 게시글 좋아요 상태 조회
  useEffect(() => {
    if (!currentUserId || !post?.commNo) return;
    api
      .get(`/community/${post.commNo}/like`, {
        params: { mbrId: currentUserId },
      })
      .then((res) => {
        setIsLiked(res.data);
      })
      .catch((err) => {
        console.error("좋아요 상태 조회 실패:", err);
      });
  }, [currentUserId, post?.commNo]);

  // 게시글 신고 상태 조회
  useEffect(() => {
    
    if (!currentUserId || !post?.commNo) return;
    api
      .get("/reports/check", {
        params: {
          type: "post",
          commNo: post.commNo ?? post.id,
        },
      })
      .then((res) => {
        setIsReported(res.data);
      })
      .catch((err) => {
        console.error("게시글 신고 상태 조회 실패:", err);
      });
  }, [currentUserId, post?.commNo]);

  if (loading) {
    return <CommunityLifeDetailSkeleton />;
  }

  // 게시글이 존재하지 않을 경우
  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // 대표 이미지 및 게시글 정보 추출
  const thumbnail = post.thumbnail || post.img;
  const region = post.region || post.place || "장소 정보 없음";
  const courseList = post.course || [];
  const viewCount = post.viewCnt || 0;
  const wishCount = post.wishCnt || 0;

  // 댓글 영역으로 스크롤 이동
  const scrollToComments = () => {
    document.getElementById("life-comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 이미지 URL 정규화
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return `${BASE_URL}/${url}`;
  };

  // 이미지 슬라이드 데이터 생성
  const slideImages =
    post.images?.length > 0
      ? post.images.map(normalizeImageUrl).filter(Boolean)
      : [thumbnail || "/images/community/default-life.jpg"];

  // 내 일정으로 가져오기 - DB 저장
  const handleImportSchedule = async () => {
    if (!currentUserId && !isLogin) {
      setShowLoginModal(true);
      return;
    }

    if (!post.commAisNo) {
      Swal.fire({
        icon: "warning",
        title: "AI 일정 정보가 없습니다.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await api.post("/ai/schedule/copy", null, {
        params: { aisNo: post.commAisNo },
      });

      const result = await Swal.fire({
        icon: "success",
        title: "내 일정에 추가되었어요!",
        text: "마이페이지 > 내 일정 관리에서 확인할 수 있어요.",
        confirmButtonText: "내 일정 보러가기",
        showCancelButton: true,
        cancelButtonText: "계속 보기",
        confirmButtonColor: "#0F9B73",
        cancelButtonColor: "#9ca3af",
      });

      if (result.isConfirmed) {
        navigate("/user/mypage", { state: { tab: "schedule" } });
      }
    } catch (err) {
        console.error("일정 복사 실패:", err);
      Swal.fire({ icon: "error", title: "가져오기 실패", text: "다시 시도해주세요." });
    }
  };

  // 이 코스로 일정 만들기
  const handleMakePlan = () => {
    if (courseList.length === 0) {
      Swal.fire({ icon: "warning", title: "코스 정보가 없습니다.", timer: 1000, showConfirmButton: false });
      return;
    }

    const dayMap = {};
    courseList.forEach((c, i) => {
      const dayNo = c.dayNo ?? 1;
      if (!dayMap[dayNo]) dayMap[dayNo] = [];
      dayMap[dayNo].push({
        placeId  : c.placeId,
        placeName: c.name,
        category : c.type ?? "PLC001",
        overview : c.desc ?? "",
        imgUrl   : c.image ?? "",
        lat      : c.lat ? String(c.lat) : null,
        lng      : c.lng ? String(c.lng) : null,
      });
    });

    const schedule = Object.keys(dayMap).sort().map((dayNo, idx) => ({
      day  : idx + 1,
      date : "",
      plans: dayMap[dayNo],
    }));

    sessionStorage.removeItem("currentSchedule");
    sessionStorage.removeItem("scheduleMetaData");
    sessionStorage.setItem("currentSchedule", JSON.stringify(schedule));
    sessionStorage.setItem("scheduleMetaData", JSON.stringify({
      rgnName     : region,
      themes      : post.hashtags?.slice(0, 3) ?? [],
      aisBeginDate: null,
      aisEndDate  : null,
      aisTotDays  : schedule.length,
    }));

    navigate("/plan/result");
  };

  // 댓글 등록
  const handleCommentSubmit = () => {

    if (!currentUserId && !isLogin) {
      setShowLoginModal(true);
      return;
    }

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    const commNo = post.commNo ?? post.id;
    api
      .post("/comments", {
        cmntCommNo: commNo,
        cmntMbrId: currentUserId,
        cmntContent: newComment,
      })
      .then(() => {
        fetchComments(commNo);
        setNewComment("");
      })
      .catch((err) => {
        console.error("댓글 등록 실패:", err);
      });
  };

  // 댓글 수정 시작
  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

  // 댓글 수정 저장
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }
    const commNo = post.commNo ?? post.id;
    api
      .put(`/comments/${commentId}`, {
        cmntContent: editText,
      })
      .then(() => {
        fetchComments(commNo);
        setEditingId(null);
        setEditText("");
      })
      .catch((err) => {
        console.error("댓글 수정 실패:", err);
      });
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    const commNo = post.commNo ?? post.id;
    api
      .delete(`/comments/${commentId}`)
      .then(() => {
        fetchComments(commNo);
      })
      .catch((err) => {
        console.error("댓글 삭제 실패:", err);
      });
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/community/${post.commNo}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/showcase/life");
    } catch (err) {
        console.error("게시글 삭제 실패:", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 게시글 좋아요 처리
  const handleLikeClick = async () => {
    if (!currentUserId && !isLogin) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await api.post(
        `/community/${post.commNo}/like?mbrId=${currentUserId}`
      );
      const liked = res.data;
      setIsLiked(liked);
      setPost((prev) => ({
        ...prev,
        wishCnt: liked
          ? (prev.wishCnt || 0) + 1
          : Math.max((prev.wishCnt || 0) - 1, 0),
      }));
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 게시글 작성자 여부 확인
  const isOwner =
    currentUserId !== null &&
    post.mbrId !== null &&
    Number(currentUserId) === Number(post.mbrId);

  return (
    <div className="paperlogy min-h-screen bg-[#f7f8fa] font-sans">
      <div className="container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20">
        <CommunityDetailHeader
          breadcrumb={[
            { label: "홈", to: "/" },
            { label: "인생거리", to: "/showcase/life" },
            { label: "상세보기" },
          ]}
          label="Life Course Detail"
          title="인생거리"
          description="여행자들이 남긴 인생샷 장소와 순간을 모아봤어요."
          onBack={() => navigate("/showcase/life")}
        />

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="relative">
              <ImageSlider images={slideImages} alt={post.title} height="h-[400px]" />
              <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 fs-down-1 font-semibold text-gray-900 shadow-sm">
                <IconSVG name="location" size={16} className="shrink-0 fill-none stroke-gray-900" strokeWidth={2} />
                {region}
              </span>
            </div>

            <LifePostHeader
              post={post}
              viewCount={viewCount}
              comments={comments}
              wishCount={wishCount}
              isLiked={isLiked}
              handleLikeClick={handleLikeClick}
              onCommentClick={scrollToComments}
            />

            <article className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
              <p className="whitespace-pre-wrap break-all text-left text-base md:text-lg leading-10 text-gray-700">
                {post.description}
              </p>
            </article>

            <LifeCourseView
              courseList={courseList}
              region={region}
              thumbnail={thumbnail}
              navigate={navigate}
              handleImportSchedule={handleImportSchedule}
              handleMakePlan={handleMakePlan}
            />
          </div>

          <LifeAside
            post={post}
            region={region}
            courseList={courseList}
            viewCount={viewCount}
            comments={comments}
            wishCount={wishCount}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            handleLikeClick={handleLikeClick}
            isLogin={isLogin}
            isOwner={isOwner}
            navigate={navigate}
            handleImportSchedule={handleImportSchedule}
            handleMakePlan={handleMakePlan}
            handleDeletePost={handleDeletePost}
            openReportModal={async () => {
              const result = await openReportModal({
                type: "post",
                commNo: post.commNo ?? post.id,
              });
              if (result) {
                setIsReported(true);
              }
              if (result?.blinded) {
                navigate("/showcase/life");
              }
            }}
            onCommentClick={scrollToComments}
            isReported={isReported}
          />
        </section>

        <div id="life-comments" className="scroll-mt-24">
          <CommentSection
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
            editingId={editingId}
            setEditingId={setEditingId}
            editText={editText}
            setEditText={setEditText}
            startEditing={startEditing}
            handleSaveEdit={handleSaveEdit}
            handleDeleteComment={handleDeleteComment}
            openReportModal={async (comment) => {
              const result = await openReportModal({
                type: "comment",
                cmntNo: comment.cmntNo ?? comment.id,
              });

              if (result) {
                setReportedCommentIds((prev) => [
                  ...prev,
                  comment.cmntNo ?? comment.id,
                ]);
              }

              return result;
            }}
            openLoginModal={() => setShowLoginModal(true)}
            currentUserId={currentUserId}
            postAuthor={post.author}
            reportedCommentIds={reportedCommentIds}
            setReportedCommentIds={setReportedCommentIds}
          />
        </div>
        {showLoginModal && (
          <LoginRequiredModal
            onClose={() => setShowLoginModal(false)}
            onLogin={() => {
              setShowLoginModal(false);
              navigate("/login");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityLifeDetail;