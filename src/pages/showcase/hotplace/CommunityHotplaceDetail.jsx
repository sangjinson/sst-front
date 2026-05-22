import React, { useEffect, useState } from "react";
import api from "@api/axios";
import { useParams, useNavigate } from "react-router-dom";
import CommunityDetailHeader from "@components/modules/community/common/CommunityDetailHeader";
import { openReportModal } from "@components/modules/community/common/reportModal";
import ImageSlider from "@components/modules/community/common/ImageSlider";
import HotplaceStats from "@components/modules/community/hotplace/HotplaceStats";
import HotplaceAside from "@components/modules/community/hotplace/HotplaceAside";
import CommentSection from "@components/modules/community/common/CommentSection";
import LoginRequiredModal from "@components/modules/community/common/LoginRequiredModal";
import CommunityHotplaceDetailSkeleton from "@components/skeleton/CommunityHotplaceDetailSkeleton";

const CommunityHotplaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const isLogin = !!currentUserId;
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);

      const viewedKey = `hotplace_viewed_${id}`;

      // 처음 조회 시에만 조회수 증가
      if (!localStorage.getItem(viewedKey)) {
        localStorage.setItem(viewedKey, "true");
        await api.put(`/community/${id}/view`);
      }

      // 게시글 상세 조회
      const res = await api.get(`/community/${id}`);
      const item = res.data;

      const imageUrl = item.commMainImgUrl
        ? item.commMainImgUrl.startsWith("http")
          ? item.commMainImgUrl
          : `${import.meta.env.VITE_API_URL}${item.commMainImgUrl}`
        : "https://placehold.co/900x650";

      setCurrentPost({
        id: item.commNo,
        commNo: item.commNo,
        mbrId: item.commMbrId,
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
                  : `${import.meta.env.VITE_API_URL}${img}`
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
    } finally {
      setLoading(false);
    }
  };
  fetchPost();
  }, [id]);

  // 게시글 좋아요 상태 조회
  useEffect(() => {
    if (!currentUserId || !currentPost?.commNo) return;

    api
      .get(`/community/${currentPost.commNo}/like`, {
        params: {
          mbrId: currentUserId,
        },
      })
      .then((res) => {
        setIsLiked(res.data);
      })
      .catch((err) => {
        console.error("좋아요 상태 조회 실패:", err);
      });
  }, [currentUserId, currentPost]);

  // 댓글 조회 함수
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
    if (!currentPost) return;
    const commNo = currentPost.commNo ?? currentPost.id;
    fetchComments(commNo);
  }, [currentPost]);

  if (loading) {
    return <CommunityHotplaceDetailSkeleton />;
  }

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

  const viewCount = currentPost.viewCnt;
  const wishCount = currentPost.wishCnt;

  // 댓글 등록
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const commNo = currentPost.commNo ?? currentPost.id;

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

  // 댓글 수정
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    const commNo = currentPost.commNo ?? currentPost.id;

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
    const commNo = currentPost.commNo ?? currentPost.id;
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
      setShowLoginModal(true);
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
    <div className="paperlogy container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20 font-sans">
      <CommunityDetailHeader
        breadcrumb={[
          { label: "홈", to: "/" },
          { label: "핫플거리", to: "/showcase/hotplace" },
          { label: "상세보기" },
        ]}
        label="Hotplace Detail"
        title="핫플거리"
        description="여행자가 남긴 장소의 분위기와 이야기를 자세히 확인해보세요."
        onBack={() => navigate("/showcase/hotplace")}
      />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:items-stretch">
        <div className="space-y-6">
          <ImageSlider
            images={slideImages}
            alt={currentPost.title}
            label={currentPost.place}
            height="h-[400px]"
          />

          <HotplaceStats
            currentPost={currentPost}
            viewCount={viewCount}
            comments={comments}
            wishCount={wishCount}
            isLogin={isLogin}
            isOwner={isOwner}
            handleLikeClick={handleLikeClick}
            navigate={navigate}
            handleDeletePost={handleDeletePost}
          />
        </div>

        <HotplaceAside
          currentPost={currentPost}
          isLogin={isLogin}
          isOwner={isOwner}
          isLiked={isLiked}
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
        openLoginModal={() => setShowLoginModal(true)}
        currentUserId={currentUserId}
      />
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

export default CommunityHotplaceDetail;