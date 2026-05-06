import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import {
  getAllLifePosts,
  lifeComments,
} from "./communityLifeData";
import Swal from "sweetalert2";
import CommentSection from "@components/modules/community/common/CommentSection";
import LifeCourseView from "@components/modules/community/life/LifeCourseView";
import LifeAside from "@components/modules/community/life/LifeAside";
import LifePostHeader from "@components/modules/community/life/LifePostHeader";
import { openReportModal } from "@components/modules/community/common/reportModal";

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLogin = true;

  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(lifeComments || []);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // ✅ 게시글 찾기
  const posts = getAllLifePosts ? getAllLifePosts() : [];
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // ✅ 데이터 안전 처리
  const thumbnail = post.thumbnail || post.img;
  const region = post.region || post.place || "장소 정보 없음";
  const courseList = post.course || [];
  const viewCount = (post.viewCnt || 0) + 1;
  const wishCount = (post.wishCnt || 0) + (isLiked ? 1 : 0);

  // ✅ 내 일정으로 가져오기
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

  // ✅ 이 코스로 일정 만들기
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


  // ✅ 댓글 등록
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setComments([
      {
        id: Date.now(),
        user: "나",
        text: newComment,
        date: new Date().toLocaleDateString(),
      },
      ...comments,
    ]);
    setNewComment("");
  };

  // ✅ 댓글 수정 시작
  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

  // ✅ 댓글 수정 저장
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, text: editText } : c
      )
    );
    setEditingId(null);
    setEditText("");
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
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
          <div className="w-full h-[400px] rounded-3xl overflow-hidden bg-gray-100">
            <img
              src={thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 제목 + 메타 */}
          <LifePostHeader
            post={post}
            region={region}
            viewCount={viewCount}
            comments={comments}
            wishCount={wishCount}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
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
          isLogin={isLogin}
          navigate={navigate}
          handleImportSchedule={handleImportSchedule}
          handleMakePlan={handleMakePlan}
          openReportModal={openReportModal}
        />
      </section>

      {/* 댓글 영역 */}
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
          openReportModal={openReportModal}          // 신고
        />
    </div>
  );
};

export default CommunityLifeDetail;