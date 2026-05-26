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

const BASE_URL = import.meta.env.VITE_API_URL;

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const isLogin = !!currentUserId;
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
    const fetchPostDetail = async () => {
      try {
        const viewedKey = `life_viewed_${id}`;

        if (!localStorage.getItem(viewedKey)) {
          localStorage.setItem(viewedKey, "true");
          await api.put(`/community/${id}/view`);
        }

        const res = await api.get(`/community/${id}`);
        const item = res.data;

        let course = [];

        if (item.commAisNo) {
          const placeRes = await api.get(
            `/community/life/schedules/${item.commAisNo}/places`
          );

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

        const getRegionBannerImage = (regionName) => {
          if (!regionName || regionName === "장소 정보 없음") {
            return "/images/community/default-life.jpg";
          }

          return `/banners/${regionName}.webp`;
        };

        const imageUrl = item.commMainImgUrl
          ? item.commMainImgUrl.startsWith("http")
            ? item.commMainImgUrl
            : `${import.meta.env.VITE_API_URL}${item.commMainImgUrl}`
          : getRegionBannerImage(item.rgnName || item.plcName);

        const mappedPost = {
          id: item.commNo,
          commNo: item.commNo,
          mbrId: item.commMbrId,
          title: item.commTitle,
          description: item.commContent,
          author: item.mbrNickname,
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

    fetchPostDetail();
  }, [id]);

  const fetchComments = (commNo) => {
    api
      .get(`/comments/${commNo}`)
      .then((res) => {
        const mappedComments = res.data.map((comment) => ({
          id: comment.cmntNo,
          user: comment.mbrNickname,
          text: comment.cmntContent,
          date: comment.cmntRegDate?.substring(0, 10),
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

  useEffect(() => {
    if (!post) return;
    const commNo = post.commNo ?? post.id;
    fetchComments(commNo);
  }, [post]);

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

  if (loading) {
    return <CommunityLifeDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  const thumbnail = post.thumbnail || post.img;
  const region = post.region || post.place || "장소 정보 없음";
  const courseList = post.course || [];
  const viewCount = post.viewCnt || 0;
  const wishCount = post.wishCnt || 0;

  const scrollToComments = () => {
    document.getElementById("life-comments")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return `${BASE_URL}/${url}`;
  };

  const slideImages =
    post.images?.length > 0
      ? post.images.map(normalizeImageUrl).filter(Boolean)
      : [thumbnail || "/images/community/default-life.jpg"];

  // ✅ 내 일정으로 가져오기 - DB 저장
  const handleImportSchedule = async () => {
    if (!isLogin) {
      navigate("/login");
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

  const handleCommentSubmit = () => {
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

  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

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

  const handleLikeClick = async () => {
    if (!currentUserId) {
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

  const isOwner =
    currentUserId !== null &&
    post.mbrId !== null &&
    Number(currentUserId) === Number(post.mbrId);

  return (
    <div className="paperlogy container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20 font-sans">
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
            <p className="whitespace-pre-wrap text-base md:text-lg leading-9 text-gray-700">
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
            if (result?.blinded) {
              navigate("/showcase/life");
            }
          }}
          onCommentClick={scrollToComments}
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
          openReportModal={(comment) =>
            openReportModal({
              type: "comment",
              cmntNo: comment.cmntNo ?? comment.id,
            })
          }
          openLoginModal={() => setShowLoginModal(true)}
          currentUserId={currentUserId}
          postAuthor={post.author}
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
  );
};

export default CommunityLifeDetail;