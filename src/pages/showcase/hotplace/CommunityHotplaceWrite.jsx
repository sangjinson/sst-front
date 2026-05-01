import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "@modules/form/TextInput";
import { getAllPosts, saveUserPost, gyeonggiRegions } from "./communityHotplaceData";
import RegionSelect from "@components/modules/community/hotplace/RegionSelect";
import TagInput from "@components/modules/community/write/TagInput";
import ImageUpload from "@components/modules/community/write/ImageUpload";

// 공통 글쓰기 폼
import WriteForm from "@components/modules/community/write/WriteForm";

const CommunityHotplaceWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

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

    const trimmedTag = tagInput.trim();
    const finalTags = trimmedTag && !tags.includes(trimmedTag)
      ? [...tags, trimmedTag]
      : tags;

    if (!selectedRegion || selectedRegion.trim() === "") {
      alert("지역을 선택해주세요.");
      return;
    }
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!placeName.trim()) { alert("장소를 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    if (!finalTags.length) { alert("해시태그를 입력해주세요."); return; }

    if (isEditMode) {
      const saved = JSON.parse(localStorage.getItem("hotplacePosts") || "[]");
      const updated = saved.map((p) =>
        p.id === Number(id)
          ? {
              ...p,
              title,
              description: content,
              place: placeName,
              region: selectedRegion,
              hashtags: finalTags,
              img: imagePreviews[0] || p.img,
              images: imagePreviews,
            }
          : p
      );
      localStorage.setItem("hotplacePosts", JSON.stringify(updated));
      alert("글이 수정되었습니다!");
      navigate(`/showcase/hotplace/view/${id}`);
    } else {
      const newPost = {
        id: Date.now(),
        title,
        description: content,
        author: "나",
        place: placeName,
        region: selectedRegion,
        regDt: new Date().toISOString().slice(0, 10),
        viewCnt: 0,
        wishCnt: 0,
        commentCnt: 0,
        hashtags: finalTags,
        img: imagePreviews[0] || `https://picsum.photos/seed/${Date.now()}/720/720`,
        images: imagePreviews,
        size: "square",
      };
      saveUserPost(newPost);
      alert("글이 등록되었습니다!");
      navigate("/showcase/hotplace");
    }
  };

  return (
    <WriteForm
      titleText={isEditMode ? "핫플거리 수정하기" : "핫플거리 작성하기"}
      descriptionText={isEditMode ? "작성한 경기도 여행 순간을 수정해보세요." : "나만의 경기도 여행 순간을 기록해 보세요."}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      submitText={isEditMode ? "수정하기" : "등록하기"}
    >
      {/* 지역 및 장소 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RegionSelect
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isRegionOpen={isRegionOpen}
          setIsRegionOpen={setIsRegionOpen}
          regions={gyeonggiRegions}
        />

        <div>
          <label htmlFor="placeName" className="block fs-down-2 font-bold text-gray-700 mb-3">구체적인 장소</label>
          <TextInput
            id="placeName"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="예: 화성행궁, 두물머리"
            required
            size="lg"
          />
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block fs-down-2 font-bold text-gray-700 mb-3">제목</label>
        <TextInput
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          required
          inputClassName="fs-down-1"
        />
      </div>

      {/* 사진 등록 */}
      <ImageUpload
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        handleImageChange={handleImageChange}
      />

      {/* 내용 */}
      <div>
        <label className="block fs-down-2 font-bold text-gray-700 mb-3">내용</label>
        <div className="fs-down-2 border border-gray-200 rounded-lg  overflow-hidden shadow-sm focus-within:border-blue-400 transition-colors">
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

      {/* 태그 */}
      <TagInput
        tags={tags}
        setTags={setTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        handleTagKeyDown={handleTagKeyDown}
      />
    </WriteForm>
  );
};

export default CommunityHotplaceWrite;