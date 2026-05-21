import React, { useMemo, useState } from "react";

const CHO_LIST = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

const getChosung = (text = "") => {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0) - 44032;

      if (code < 0 || code > 11171) {
        return char;
      }

      return CHO_LIST[Math.floor(code / 588)];
    })
    .join("");
};

const RegionSelect = ({
  selectedRegion,
  setSelectedRegion,
  isRegionOpen,
  setIsRegionOpen,
  regions,
  disabled = false,
}) => {
  const [keyword, setKeyword] = useState("");

  const filteredRegions = useMemo(() => {
    if (!keyword.trim()) return regions;

    const search = keyword.trim();

    return regions.filter((region) => {
      const regionName = region.rgnName || "";
      const chosung = getChosung(regionName);

      return (
        regionName.includes(search) ||
        chosung.includes(search)
      );
    });
  }, [keyword, regions]);

  return (
    <div className="relative">
      <label
        id="region-label"
        className="block fs-down-2 font-bold text-gray-700 mb-3"
      >
        방문 지역
      </label>

      <div
        className={`w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg flex justify-between items-center transition-all ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white focus-within:border-[#009277]"
        }`}
      >
        <input
          type="text"
          value={keyword}
          disabled={disabled}
          placeholder={selectedRegion?.rgnName || "지역 선택"}
          onFocus={() => {
            if (!disabled) {
              setIsRegionOpen(true);
            }
          }}
          onChange={(e) => {
            setKeyword(e.target.value);
            setSelectedRegion(null);
            setIsRegionOpen(true);
          }}
          className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
        />

        <button
          type="button"
          aria-labelledby="region-label"
          aria-haspopup="listbox"
          aria-expanded={isRegionOpen}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setIsRegionOpen(!isRegionOpen);
            }
          }}
          className="ml-2"
        >
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isRegionOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isRegionOpen && !disabled && (
        <div
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
        >
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => (
              <div
                key={region.rgnCd}
                role="option"
                aria-selected={selectedRegion?.rgnCd === region.rgnCd}
                className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 transition-colors"
                onClick={() => {
                  setSelectedRegion(region);
                  setKeyword(region.rgnName);
                  setIsRegionOpen(false);
                }}
              >
                {region.rgnName}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RegionSelect;