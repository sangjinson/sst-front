import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CommunityDetail = () => {

    useEffect(()=>{
        window.scrollTo({
        top: 0,
        });
    },[])

  const { id } = useParams(); // URL에서 게시물 ID를 가져옴 (문자열)
  const navigate = useNavigate();

  // 1. 목록 페이지와 동일한 데이터 (나중엔 공통 data.js 파일로 빼는 것이 좋습니다)
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

  // 2. 주소창의 id와 일치하는 데이터 찾기
  // useParams()의 id는 문자열이므로 Number()로 형변환이 필요합니다.
  const currentPost = posts.find((p) => p.id === Number(id));

  // 데이터가 없을 경우 예외 처리
  if (!currentPost) {
    return <div className="py-20 text-center">존재하지 않는 게시물입니다.</div>;
  }

  // 3. 댓글 및 날짜 등은 아직 데이터에 없으므로 기존 더미 형식을 유지하거나 확장합니다.
  const postDetail = {
    ...currentPost,
    date: "2026.04.22", // 나중에 데이터에 추가하면 좋습니다.
    tags: [currentPost.category, "경기도", "여행"],
    content: "경기도 여행의 순간을 공유하세요. 정말 멋진 곳이었어요!",
    comments: [
      { id: 1, user: "5스틴", text: "뮤지컬트레인" },
      { id: 2, user: "여행가 영조", text: "집에가자" },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

    {/* 경로 안내 */}
    <nav className="text-xs text-gray-500 mb-15">
        홈 &gt; 뽐낼거리 &gt; <span className="font-bold text-gray-800">갤러리</span>

      </nav>
      {/* 상단 타이틀 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2">뽐낼거리</h2>
        <p className="text-gray-400 text-sm">경기도 여행의 순간을 공유하세요</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 mb-16">
        {/* 왼쪽: 이미지 슬라이더 */}
        <div className="flex-1">
          <div className="relative aspect-auto rounded-sm overflow-hidden bg-gray-100 border border-gray-100">
            {/* ✅ 클릭한 게시물의 이미지로 변경 */}
            <img src={postDetail.img} alt={postDetail.title} className="w-full h-full object-cover aspect-[4/3]" />
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-2xl">&lt;</button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 text-2xl">&gt;</button>
          </div>
        </div>

        {/* 오른쪽: 정보 및 본문 */}
        <div className="w-full md:w-[400px] ml-15">
          <div className="flex gap-2 mb-6 text-[10px]">
            <button className="text-[14px] px-3 py-1 border border-gray-200 rounded flex items-center gap-1 hover:bg-gray-200">공유</button>
            <button className="text-[14px] px-3 py-1 border border-gray-200 rounded flex items-center gap-1 hover:bg-gray-200">신고</button>
            {/* <button onClick={() => navigate(-1)} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 ml-auto font-bold">뒤로가기</button>*/}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">👤</div>
            <div>
              {/* ✅ 클릭한 게시물의 작성자로 변경 */}
              <h4 className="font-bold text-xm">{postDetail.author}</h4>
              <p className="text-[12px] text-gray-400">작성일 {postDetail.date}</p>
            </div>
          </div>

          <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-300 mb-10 hover:text-red-500 hover:border-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="mt-66">
            {/* ✅ 클릭한 게시물의 제목으로 변경 */}
            <h3 className="text-lg font-bold mb-3">✏️ {postDetail.title}</h3>
            <div className="flex flex-wrap gap-2">
              {postDetail.tags.map(tag => (
                <span key={tag} className="text-sm font-bold text-gray-800">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 댓글 영역 (postDetail.comments 사용) */}
      <div className="border-t border-gray-100 pt-6">
        <h4 className="font-bold mb-6">댓글 ({postDetail.comments.length})</h4>
        <div className="border border-gray-200 rounded-md p-4 mb-10">
          <textarea 
            className="w-full h-20 outline-none text-sm resize-none placeholder:text-gray-300"
            placeholder="소중한 댓글을 남겨주세요."
          />
          <div className="flex justify-end mt-2">
            <button className="bg-[#009277] text-white px-5 py-1.5 rounded-md text-xs font-bold">댓글 등록</button>
          </div>
        </div>

        <div className="space-y-4">
          {postDetail.comments.map(comment => (
            <div key={comment.id} className="border border-gray-100 rounded-md p-4 bg-gray-100">
              <p className="font-bold text-[13px] mb-1">{comment.user}</p>
              <p className="text-xs text-gray-500">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;