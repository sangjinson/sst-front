import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";

const CommunityLife = () => {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // 찜 상태 관리
  const [wishlistedPosts, setWishlistedPosts] = useState({});
  const toggleWishlist = (postId) => {
    setWishlistedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

  const categories = ["전체", "#볼거리", "#먹거리", "#놀거리", "#잘거리"];

  // 카테고리 필터링
  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "전체") return true;
    return post.category === activeCategory.replace("#", "");
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentItems = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-6 md:py-10 font-sans">
      <Breadcrumb 
        paths={[{ label: '홈', to: '/' }, { label: '뽐낼거리' }]} 
        className="mb-4" 
      />

      {/* 필터 및 글쓰기 버튼 통합 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-4 gap-4 mt-8">
        
        {/* 왼쪽: 카테고리 필터 (모바일 스크롤 유지) */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? "bg-emerald-600 text-white shadow-md font-bold" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 오른쪽: 정렬 및 글쓰기 버튼 그룹 */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
          {/* 최신순/인기순 */}
          <div className="flex gap-4 text-xs text-gray-400 font-bold">
            <button className="text-gray-800 underline underline-offset-4 decoration-2 decoration-emerald-500">최신순</button>
            <button className="hover:text-gray-600 transition-colors">인기순</button>
          </div>

          {/* ✅ 글쓰기 버튼: 필터 라인 우측 끝에 배치 */}
          <Link to="/showcase/life/write">
            <button className="px-4 py-2 bg-gray-800 text-white text-xs md:text-sm rounded-lg flex items-center gap-1 hover:bg-emerald-600 transition-all shadow-md active:scale-95 shrink-0">
              <span className="text-lg leading-none">+</span> 글쓰기
            </button>
          </Link>
        </div>
      </div>
      

      {/* 카드 그리드: 반응형 1 -> 2 -> 3 -> 4열로 최적화 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {currentItems.length > 0 ? (
          currentItems.map((post) => (
            <div 
              key={post.id} 
              // ✅ 경로를 /showcase/view/${id}로 확실하게 지정
              onClick={() => navigate(`/showcase/life/view/${post.id}`)} 
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 shadow-sm mb-4">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                
                {/* ✅ 리스트의 찜 버튼: 상세페이지와 동일하게 작동하도록 수정 */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleWishlist(post.id);
                  }}
                  className={`absolute top-4 right-4 w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-75 shadow-lg ${
                    wishlistedPosts[post.id] 
                      ? "bg-white text-red-500" 
                      : "bg-black/20 text-white hover:bg-white hover:text-red-500"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={wishlistedPosts[post.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                {/* 이미지 위 카테고리 태그 표시 (옵션) */}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                  {post.category}
                </div>
              </div>

              <div className="px-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-[10px]">👤</div>
                  <h4 className="text-[13px] font-bold text-gray-800">{post.author}</h4>
                </div>
                <p className="text-[14px] text-gray-600 font-medium line-clamp-1 group-hover:text-emerald-600 transition-colors leading-tight">
                  {post.title}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <p className="text-gray-400 text-lg">해당 카테고리에 게시물이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 (반응형 최적화) */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all"
          >
            &lt;
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  currentPage === page 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-110" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 transition-all"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityLife;