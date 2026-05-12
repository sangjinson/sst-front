import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "@api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import Swal from "sweetalert2";
import CommentSection from "@components/modules/community/common/CommentSection";
import LifeCourseView from "@components/modules/community/life/LifeCourseView";
import LifeAside from "@components/modules/community/life/LifeAside";
import LifePostHeader from "@components/modules/community/life/LifePostHeader";
import { openReportModal } from "@components/modules/community/common/reportModal";
import IconSVG from "@components/Icon/IconSVG";

// 공통 이미지 슬라이더 컴포넌트 import
import ImageSlider from "@components/modules/community/common/ImageSlider";

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLogin = true;

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
        // 조회수 증가
        await api.put(`/community/${id}/view`);

        // 상세 조회
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
          }));
        }

        const imageUrl = item.commMainImgUrl
          ? item.commMainImgUrl.startsWith("http")
            ? item.commMainImgUrl
            : `http://localhost:8080${item.commMainImgUrl}`
          : "https://placehold.co/800x400";

        const mappedPost = {
          id: item.commNo,
          commNo: item.commNo,
          title: item.commTitle,
          description: item.commContent,
          author: item.mbrNickname,
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

  // 댓글 조회 함수
  const fetchComments = (commNo) => {
    axios
      .get(`http://localhost:8080/api/comments/${commNo}`)
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

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        게시글을 불러오는 중입니다.
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // 데이터 안전 처리
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

    if (url.startsWith("http")) {
      return url;
    }

    if (url.startsWith("/uploads")) {
      return `http://localhost:8080${url}`;
    }

    if (url.startsWith("uploads")) {
      return `http://localhost:8080/${url}`;
    }

    return `http://localhost:8080/uploads/${url}`;
  };

  const slideImages =
    post.images?.length > 0
      ? post.images.map(normalizeImageUrl).filter(Boolean)
      : [thumbnail];

  const handleImportSchedule = () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    const savedTrips = JSON.parse(localStorage.getItem("savedTrips") || "[]");

    const scheduleItems = courseList.map((c, i) => ({
      id: `life-${post.id}-${c.order || i + 1}`,
      time: `${9 + i * 2}:00`,
      name: c.name,
      desc: c.desc,
      image: c.image,
      type: c.type,
      region,
    }));

    const newTrip = {
      id: Date.now(),
      name: post.title,
      region,
      period: courseList.some((c) => c.type === "sleep")
        ? "1박2일"
        : "당일여행",
      startDate: "",
      endDate: "",
      themes: post.hashtags?.slice(0, 2) || [],
      schedule: [scheduleItems],
      createdAt: new Date().toISOString(),
      fromLife: true,
    };

    savedTrips.push(newTrip);
    localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

    Swal.fire({
      icon: "success",
      title: "내 일정에 추가되었어요!",
      text: "마이페이지 > 내 일정 관리에서 확인할 수 있어요.",
      confirmButtonText: "내 일정 보러가기",
      showCancelButton: true,
      cancelButtonText: "계속 보기",
      confirmButtonColor: "#0F9B73",
      cancelButtonColor: "#9ca3af",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/user/mypage", { state: { tab: "schedule" } });
      }
    });
  };

  // 이 코스로 일정 만들기
  const handleMakePlan = () => {
    const scheduleItems = courseList.map((c, i) => ({
      id: `life-${post.id}-${c.order || i + 1}`,
      time: `${9 + i * 2}:00`,
      name: c.name,
      desc: c.desc,
      image: c.image,
      type: c.type,
      region,
    }));

    navigate("/plan/result", {
      state: {
        region,
        period: courseList.some((c) => c.type === "sleep")
          ? "1박2일"
          : "당일여행",
        themes: post.hashtags?.slice(0, 2) || [],
        startDate: "",
        endDate: "",
        schedule: [scheduleItems],
      },
    });
  };

  // 댓글 등록
  const handleCommentSubmit = () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const commNo = post.commNo ?? post.id;

    axios
      .post("http://localhost:8080/api/comments", {
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

    axios
      .put(`http://localhost:8080/api/comments/${commentId}`, {
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

    axios
      .delete(`http://localhost:8080/api/comments/${commentId}`)
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

  // 좋아요 처리
  const handleLikeClick = async () => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
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

  return (
    <div className="paperlogy max-w-[1420px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
          { label: "상세보기" },
        ]}
        className="mb-4"
      />

      {/* 헤더 */}
      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73] pt-2">
            Life Course Detail
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            인생거리
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자들이 남긴 인생샷 장소와 순간을 모아봤어요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/showcase/life")}
          className="w-fit rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-[#0F9B73] hover:text-[#0F9B73] hover:shadow-sm active:scale-95">
          목록으로
        </button>
      </section>

      {/* 메인 */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* 왼쪽 본문 */}
        <div className="space-y-6">
          {/* 대표 이미지 */}
          <div className="relative">
            <ImageSlider
              images={slideImages}
              alt={post.title}
              height="h-[400px]"
            />
            <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 fs-down-1 font-semibold text-gray-900 shadow-sm">
              <IconSVG name="location" size={16} className="shrink-0 fill-none stroke-gray-900" strokeWidth={2} />
              {region}
            </span>
          </div>

          {/* 제목 + 메타 */}
          <LifePostHeader
            post={post}
            viewCount={viewCount}
            comments={comments}
            wishCount={wishCount}
            isLiked={isLiked}
            handleLikeClick={handleLikeClick}
            onCommentClick={scrollToComments}
          />

          {/* 본문 */}
          <article className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
            <p className="whitespace-pre-wrap text-base md:text-lg leading-9 text-gray-700">
              {post.description}
            </p>
          </article>

          {/* 여행 코스 */}
          <LifeCourseView
            courseList={courseList}
            region={region}
            thumbnail={thumbnail}
            navigate={navigate}
            handleImportSchedule={handleImportSchedule}
            handleMakePlan={handleMakePlan}
          />
        </div>

        {/* 오른쪽 사이드 정보 */}
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
          navigate={navigate}
          handleImportSchedule={handleImportSchedule}
          handleMakePlan={handleMakePlan}
          handleDeletePost={handleDeletePost}
          openReportModal={() =>
            openReportModal({
              type: "post",
              commNo: post.commNo ?? post.id,
            })
          }
          onCommentClick={scrollToComments}
        />
      </section>
      {/* 댓글 영역 */}
      <div id="life-comments" className="scroll-mt-24">

        <CommentSection
          comments={comments}                        // 댓글 목록
          newComment={newComment}                    // 입력값
          setNewComment={setNewComment}              // 입력 변경
          handleCommentSubmit={handleCommentSubmit}  // 등록
          editingId={editingId}                      // 수정중 id
          setEditingId={setEditingId}                // 수정 상태 변경
          editText={editText}                        // 수정 내용
          setEditText={setEditText}                  // 수정 입력
          startEditing={startEditing}                // 수정 시작
          handleSaveEdit={handleSaveEdit}            // 수정 저장
          handleDeleteComment={handleDeleteComment}  // 삭제
          openReportModal={(comment) =>
            openReportModal({
              type: "comment",
              cmntNo: comment.cmntNo ?? comment.id,
            })
          }        // 신고
          currentUserId={currentUserId}              // 현재 로그인 사용자
          postAuthor={post.author}                   // 게시글 작성자
        />
      </div>
    </div>
  );
};

export default CommunityLifeDetail;