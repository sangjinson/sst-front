const CategorySelect = ({
  selectedCategory,
  setSelectedCategory,
  isCategoryOpen,
  setIsCategoryOpen,
  categories,
}) => {
  return (
    <div className="relative">
      <label
        id="category-label"
        className="block fs-down-2 font-bold text-gray-700 mb-3">
        장소 카테고리
      </label>

      <button
        type="button"
        aria-labelledby="category-label"
        aria-haspopup="listbox"
        aria-expanded={isCategoryOpen}
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        className="w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#009277] transition-all">
        <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
          {selectedCategory?.cmmCdName || "카테고리 선택"}
        </span>

        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isCategoryOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isCategoryOpen && (
        <div
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category.cmmCd}
              role="option"
              aria-selected={selectedCategory?.cmmCd === category.cmmCd}
              className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 transition-colors"
              onClick={() => {
                setSelectedCategory(category);
                setIsCategoryOpen(false);
              }}>
              {category.cmmCdName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;