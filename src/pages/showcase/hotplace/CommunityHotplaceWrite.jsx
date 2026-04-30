import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "@modules/form/TextInput";
import { getAllPosts, saveUserPost, gyeonggiRegions } from "./communityHotplaceData";

const CommunityHotplaceWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // ✅ 수정 모드일 때 getAllPosts에서 찾기
  const currentPost = isEditMode ? getAllPosts().find((post) => post.id === Number(id)) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  useEffect(() => {
    if (!isEditMode || !currentPost) return;
    setTitle(currentPost.title);
    setContent(currentPost.description);
    setPlaceName(currentPost.place);
    setTags(currentPost.hashtags || []);
    setImagePreviews(currentPost.images || [currentPost.img]);
    setSelectedRegion(currentPost.region || "");
  }, [isEditMode, currentPost]);

  if (isEditMode && !currentPost) {
    return <div className="py-20 text-center font-bold text-gray-500">수정할 게시글이 존재하지 않습니다.</div>;
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result]);
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

    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!placeName.trim()) { alert('장소를 입력해주세요.'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
    if (!tags.length) { alert('해시태그를 입력해주세요.'); return; }

    if (isEditMode) {
      // ✅ 수정 - localStorage에서 해당 게시글 업데이트
      const saved = JSON.parse(localStorage.getItem('hotplacePosts') || '[]');
      const updated = saved.map(p =>
        p.id === Number(id)
          ? { ...p, title, description: content, place: placeName, region: selectedRegion, hashtags: tags, img: imagePreviews[0] || p.img }
          : p
      );
      localStorage.setItem('hotplacePosts', JSON.stringify(updated));
      alert("글이 수정되었습니다!");
      navigate(`/showcase/hotplace/view/${id}`);
    } else {
      // ✅ 새 게시글 저장
      const newPost = {
        id: Date.now(),
        title,
        description: content,
        author: '나',
        place: placeName,
        region: selectedRegion,
        regDt: new Date().toISOString().slice(0, 10),
        viewCnt: 0,
        wishCnt: 0,
        commentCnt: 0,
        hashtags: tags,
        img: imagePreviews[0] || `https://picsum.photos/seed/${Date.now()}/720/720`,
        images: imagePreviews,
        size: 'square',
      };
      saveUserPost(newPost);
      alert("글이 등록되었습니다!");
      navigate("/showcase/hotplace");
    }
  };

  return (
    <div className="container py-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-8 py-6">
          <h2 className="fs-down-4 font-bold text-gray-800">
            {isEditMode ? "핫플거리 수정하기" : "핫플거리 작성하기"}
          </h2>
          <p className="fs-down-1 text-gray-400 mt-1">
            {isEditMode ? "작성한 경기도 여행 순간을 수정해보세요." : "나만의 경기도 여행 순간을 기록해 보세요."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* 지역 및 장소 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label id="region-label" className="block fs-down-2 font-bold text-gray-700 mb-3">방문 지역</label>
              <button type="button" aria-labelledby="region-label" aria-haspopup="listbox" aria-expanded={isRegionOpen}
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="w-full h-[3rem] px-[1rem] text-[1rem] border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#009277] transition-all">
                <span className={selectedRegion ? "text-gray-900" : "text-gray-400"}>{selectedRegion || "지역 선택"}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isRegionOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isRegionOpen && (
                <div role="listbox" className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {gyeonggiRegions.map((region) => (
                    <div key={region} role="option" aria-selected={selectedRegion === region}
                      className="px-4 py-3 hover:bg-[#f0f9f7] hover:text-[#009277] cursor-pointer text-gray-700 transition-colors"
                      onClick={() => { setSelectedRegion(region); setIsRegionOpen(false); }}>
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="placeName" className="block fs-down-2 font-bold text-gray-700 mb-3">구체적인 장소</label>
              <TextInput id="placeName" value={placeName} onChange={(e) => setPlaceName(e.target.value)}
                placeholder="예: 화성행궁, 두물머리" required />
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block fs-down-2 font-bold text-gray-700 mb-3">제목</label>
            <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요" required />
          </div>

          {/* 사진 등록 */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <label className="block fs-down-2 font-bold text-gray-700">사진 등록</label>

              {/* 👉 사진 추가 버튼을 제목 줄 오른쪽으로 이동 */}
              <label className="w-40 h-12 shrink-0 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <p className="fs-down-2 font-semibold text-gray-400">사진 추가</p>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
              </label>
            </div>

            {/* 👉 사진 리스트 영역 */}
            <div className="w-full">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
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
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block fs-down-2 font-bold text-gray-700 mb-3">내용</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-blue-400 transition-colors">
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                rows="15" placeholder="경기도 여행의 추억을 담아보세요."
                className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed" required />
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label htmlFor="tagInput" className="block text-em font-bold text-gray-700 mb-3">태그 설정</label>
            <div className="w-full flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) => (
                <span key={index} className="bg-[#f0f9f7] text-[#009277] px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 shadow-sm">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))} className="ml-1 hover:text-red-500">×</button>
                </span>
              ))}
              <TextInput id="tagInput" value={tagInput} size="md"
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "태그 입력 후 엔터" : ""}
                inputClassName="text-em" />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all">취소</button>
            <button type="submit"
              className="px-6 py-2.5 bg-[#009277] text-white font-semibold rounded-lg hover:bg-[#007a63] shadow-md transition-all">
              {isEditMode ? "수정하기" : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityHotplaceWrite;