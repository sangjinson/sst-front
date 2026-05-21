import { useMemo, useState } from "react";

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

const PlaceAutocomplete = ({
  placeName,
  setPlaceName,
  places,
  selectedPlace,
  setSelectedPlace,
  selectedRegion,
  selectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const disabled = !selectedRegion || !selectedCategory;

  const filteredPlaces = useMemo(() => {
    if (!placeName.trim()) return places.slice(0, 50);

    const search = placeName.trim().toLowerCase();

    return places
      .filter((place) => {
        const placeNameValue = place.plcName || "";
        const lowerPlaceName = placeNameValue.toLowerCase();
        const chosung = getChosung(placeNameValue);

        return (
          lowerPlaceName.includes(search) ||
          chosung.includes(search)
        );
      })
      .slice(0, 50);
  }, [placeName, places]);

  return (
    <div className="relative">
      <label
        htmlFor="placeName"
        className="block fs-down-2 font-bold text-gray-700 mb-3">
        구체적인 장소
      </label>

      <input
        id="placeName"
        autoComplete="off"
        value={placeName}
        onFocus={() => {
          if (!disabled) setIsOpen(true);
        }}
        onChange={(e) => {
          const value = e.target.value;
          setPlaceName(value);
          setSelectedPlace(null);
          setIsOpen(true);
        }}
        placeholder={
          disabled
            ? "지역과 카테고리를 먼저 선택해주세요"
            : "장소명을 입력하거나 선택해주세요"
        }
        disabled={disabled}
        required
        className="w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg bg-white focus:border-[#009277] outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
      />

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-2 z-50 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <button
                key={place.plcNo}
                type="button"
                onMouseDown={() => {
                  setPlaceName(place.plcName);
                  setSelectedPlace(place);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-[#f0f9f7] hover:text-[#009277] transition-colors">
                {place.plcName}
              </button>
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

export default PlaceAutocomplete;