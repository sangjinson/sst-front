
const RegionSelect = ({
  selectedRegion,
  setSelectedRegion,
  isRegionOpen,
  setIsRegionOpen,
  regions,
}) => {
  return (
    <div className="relative">
      <label id="region-label" className="block fs-down-2 font-bold text-gray-700 mb-3">
        방문 지역
      </label>

      <button
        type="button"
        aria-labelledby="region-label"
        aria-haspopup="listbox"
        aria-expanded={isRegionOpen}
        onClick={() => setIsRegionOpen(!isRegionOpen)}
        className="w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#009277] transition-all"
      >
        <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>
          {selectedRegion || "지역 선택"}
        </span>

        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isRegionOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isRegionOpen && (
        <div
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {regions.map((region) => (
            <div
              key={region}
              role="option"
              aria-selected={selectedRegion === region}
              className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 transition-colors"
              onClick={() => {
                setSelectedRegion(region);
                setIsRegionOpen(false);
              }}
            >
              {region}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionSelect;