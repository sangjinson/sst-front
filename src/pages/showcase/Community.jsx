import React, { useState } from "react";

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 이미지 디자인처럼 한 페이지에 8개씩 배치

  // 1. 총 16개의 더미 데이터 (2페이지 분량)
  const posts = [
    { id: 16, title: "서울 야경 명소 발견!", author: "서울시민", likes: 45, img: "https://picsum.photos/seed/16/400/533" },
    { id: 15, title: "제주도 숨은 카페 공유해요", author: "여행가J", likes: 88, img: "https://picsum.photos/seed/15/400/533" },
    { id: 14, title: "강릉 바다 힐링 여행", author: "파도사랑", likes: 23, img: "https://picsum.photos/seed/14/400/533" },
    { id: 13, title: "부산 밀면 맛집 인증", author: "미식가", likes: 120, img: "https://picsum.photos/seed/13/400/533" },
    { id: 12, title: "전주 한옥마을 산책", author: "한옥러버", likes: 56, img: "https://picsum.photos/seed/12/400/533" },
    { id: 11, title: "속초 중앙시장 먹거리 탐방", author: "먹방러", likes: 77, img: "https://picsum.photos/seed/11/400/533" },
    { id: 10, title: "가을 단풍 구경 다녀옴", author: "단풍맨", likes: 34, img: "https://picsum.photos/seed/10/400/533" },
    { id: 9, title: "인천 월미도 나들이", author: "바다아이", likes: 12, img: "https://picsum.photos/seed/9/400/533" },
    // --- 위까지 1페이지 (8개) ---
    { id: 8, title: "경기도 화성 1일차", author: "경기도 청년", likes: 30, img: "https://picsum.photos/seed/8/400/533" },
    { id: 7, title: "관악산 다녀왔습니다.", author: "부산 소녀", likes: 62, img: "https://picsum.photos/seed/7/400/533" },
    { id: 6, title: "경기도에 이런 곳이 있네요??", author: "thstkdwls13", likes: 5, img: "https://picsum.photos/seed/6/400/533" },
    { id: 5, title: "먹을거면 여기로 와라", author: "김길동", likes: 102, img: "https://picsum.photos/seed/5/400/533" },
    { id: 4, title: "여자친구랑 최고의 숙소!", author: "이강도", likes: 1, img: "https://picsum.photos/seed/4/400/533" },
    { id: 3, title: "컴포넌트랑 이천 힐링 여행", author: "useState()", likes: 404, img: "https://picsum.photos/seed/3/400/533" },
    { id: 2, title: "소주맛이 어떠냐? 달아요", author: "callback", likes: 14, img: "https://picsum.photos/seed/2/400/533" },
    { id: 1, title: "오늘 하루가 인상적이었다는거야", author: "박새로이", likes: 54, img: "https://picsum.photos/seed/1/400/533" },
    // --- 위까지 2페이지 (8개) ---
  ];

  // 2. 페이지네이션 계산 로직
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const currentItems = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ["전체", "#볼거리", "#먹거리", "#놀거리", "#잘거리"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 경로 안내 */}
      <nav className="text-xs text-gray-500 mb-5">
        홈 &gt; <span className="font-bold text-gray-800">뽐낼거리</span>
      </nav>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 mb-8">
        <button className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded-md">임시저장</button>
        <button className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded-md flex items-center gap-1">
          <span className="text-lg leading-none">+</span> 글쓰기
        </button>
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
        <div className="flex gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
        {currentItems.map((post) => (
          <div key={post.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm mb-3">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex justify-between items-start px-1">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 mb-1">{post.author}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{post.title}</p>
              </div>
              <div className="text-xs font-semibold text-gray-700 ml-2">{post.likes}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 UI (2페이지까지 표시) */}
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
    </div>
  );
};

export default Community;