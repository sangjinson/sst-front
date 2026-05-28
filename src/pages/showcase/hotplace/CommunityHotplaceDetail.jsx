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

import { useApi } from '@hooks/useApi';       // API 사용
import { useConfig } from '@hooks/useConfig'; // 사이트 전반의 설정 값


const CommunityHotplaceDetail = () => {
  const apiTool = useApi(); // Api 의 사용
  const {getConfig} = useConfig();   // Config 값 가져오기
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const isLogin = getConfig('user.isAuth');
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReported, setIsReported] = useState(false);
  const [reportedCommentIds, setReportedCommentIds] = useState([]);

  // 최초 진입 시 스크롤 이동 및 로그인 사용자 조회
  useEffect(() => {
    window.scrollTo({ top: 0 });
    // 회원 정보 인증 조회
    let userId = getConfig('user.mbrId')
    if(userId) setCurrentUserId(userId)

  // 게시글 조회 함수
  const fetchPost = async () => {
    try {
      setLoading(true);

      const userId = getConfig("user.mbrId");

    if (userId) {
      setCurrentUserId(userId);
    }

    const viewedKey = userId
      ? `hotplace_viewed_user_${userId}_${id}`
      : `hotplace_viewed_guest_${id}`;

    // 처음 조회 시에만 조회수 증가
    if (!sessionStorage.getItem(viewedKey)) {
      await api.put(`/community/${id}/view`);
      sessionStorage.setItem(viewedKey, "true");
    }

      // 게시글 상세 조회
      const res = await apiTool.getCommunityDetail(id);
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
        mbrProfileImgUrl: item.mbrProfileImgUrl,
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

  // 게시글 신고 상태 조회
  useEffect(() => {
    if (!currentUserId || !currentPost?.commNo) return;

    api
      .get("/reports/check", {
        params: {
          type: "post",
          commNo: currentPost.commNo ?? currentPost.id,
        },
      })
      .then((res) => {
        setIsReported(res.data);
      })
      .catch((err) => {
        console.error("게시글 신고 상태 조회 실패:", err);
      });
  }, [currentUserId, currentPost?.commNo]);

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
    if (!currentPost) return;
    const commNo = currentPost.commNo ?? currentPost.id;
    fetchComments(commNo);
  }, [currentPost]);

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

  if (loading) {
    return <CommunityHotplaceDetailSkeleton />;
  }

  // 게시글이 존재하지 않을 경우
  if (!currentPost) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        존재하지 않는 게시물입니다.
      </div>
    );
  }

  // 이미지 슬라이드 데이터 생성
  const slideImages = currentPost.images || [
    currentPost.img,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub1/900/650`,
    `https://picsum.photos/seed/hotplace-${currentPost.id}-sub2/900/650`,
  ];

  // 조회수 / 좋아요 수 추출
  const viewCount = currentPost.viewCnt;
  const wishCount = currentPost.wishCnt;

  // 댓글 영역으로 스크롤 이동
  const scrollToComments = () => {
    document
      .getElementById("hotplace-comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  // 게시글 좋아요 처리
  const handleLikeClick = async () => {
    if (!currentUserId && !isLogin) {
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

  // 게시글 작성자 여부 확인
  const isOwner = currentUserId !== null &&
                  currentPost.mbrId !== null &&
                  Number(currentUserId) === Number(currentPost.mbrId);

  return (
    <div className="paperlogy min-h-screen bg-[#f7f8fa] font-sans">
      <div className="container mx-auto py-8 px-5 lg:px-[50px] xl:px-[250px] mb-20">
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
              isLiked={isLiked}
              isOwner={isOwner}
              onCommentClick={scrollToComments}
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
            isReported={isReported}
            openReportModal={async () => {
              const result = await openReportModal({
                  type: "post",
                  commNo: currentPost.commNo ?? currentPost.id,
                });
                if (result) {
                  setIsReported(true);
                }
                if (result?.blinded) {
                  navigate("/showcase/hotplace");
                }
              }}
          />
        </section>

        <div id="hotplace-comments" className="scroll-mt-24">
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

export default CommunityHotplaceDetail;