import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CommunityWrite = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("볼거리");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  
  // ✅ 태그 관련 상태
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // 이미지 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ 태그 추가 핸들러 (엔터나 스페이스바 입력 시 추가)
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      // 입력창이 비어있을 때 백스페이스 누르면 마지막 태그 삭제
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, category, content, tags });
    alert("글이 등록되었습니다!");
    navigate("/showcase"); // 목록 경로에 맞춰 수정하세요
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
            <div className="flex gap-3">
              {["볼거리", "먹거리", "놀거리", "잘거리"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat ? "bg-[#009277] text-white shadow-md" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 제목 */}
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

          {/* 3. 사진 등록 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">사진 등록</label>
            <div className="flex flex-col items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                  <button onClick={() => setImagePreview(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center">✕</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                    <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <p className="text-sm font-semibold">클릭하여 사진 추가</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* ✅ 4. 내용 입력 (에디터 툴바 스타일 적용) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">내용</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* 심플 툴바 UI */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-4">
                <button type="button" className="font-bold text-gray-600 hover:text-black">B</button>
                <button type="button" className="italic text-gray-600 hover:text-black">I</button>
                <button type="button" className="underline text-gray-600 hover:text-black">U</button>
                <div className="w-[1px] h-4 bg-gray-300 my-auto"></div>
                <button type="button" className="text-sm text-gray-600 hover:text-black">링크</button>
                <button type="button" className="text-sm text-gray-600 hover:text-black">정렬</button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                placeholder="경기도 여행의 추억을 에디터에 담아보세요."
                className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* ✅ 5. 태그 작성 영역 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">태그 설정</label>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg focus-within:border-[#009277] transition-colors flex flex-wrap gap-2 items-center">
              {/* 생성된 태그들 */}
              {tags.map((tag, index) => (
                <span key={index} className="bg-[#f0f9f7] text-[#009277] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-sm">
                  #{tag}
                  <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500 ml-1">×</button>
                </span>
              ))}
              {/* 태그 입력창 */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "태그 입력 후 엔터 (예: 경기도, 캠핑)" : ""}
                className="flex-1 outline-none py-1 min-w-[150px] text-sm"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2">* 태그를 입력하고 Enter 또는 스페이스바를 눌러주세요.</p>
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