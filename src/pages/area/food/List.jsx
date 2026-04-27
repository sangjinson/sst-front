// src/pages/area/food/List.jsx
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getFoodDataByRegion } from "./foodData";
import HeroBanner from "@components/common/HeroBanner";

const ITEMS_PER_PAGE = 9;
const categories = ["전체", "한식", "중식", "일식", "양식"];

export default function FoodList() {
  const navigate = useNavigate();
  const { selectedRegion } = useOutletContext();
  const foodData = getFoodDataByRegion(selectedRegion);

  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popular");
  const [likedCards, setLikedCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleLike = (id) => {
    setLikedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredData =
    activeCategory === "전체"
      ? foodData
      : foodData.filter((item) => item.category === activeCategory);

  const sortedData = [...filteredData].sort((a, b) =>
    sortBy === "popular" ? b.reviews - a.reviews : b.rating - a.rating
  );

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const bannerImage =
    foodData[0]?.image ??
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90";

  const handleCardClick = (item) => {
    navigate(`/${selectedRegion}/food/view?id=${item.id}`, {
      state: { food: item, selectedRegion },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Pretendard:wght@300;400;500;600;700&display=swap');
        .food-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .food-page { font-family: 'Pretendard', sans-serif; background: #f7f5f2; min-height: 100vh; }
        .food-page .content-wrap { width: 100%; max-width: 1920px; margin: 0 auto; padding: 0 20px; }
        @media (min-width: 1024px) { .food-page .content-wrap { padding: 0 50px; } }
        @media (min-width: 1280px) { .food-page .content-wrap { padding: 0 250px; } }
        .food-page .breadcrumb-row { display: flex; align-items: center; gap: 6px; padding: 20px 0 6px; font-size: 0.82rem; color: #888; }
        .food-page .breadcrumb-row span { color: #bbb; }
        .food-page .breadcrumb-row a { color: #888; text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .food-page .breadcrumb-row a:hover { color: #333; }
        .food-page .breadcrumb-row .bc-active { color: #c8860a; font-weight: 600; }
        .food-page .filter-sort-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 28px; flex-wrap: wrap; gap: 12px; }
        .food-page .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .food-page .tab-btn { padding: 9px 22px; border-radius: 9999px; border: 1.5px solid #d9d0c4; background: #fff; font-size: 0.9rem; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s ease; font-family: 'Pretendard', sans-serif; }
        .food-page .tab-btn:hover { border-color: #c8860a; color: #c8860a; }
        .food-page .tab-btn.active { background: #c8860a; border-color: #c8860a; color: #fff; font-weight: 600; }
        .food-page .sort-btn-group { display: flex; gap: 8px; }
        .food-page .sort-btn { padding: 9px 22px; border-radius: 9999px; border: 1.5px solid #d9d0c4; background: #fff; font-size: 0.9rem; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s ease; font-family: 'Pretendard', sans-serif; }
        .food-page .sort-btn:hover { border-color: #0F9B73; color: #0F9B73; }
        .food-page .sort-btn.active { background: #0F9B73; border-color: #0F9B73; color: #fff; font-weight: 600; }
        .food-page .result-count { font-size: 0.82rem; color: #999; padding-bottom: 8px; }
        .food-page .result-count strong { color: #333; }
        .food-page .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; color: #aaa; gap: 12px; }
        .food-page .empty-state svg { width: 48px; height: 48px; stroke: #d9d0c4; fill: none; stroke-width: 1.5; }
        .food-page .empty-state p { font-size: 0.95rem; color: #bbb; }
        .food-page .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding-bottom: 32px; }
        @media (max-width: 900px) { .food-page .card-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .food-page .card-grid { grid-template-columns: 1fr; } }
        .food-page .food-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .food-page .food-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.13); }
        .food-page .card-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .food-page .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .food-page .food-card:hover .card-img-wrap img { transform: scale(1.06); }
        .food-page .card-category-badge { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.55); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 9999px; backdrop-filter: blur(4px); letter-spacing: 0.04em; }
        .food-page .like-btn { position: absolute; top: 10px; right: 10px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.9); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .food-page .like-btn:hover { transform: scale(1.1); }
        .food-page .like-btn.liked { background: #fee2e2; }
        .food-page .heart-icon { width: 16px; height: 16px; fill: none; stroke: #999; stroke-width: 2; transition: all 0.2s; }
        .food-page .like-btn.liked .heart-icon { fill: #ef4444; stroke: #ef4444; }
        .food-page .card-body { padding: 16px 18px 20px; }
        .food-page .card-name { font-family: 'Nanum Myeongjo', serif; font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
        .food-page .card-rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .food-page .star-icon { width: 14px; height: 14px; fill: #f59e0b; stroke: none; }
        .food-page .rating-num { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; }
        .food-page .reviews-num { font-size: 0.78rem; color: #aaa; }
        .food-page .card-desc { font-size: 0.82rem; color: #666; line-height: 1.65; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .food-page .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .food-page .tag { font-size: 0.72rem; color: #c8860a; background: #fef9ed; border: 1px solid #f0d88a; border-radius: 9999px; padding: 3px 10px; font-weight: 500; }
        .food-page .card-address { display: flex; align-items: center; gap: 5px; font-size: 0.76rem; color: #aaa; }
        .food-page .pin-icon { width: 12px; height: 12px; flex-shrink: 0; stroke: #c8860a; fill: none; stroke-width: 2; }
        .food-page .pagination-bar { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 32px 0 60px; flex-wrap: wrap; }
        .food-page .page-btn { min-width: 38px; height: 38px; padding: 0 10px; border-radius: 8px; border: 1.5px solid #d9d0c4; background: #fff; font-size: 0.88rem; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s ease; font-family: 'Pretendard', sans-serif; display: flex; align-items: center; justify-content: center; }
        .food-page .page-btn:hover:not(:disabled) { border-color: #c8860a; color: #c8860a; }
        .food-page .page-btn.active { background: #c8860a; border-color: #c8860a; color: #fff; font-weight: 700; }
        .food-page .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .food-page .page-arrow-icon { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
      `}</style>

      <div className="min-h-screen bg-[#f8f6f0]">
        {/* 🚀 이전 페이지들과 동일한 패딩/마진/너비 적용 */}
        <div className="max-w-[1200px] mx-auto px-4 py-6">

          {/* 필터 및 정렬 영역 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* 카테고리 탭 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#0F9B73] text-white border-[#0F9B73]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]"
                  }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 정렬 버튼 */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  sortBy === "popular"
                    ? "bg-[#0F9B73] text-white border-[#0F9B73]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]"
                }`}
                onClick={() => handleSortChange("popular")}
              >
                인기순
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  sortBy === "rating"
                    ? "bg-[#0F9B73] text-white border-[#0F9B73]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]"
                }`}
                onClick={() => handleSortChange("rating")}
              >
                별점순
              </button>
            </div>
          </div>

          {/* 결과 수 */}
          <p className="text-sm text-gray-500 mb-5">
            총 <span className="font-semibold text-gray-800">{sortedData.length}</span>개의 먹거리
          </p>

          {/* 카드 그리드 영역 */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleCardClick(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  {/* 썸네일 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* 카테고리 배지 */}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm">
                      {item.category}
                    </span>
                    {/* 찜(좋아요) 버튼 */}
                    <button
                      className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      aria-label="좋아요"
                    >
                      <svg 
                        className={`w-5 h-5 transition-colors ${likedCards.includes(item.id) ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-500"}`} 
                        viewBox="0 0 24 24" 
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* 카드 텍스트 정보 */}
                  <div className="p-4">
                    <div className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-[#0F9B73] transition-colors">
                      {item.name}
                    </div>
                    
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviews}개 리뷰)</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag) => (
                        <span className="text-[11px] text-[#0F9B73] bg-green-50 px-2 py-0.5 rounded-sm" key={tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-400 border-t pt-3">
                      <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 빈 데이터 상태 */
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <svg className="w-16 h-16 stroke-current fill-none mb-4" viewBox="0 0 24 24" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-lg font-medium text-gray-500">해당 카테고리의 먹거리가 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button 
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center" 
                onClick={() => setCurrentPage((p) => p - 1)} 
                disabled={currentPage === 1} 
                aria-label="이전 페이지"
              >
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page} 
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#0F9B73] text-white"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`} 
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center" 
                onClick={() => setCurrentPage((p) => p + 1)} 
                disabled={currentPage === totalPages} 
                aria-label="다음 페이지"
              >
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
}