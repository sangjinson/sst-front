import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { ClipButton } from '@components/modules/ActionButtons';

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [isLiked, setIsLiked] = useState(false); // 찜 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력값
  const [comments, setComments] = useState([
    { id: 1, user: "5스틴", text: "뮤지컬트레인", date: "2026.04.22" },
    { id: 2, user: "여행가 영조", text: "집에가자", date: "2026.04.23" },
  ]);

  const [editingId, setEditingId] = useState(null); // 수정 중인 댓글 ID
  const [editText, setEditText] = useState(""); // 수정 중인 내용

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // 더미 데이터
  const posts = [
    { id: 16, title: "서울 야경 명소 발견!", author: "서울시민", likes: 45, img: "https://picsum.photos/seed/16/400/533", category: "볼거리" },
    { id: 15, title: "제주도 숨은 카페 공유해요", author: "여행가J", likes: 88, img: "https://picsum.photos/seed/15/400/533", category: "먹거리" },
    { id: 14, title: "강릉 바다 힐링 여행", author: "파도사랑", likes: 23, img: "https://picsum.photos/seed/14/400/533", category: "볼거리" },
    { id: 13, title: "부산 밀면 맛집 인증", author: "미식가", likes: 120, img: "https://picsum.photos/seed/13/400/533", category: "먹거리" },
    { id: 12, title: "전주 한옥마을 산책", author: "한옥러버", likes: 56, img: "https://picsum.photos/seed/12/400/533", category: "놀거리" },
    { id: 11, title: "속초 중앙시장 먹거리 탐방", author: "먹방러", likes: 77, img: "https://picsum.photos/seed/11/400/533", category: "먹거리" },
    { id: 10, title: "가을 단풍 구경 다녀옴", author: "단풍맨", likes: 34, img: "https://picsum.photos/seed/10/400/533", category: "볼거리" },
    { id: 9, title: "인천 월미도 나들이", author: "바다아이", likes: 12, img: "https://picsum.photos/seed/9/400/533", category: "놀거리" },
    { id: 8, title: "경기도 화성 1일차", author: "경기도 청년", likes: 30, img: "https://picsum.photos/seed/8/400/533", category: "볼거리" },
    { id: 7, title: "관악산 다녀왔습니다.", author: "부산 소녀", likes: 62, img: "https://picsum.photos/seed/7/400/533", category: "놀거리" },
    { id: 6, title: "경기도에 이런 곳이 있네요??", author: "thstkdwls13", likes: 5, img: "https://picsum.photos/seed/6/400/533", category: "볼거리" },
    { id: 5, title: "먹을거면 여기로 와라", author: "김길동", likes: 102, img: "https://picsum.photos/seed/5/400/533", category: "먹거리" },
    { id: 4, title: "여자친구랑 최고의 숙소!", author: "이강도", likes: 1, img: "https://picsum.photos/seed/4/400/533", category: "잘거리" },
    { id: 3, title: "컴포넌트랑 이천 힐링 여행", author: "useState()", likes: 404, img: "https://picsum.photos/seed/3/400/533", category: "놀거리" },
    { id: 2, title: "소주맛이 어떠냐? 달아요", author: "callback", likes: 14, img: "https://picsum.photos/seed/2/400/533", category: "먹거리" },
    { id: 1, title: "오늘 하루가 인상적이었다는거야", author: "박새로이", likes: 54, img: "https://picsum.photos/seed/1/400/533", category: "놀거리" },
  ];

  const currentPost = posts.find((p) => p.id === Number(id));

  if (!currentPost) {
    return <div className="py-20 text-center font-bold text-gray-500">존재하지 않는 게시물입니다.</div>;
  }

  const postDetail = {
    ...currentPost,
    date: "2026.04.22",
    tags: [currentPost.category, "경기도", "여행"],
    content: "경기도 여행의 순간을 공유하세요. 정말 멋진 곳이었어요!",
  };

  // --- 기능 함수들 ---

  // const handleShare = async () => {
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({ title: postDetail.title, url: window.location.href });
  //     } else {
  //       await navigator.clipboard.writeText(window.location.href);
  //       alert("링크가 복사되었습니다!");
  //     }
  //   } catch (err) { console.log(err); }
  // };

  const handleReport = () => {
    if (window.confirm("이 게시물을 신고하시겠습니까?")) alert("신고 접수 완료");
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return alert("내용을 입력해주세요.");
    const newObj = { id: Date.now(), user: "나", text: newComment, date: new Date().toLocaleDateString() };
    setComments([newObj, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("삭제하시겠습니까?")) setComments(comments.filter(c => c.id !== commentId));
  };

  const startEditing = (id, text) => { setEditingId(id); setEditText(text); };

  const handleSaveEdit = (commentId) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, text: editText } : c));
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 transition-all font-sans">
      <Breadcrumb 
        paths={[{ label: '홈', to: '/' }, { label: '뽐낼거리', to: '/showcase' }, { label: '상세보기' }]} 
        className="mb-4"
      />

      {/* 헤더 섹션 */}
      <div className="mb-8 mt-4 md:mt-7">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 underline decoration-emerald-300 underline-offset-4">뽐낼거리</h2>
        <p className="text-gray-400 text-xs md:text-sm">경기도 여행의 순간을 공유하세요</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
        
        {/* 왼쪽: 이미지 영역 */}
        <div className="flex-1 w-full shrink-0">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-inner group aspect-[4/3] md:aspect-[3/2]">
            <img src={postDetail.img} alt={postDetail.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-black/20 text-white w-8 h-8 rounded-full">&lt;</button>
              <button className="bg-black/20 text-white w-8 h-8 rounded-full">&gt;</button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 상세 정보 영역 */}
        <div className="w-full lg:w-[400px] flex flex-col justify-between py-2">
          <div>
            {/* 공유/신고 버튼 */}
            <div className="flex gap-2 mb-8 mt-4 lg:mt-0">
              <ClipButton />
              <button onClick={handleReport} className="text-xs md:text-sm px-4 py-2 border border-gray-200 rounded-full hover:text-red-500 transition-colors">🚩 신고</button>
            </div>

            {/* 작성자 정보 및 찜 버튼 컨테이너 */}
            <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-3 mb-8">
              
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-xl shrink-0 border border-emerald-100 shadow-sm">😊</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-[15px] md:text-lg leading-tight">{postDetail.author}</h4>
                  <p className="text-[11px] md:text-sm text-gray-400 mt-0.5">작성일 {postDetail.date}</p>
                </div>
              </div>

              {/* ✅ 찜 버튼: 공통 HeartButton으로 교체 및 크기 조정 */}
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`w-11 h-11 md:w-12 md:h-12 border rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 lg:mt-10 ${
                  isLiked ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-500"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

            </div>
          </div>

          {/* 제목 및 태그 영역 */}
          <div className="mt-6 lg:mt-auto">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 leading-snug decoration-emerald-300 underline underline-offset-8 decoration-2">✏️ {postDetail.title}</h3>
            <div className="flex flex-wrap gap-2">
              {postDetail.tags.map(tag => (
                <span key={tag} className="text-xs md:text-sm font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-md border border-emerald-100 shadow-inner">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 댓글 영역 */}
      <div className="border-t border-gray-100 pt-10">
        <h4 className="font-bold text-xl mb-6">댓글 <span className="text-emerald-500 font-extrabold">{comments.length}</span></h4>
        
        {/* 댓글 입력 */}
        <div className="border border-gray-200 rounded-2xl p-5 mb-10 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-500 transition-all bg-white shadow-sm">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full h-24 outline-none text-sm md:text-base resize-none bg-transparent"
            placeholder="이 여행지에 대해 궁금한 점이나 감상을 남겨주세요."
          />
          <div className="flex justify-end mt-2">
            <button onClick={handleCommentSubmit} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow active:scale-95">등록</button>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="space-y-4 mb-16">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-100 rounded-2xl p-5 md:p-7 bg-gray-50/70 hover:bg-white transition-all shadow-inner group relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs border border-gray-100 shrink-0 shadow">👤</div>
                  <div>
                    <p className="font-bold text-[15px] text-gray-800">{comment.user}</p>
                    <p className="text-[11px] text-gray-400">{comment.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 text-xs md:text-sm font-semibold pt-1">
                  {editingId === comment.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(comment.id)} className="text-blue-600 hover:text-blue-800">저장</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(comment.id, comment.text)} className="text-gray-400 hover:text-blue-500">수정</button>
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500">삭제</button>
                    </>
                  )}
                </div>
              </div>

              {editingId === comment.id ? (
                <textarea 
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none shadow-inner"
                  rows="3"
                />
              ) : (
                <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed pl-13 pr-2 whitespace-pre-wrap">{comment.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityLifeDetail;