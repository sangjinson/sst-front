const CommunitySearchBar = ({
  keyword,
  setKeyword,
  searchType,
  setSearchType,
  sortType,
  setSortType,
  totalCount,
  onSearch,
  onReset,
  searchOptions = [
    { value: "all", label: "전체 검색" },
    { value: "title", label: "제목 검색" },
    { value: "content", label: "내용 검색" },
    { value: "author", label: "작성자 검색" },
    { value: "hashtag", label: "해시태그 검색" },
  ],
  popularTags = [],
}) => {
  return (
    <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)_160px]">

        {/* 검색 타입 */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 검색어 입력 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="h-11 rounded-xl border border-gray-200 px-4 fs-down-1 text-gray-700 outline-none focus:border-emerald-500"
        />

        {/* 정렬 */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 fs-down-1 text-gray-700 outline-none focus:border-emerald-500">
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="view">조회수순</option>
          <option value="comment">댓글순</option>
        </select>
      </div>

      {/* 하단 영역 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 fs-down-1 text-gray-400">
      <div className="flex flex-wrap items-center gap-3">
        <span className="pl-2">
          총{" "}
          <strong className="text-emerald-600">
            {totalCount}
          </strong>
          개의 게시글
        </span>

        {popularTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchType("hashtag");
                  setKeyword(tag);
                }}
                className="rounded-full bg-emerald-50 px-3 py-1 fs-down-1 font-semibold text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-700">
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {keyword && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-gray-200 px-3 py-1 fs-down-1 font-semibold text-gray-400 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600">
          검색 초기화
        </button>
      )}
    </div>
    </section>
  );
};

export default CommunitySearchBar;