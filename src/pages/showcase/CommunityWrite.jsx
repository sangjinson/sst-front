import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CommunityWrite = () => {
  const navigate = useNavigate();
  
  // 기본 상태 관리
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("볼거리");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
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
    <div className="bg-[#f7f8fa] min-h-screen py-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="bg-white border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800">뽐낼거리 작성하기</h2>
          <p className="text-sm text-gray-400 mt-1">나만의 경기도 여행 순간을 기록해 보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* 1. 카테고리 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">카테고리</label>
            {/* flex-wrap을 추가하여 화면이 아주 작아질 경우 다음 줄로 넘어가게 하거나, 
                overflow-x-auto를 사용해 가로 스크롤이 생기게 할 수 있습니다. */}
            <div className="flex flex-wrap gap-3">
              {["볼거리", "먹거리", "놀거리", "잘거리"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap min-w-[70px] ${
                    category === cat ? "bg-[#009277] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ 2. 지역 및 장소 선택 (커스텀 드롭다운 적용) */}
          <div className="grid grid-cols-2 gap-4">
            {/* 지역 선택 (커스텀) */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-3">방문 지역</label>
              <button
                type="button"
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#009277] transition-all"
              >
                <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>
                  {selectedRegion || "지역 선택"}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${isRegionOpen ? "rotate-180" : ""}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 아래로 내려오는 목록 */}
              {isRegionOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {gyeonggiRegions.map((region) => (
                    <div
                      key={region}
                      className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 text-sm transition-colors"
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

            {/* 구체적인 장소 (입력창) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">구체적인 장소</label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="예: 화성행궁, 두물머리"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009277] transition-colors"
                required
              />
            </div>
          </div>

          {/* 3. 제목 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009277]"
              required
            />
          </div>

          {/* 4. 사진 등록 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">사진 등록</label>
            <div className="flex flex-col items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImagePreview(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center">✕</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                    <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <p className="text-sm font-semibold">클릭하여 사진 추가</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* 5. 내용 입력 */}
          <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">내용</label>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-blue-400 transition-colors">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="15" // 에셋이 빠진 만큼 높이를 조금 더 확보해도 좋습니다.
              placeholder="경기도 여행의 추억을 담아보세요."
              className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed"
              required
            />
          </div>
        </div>

          {/* 6. 태그 설정 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">태그 설정</label>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:border-[#009277] flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) => (
                <span key={index} className="bg-[#f0f9f7] text-[#009277] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-sm">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))} className="ml-1 hover:text-red-500">×</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "태그 입력 후 엔터" : ""}
                className="flex-1 outline-none py-1 min-w-[150px] text-sm"
              />
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all">취소</button>
            <button type="submit" className="flex-[2] py-4 bg-[#009277] text-white font-bold rounded-lg hover:bg-[#007a63] shadow-lg transition-all">등록하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityWrite;