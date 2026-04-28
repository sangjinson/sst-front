import React, { useState } from "react";
import InListCard from "@/components/card/inListCard";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // [추가] 찜 상태 관리 함수
  const [wishlistedPosts, setWishlistedPosts] = useState({});
    const toggleWishlist = (postId) => {
    setWishlistedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
        }));
    };

  // 1. 데이터에 category 속성 추가 (볼거리, 먹거리, 놀거리, 잘거리)
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

  // 2. 카테고리 필터링 적용
  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "전체") return true;
    // 버튼 텍스트의 '#'을 제거하고 데이터의 카테고리와 비교합니다.
    return post.category === activeCategory.replace("#", "");
  });

  // 3. 필터링된 데이터를 기준으로 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentItems = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 카테고리 변경 시 페이지를 1로 초기화하는 함수
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 경로 안내 */}
      <nav className="text-xs text-gray-500 mb-5">
        홈 &gt; <span className="font-bold text-gray-800">뽐낼거리</span>
      </nav>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 mb-8">
        <button className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded-md hover:bg-gray-700 transition-colors">임시저장</button>
        <button className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1 hover:bg-gray-700 transition-colors">
          <span className="text-lg leading-none">+</span> 글쓰기
        </button>
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
        <div className="flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1 rounded-full text-xs transition-colors ${
                activeCategory === cat ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-gray-400 font-bold">
          <button className="text-gray-800 underline underline-offset-4">최신순</button>
          <button className="hover:text-gray-600">인기순</button>
        </div>
      </div>

      {/* 카드 그리드 (현재 페이지 데이터만 출력) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {currentItems.length > 0 ? (
            currentItems.map((post) => (
            // 1. 카드 전체 클릭 시 상세페이지 이동 추가
            <div 
                key={post.id} 
                // 라우터의 부모(/showcase) + 자식(view) + id를 합친 경로
                onClick={() => navigate(`/showcase/view/${post.id}`)} 
                className="group cursor-pointer"
            >
                {/* 1. 이미지 컨테이너 (찜 버튼 추가) */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm mb-3">
                <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* 2. 찜 버튼 (e.stopPropagation 추가하여 이동 방지) */}
                <button 
                    onClick={(e) => {
                    e.stopPropagation(); // 찜할 때 상세페이지로 이동하는 것을 막음
                    toggleWishlist(post.id); // 기존에 만든 찜 함수 실행
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                </div>

                {/* 3. 정보 영역 */}
                <div className="flex justify-between items-start px-1">
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{post.author}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{post.title}</p>
                </div>
                </div>
            </div>
            ))
        ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
            해당 카테고리에 게시물이 없습니다.
            </div>
        )}
        </div>

      {/* 페이지네이션 UI (필터링된 결과가 있을 때만 표시) */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 rounded hover:bg-gray-50 disabled:opacity-30"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded text-sm font-bold transition-all ${
                currentPage === page 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "border border-gray-200 text-gray-500 hover:border-gray-400 bg-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 rounded hover:bg-gray-50 disabled:opacity-30"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;