import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "@modules/form/TextInput";
import SelectInput from "@modules/form/SelectInput";


const CommunityLifeWrite = () => {
  const navigate = useNavigate();
  
  // 기본 상태 관리
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("볼거리");
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // ✅ 지역 및 장소 관련 상태
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(false); // 드롭다운 열림 상태
  const [placeName, setPlaceName] = useState("");

  const gyeonggiRegions = [
    "수원시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시", 
    "시흥시", "파주시", "의정부시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시", 
    "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시", 
    "가평군", "과천시", "연천군"
  ];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ category, selectedRegion, placeName, title, content, tags });
    alert("글이 등록되었습니다!");
    navigate("/showcase");
  };

  return (
    <>
      <div className="container py-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b px-8 py-6">
            <h2 className="fs-down-4 font-bold text-gray-800">뽐낼거리 작성하기</h2>
            <p className="fs-down-1 text-gray-400 mt-1">나만의 경기도 여행 순간을 기록해 보세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* ✅ 2. 지역 및 장소 선택 (커스텀 드롭다운 적용) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 지역 선택 (커스텀) */}
              <div className="relative">
                <label
                  id="region-label"
                  className="block fs-down-2 font-bold text-gray-700 mb-3">
                  방문 지역
                </label>

                <button
                  type="button"
                  aria-labelledby="region-label"
                  aria-haspopup="listbox"
                  aria-expanded={isRegionOpen}
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className="w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#009277] transition-all">
                  <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>
                    {selectedRegion || "지역 선택"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isRegionOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 아래로 내려오는 목록 */}
                {isRegionOpen && (
                  <div
                    role="listbox"
                    aria-labelledby="region-label"
                    className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {gyeonggiRegions.map((region) => (
                      <div
                        key={region}
                        role="option"
                        aria-selected={selectedRegion === region}
                        className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 text-em transition-colors"
                        onClick={() => {
                          setSelectedRegion(region);
                          setIsRegionOpen(false);
                        }}>
                        {region}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 구체적인 장소 (입력창) */}
              <div>
                <label
                  htmlFor="placeName"
                  className="block fs-down-2 font-bold text-gray-700 mb-3">
                  구체적인 장소
                </label>

                <TextInput
                  id="placeName"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="예: 화성행궁, 두물머리"
                  required
                />
              </div>
            </div>

            {/* 3. 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block fs-down-2 font-bold text-gray-700 mb-3">
                제목
              </label>

              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                required
              />
            </div>

            {/* 4. 사진 등록 */}
            <div>
              <label className="block fs-down-2 font-bold text-gray-700 mb-3">사진 등록</label>
              <div className="flex flex-col items-center justify-center w-full">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden border">
                        <img src={preview} alt={`미리보기 ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImagePreviews(imagePreviews.filter((_, i) => i !== index))}
                          className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                    <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <p className="text-em font-semibold">클릭하여 사진 추가</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
                </label>
              </div>
            </div>

            {/* 5. 내용 입력 */}
            <div>
              <label className="block fs-down-2 font-bold text-gray-700 mb-3">내용</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-blue-400 transition-colors">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="15"
                  placeholder="경기도 여행의 추억을 담아보세요."
                  className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* 6. 태그 설정 */}
            <div>
              <label
                htmlFor="tagInput"
                className="block text-em font-bold text-gray-700 mb-3">
                태그 설정
              </label>

              <div className="w-full flex flex-wrap gap-2 items-center">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-[#f0f9f7] text-[#009277] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-sm">
                    #{tag}
                    <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))} className="ml-1 hover:text-red-500">×</button>
                  </span>
                ))}

                <TextInput
                  id="tagInput"
                  value={tagInput}
                  size="md"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "태그 입력 후 엔터" : ""}
                  inputClassName="text-em"
                />
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all">
                취소
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#009277] text-white font-semibold rounded-lg hover:bg-[#007a63] shadow-md transition-all">
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommunityLifeWrite;