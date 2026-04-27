// src/pages/area/food/List.jsx
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getFoodDataByRegion } from "./foodData";
import { toKorRegion } from "@utils/regionMap";
import { GridCard, GridCardHeader, GridCardBody, GridCardFooter } from "@components/modules/GridCard";

const ITEMS_PER_PAGE = 9;
const categories = ["전체", "한식", "중식", "일식", "양식"];

const categoryColor = {
  한식: "bg-orange-100 text-orange-700",
  중식: "bg-red-100 text-red-700",
  일식: "bg-blue-100 text-blue-700",
  양식: "bg-purple-100 text-purple-700",
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-sm ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
    ))}
    <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
  </div>
);

export default function FoodList() {
  const navigate = useNavigate();
  const { selectedRegion } = useOutletContext();
  const regionKor = toKorRegion(selectedRegion);
  const foodData = getFoodDataByRegion(regionKor);

  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleCardClick = (item) => {
    navigate(`/${selectedRegion}/food/view?id=${item.id}`, {
      state: { food: item, selectedRegion },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="py-5">

        {/* 필터 & 정렬 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#0F9B73] text-white border-[#0F9B73]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[{ value: "popular", label: "인기순" }, { value: "rating", label: "별점순" }].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  sortBy === opt.value
                    ? "bg-[#0F9B73] text-white border-[#0F9B73]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 수 */}
        <p className="text-sm text-gray-500 mb-3">
          총 <span className="font-semibold text-gray-800">{sortedData.length}</span>개의 먹거리
        </p>

        {/* 카드 그리드 */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <GridCard key={item.id} onClick={() => handleCardClick(item)}>
                <GridCardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${categoryColor[item.category] || "bg-gray-100 text-gray-600"}`}>
                      {item.category}
                    </span>
                  </div>
                </GridCardHeader>

                <GridCardBody className="px-4 py-3">
                  <h3 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-[#0F9B73] transition-colors">
                    {item.name}
                  </h3>
                  <StarRating rating={item.rating} />
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">리뷰 {item.reviews}개</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#c8860a] bg-[#fef9ed] border border-[#f0d88a] rounded-full px-2 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </GridCardBody>

                <GridCardFooter className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>📍</span>
                    <span className="truncate max-w-[200px]">{item.address}</span>
                  </p>
                </GridCardFooter>
              </GridCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-lg font-medium">해당 카테고리의 먹거리가 없습니다</p>
            <p className="text-sm mt-1">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-[#0F9B73] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}