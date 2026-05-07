import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { getAllPosts, hotplaceComments } from "./communityHotplaceData";

// 신고 모달
import { openReportModal } from "@components/modules/community/common/reportModal";
// 이미지 슬라이더
import HotplaceImageSlider from "@components/modules/community/hotplace/HotplaceImageSlider";
// Stats 컴포넌트
import HotplaceStats from "@components/modules/community/hotplace/HotplaceStats";
// 오른쪽 Aside 컴포넌트
import HotplaceAside from "@components/modules/community/hotplace/HotplaceAside";
// 댓글 컴포넌트
import CommentSection from "@components/modules/community/common/CommentSection";

const CommunityHotplaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLogin = true;

  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(hotplaceComments);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const posts = getAllPosts();
  const currentPost = posts.find((post) => post.id === Number(id));

  if (!currentPost) {
    return <div className="py-20 text-center font-bold text-gray-500">존재하지 않는 게시물입니다.</div>;
  }

  const slideImages = currentPost.images || [
    currentPost.img,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub1/900/650`,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub2/900/650`,
  ];

  const handlePrevImage = () => setCurrentImageIndex((prev) => prev === 0 ? slideImages.length - 1 : prev - 1);
  const handleNextImage = () => setCurrentImageIndex((prev) => prev === slideImages.length - 1 ? 0 : prev + 1);

  const viewCount = currentPost.viewCnt + 1;
  const wishCount = currentPost.wishCnt + (isLiked ? 1 : 0);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) { alert("댓글 내용을 입력해주세요."); return; }
    setComments([{ id: Date.now(), user: "나", text: newComment, date: new Date().toLocaleDateString() }, ...comments]);
    setNewComment("");
  };

  const startEditing = (commentId, text) => { setEditingId(commentId); setEditText(text); };

  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) { alert("수정할 내용을 입력해주세요."); return; }
    setComments(comments.map((c) => c.id === commentId ? { ...c, text: editText } : c));
    setEditingId(null); setEditText("");
  };

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
          { label: "핫플거리", to: "/showcase/hotplace" },
          { label: "상세보기" },
        ]}
        className="mb-4"
      />

      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-emerald-600 pt-2">Hotplace Detail</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">핫플거리</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">여행자가 남긴 장소의 분위기와 이야기를 자세히 확인해보세요.</p>
        </div>
        <button type="button" onClick={() => navigate("/showcase/hotplace")}
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
            navigate={navigate}
          />
        </div>

        <HotplaceAside
          currentPost={currentPost}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          wishCount={wishCount}
          openReportModal={openReportModal}
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
        openReportModal={openReportModal}
      />
    </div>
  );
};

export default CommunityHotplaceDetail;