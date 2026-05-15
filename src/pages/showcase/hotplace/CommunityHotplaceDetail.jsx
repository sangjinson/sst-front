import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "@api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";

import { openReportModal } from "@components/modules/community/common/reportModal";
import HotplaceImageSlider from "@components/modules/community/hotplace/HotplaceImageSlider";
import HotplaceStats from "@components/modules/community/hotplace/HotplaceStats";
import HotplaceAside from "@components/modules/community/hotplace/HotplaceAside";
import CommentSection from "@components/modules/community/common/CommentSection";

const CommunityHotplaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const isLogin = !!currentUserId;
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {

  window.scrollTo({ top: 0 });

  // 로그인 사용자 조회
  api
    .get("/auth/me")
    .then((res) => {
      setCurrentUserId(res.data.data.mbrId);
    })
    .catch((err) => {
      console.error("로그인 사용자 조회 실패:", err);
    });

  // 게시글 조회 함수
  const fetchPost = async () => {
      try {
        const viewedKey = `hotplace_viewed_${id}`;
        // 처음 조회 시에만 조회수 증가
        if (!localStorage.getItem(viewedKey)) {
          localStorage.setItem(viewedKey, "true");
          await api.put(`/community/${id}/view`);
        }
        // 게시글 상세 조회
        const res = await api.get(`/community/${id}`);
        const item = res.data;

        console.log(item);

        const imageUrl = item.commMainImgUrl
          ? item.commMainImgUrl.startsWith("http")
            ? item.commMainImgUrl
            : `http://localhost:8080${item.commMainImgUrl}`
          : "https://placehold.co/900x650";

        setCurrentPost({
          id: item.commNo,
          commNo: item.commNo,
          mbrId: item.commMbrId, // 작성자 회원번호 추가
          title: item.commTitle,
          description: item.commContent,
          content: item.commContent,
          author: item.mbrNickname,
          place: item.plcName || "장소 미등록",
          region: item.rgnName || "지역 미정",
          hashtags: item.hashtagText ? item.hashtagText.split(",") : [],
          img: imageUrl,
          images:
            item.images?.length > 0
              ? item.images.map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080${img}`
                )
              : [imageUrl],
          regDt: item.commRegDate,
          wishCnt: item.commLikeCnt ?? 0,
          commentCnt: item.commCmntCnt ?? 0,
          viewCnt: item.commInqireCnt ?? 0,
          size: "wide",
        });
      } catch (err) {
        console.error("게시글 상세 조회 실패:", err);
      }
    };
    fetchPost();
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
    if (!currentPost) return;
    const commNo = currentPost.commNo ?? currentPost.id;
    fetchComments(commNo);
  }, [currentPost]);

  if (!currentPost) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  const slideImages = currentPost.images || [
    currentPost.img,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub1/900/650`,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub2/900/650`,
  ];

  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? slideImages.length - 1 : prev - 1
    );

  const handleNextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === slideImages.length - 1 ? 0 : prev + 1
    );

  const viewCount = currentPost.viewCnt;
  const wishCount = currentPost.wishCnt;

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

    const commNo = currentPost.commNo ?? currentPost.id;

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

  const startEditing = (commentId, text) => {
    setEditingId(commentId);
    setEditText(text);
  };

  // 댓글 수정
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    const commNo = currentPost.commNo ?? currentPost.id;

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
    const commNo = currentPost.commNo ?? currentPost.id;
    axios
      .delete(`http://localhost:8080/api/comments/${commentId}`)
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
      await api.delete(`/community/${id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/showcase/hotplace");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
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
        `/community/${currentPost.commNo}/like?mbrId=${currentUserId}`
      );
      const liked = res.data;
      setIsLiked(liked);

      setCurrentPost((prev) => ({
        ...prev,
        wishCnt: liked ? prev.wishCnt + 1 : Math.max(prev.wishCnt - 1, 0),
      }));
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const isOwner =
  currentUserId !== null &&
  currentPost.mbrId !== null &&
  Number(currentUserId) === Number(currentPost.mbrId);

  return (
    <div className="paperlogy max-w-[1420px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "핫플거리", to: "/showcase/hotplace" },
          { label: "상세보기" },
        ]}
        className="mb-4"
      />

      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600 pt-2">
            Hotplace Detail
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
            핫플거리
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            여행자가 남긴 장소의 분위기와 이야기를 자세히 확인해보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/showcase/hotplace")}
          className="w-fit rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-sm active:scale-95">
          목록으로
        </button>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:items-stretch">
        <div className="space-y-6">
          <HotplaceImageSlider
            slideImages={slideImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            currentPost={currentPost}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
          />

          <HotplaceStats
            currentPost={currentPost}
            viewCount={viewCount}
            comments={comments}
            wishCount={wishCount}
            isLogin={isLogin}
            isOwner={isOwner}
            navigate={navigate}
            handleDeletePost={handleDeletePost}
          />
        </div>

        <HotplaceAside
          currentPost={currentPost}
          isLogin={isLogin}
          isOwner={isOwner}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          wishCount={wishCount}
          handleLikeClick={handleLikeClick}
          openReportModal={async () => {

          const result = await openReportModal({
            type: "post",
            commNo: currentPost.commNo ?? currentPost.id,
          });

          if (result?.blinded) {
            navigate("/showcase/hotplace");
          }
        }}
        />
      </section>

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
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default CommunityHotplaceDetail;