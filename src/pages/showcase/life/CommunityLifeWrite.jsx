import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TextInput from "@modules/form/TextInput";
import RegionSelect from "@components/modules/community/hotplace/RegionSelect";
import TagInput from "@components/modules/community/write/TagInput";
import ImageUpload from "@components/modules/community/write/ImageUpload";
import WriteForm from "@components/modules/community/write/WriteForm";
import SchedulePickerModal from "@components/modules/community/life/SchedulePickerModal";
import CourseSection from "@components/modules/community/life/CourseSection";

import {
  getAllLifePosts,
  saveUserLifePost,
  gyeonggiRegions,
} from "./communityLifeData";

const CommunityLifeWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const currentPost = isEditMode
    ? getAllLifePosts().find((post) => post.id === Number(id))
    : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [course, setCourse] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!isEditMode || !currentPost) return;

    setTitle(currentPost.title || "");
    setContent(currentPost.description || "");
    setTags(currentPost.hashtags || []);
    setSelectedRegion(currentPost.region || "");
    setCourse(currentPost.course || []);
    setImagePreviews(
      currentPost.images ||
        (currentPost.thumbnail ? [currentPost.thumbnail] : [])
    );
  }, [isEditMode, currentPost]);

  if (isEditMode && !currentPost) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        수정할 게시글이 존재하지 않습니다.
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleSelectPlaces = (allPlaces, region) => {
    const newCourse = allPlaces.map((item, i) => ({
      order: course.length + i + 1,
      name: item.name || "",
      address: item.address || "",
      type: item.type || "see",
      image: item.image || "",
      desc: item.desc || item.description || "",
    }));

    setCourse((prev) => [...prev, ...newCourse]);

    if (!selectedRegion && region) {
      setSelectedRegion(region);
    }
  };

  const removeCourseItem = (idx) => {
    setCourse((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((c, i) => ({ ...c, order: i + 1 }))
    );
  };

  const updateCourseItem = (idx, field, value) => {
    setCourse((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
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
    const finalTags =
      trimmedTag && !tags.includes(trimmedTag)
        ? [...tags, trimmedTag]
        : tags;

    if (!selectedRegion || selectedRegion.trim() === "") {
      alert("지역을 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (course.length === 0) {
      alert("일정에서 장소를 가져와주세요.");
      return;
    }

    if (!finalTags.length) {
      alert("해시태그를 입력해주세요.");
      return;
    }

    if (isEditMode) {
      const saved = JSON.parse(localStorage.getItem("lifePosts") || "[]");

      const updated = saved.map((p) =>
        p.id === Number(id)
          ? {
              ...p,
              title,
              description: content,
              region: selectedRegion,
              hashtags: finalTags,
              thumbnail: imagePreviews[0] || p.thumbnail,
              images: imagePreviews,
              course,
            }
          : p
      );

      localStorage.setItem("lifePosts", JSON.stringify(updated));
      alert("글이 수정되었습니다!");
      navigate(`/showcase/life/view/${id}`);
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      description: content,
      author: "나",
      region: selectedRegion,
      regDt: new Date().toISOString().slice(0, 10),
      viewCnt: 0,
      wishCnt: 0,
      commentCnt: 0,
      hashtags: finalTags,
      thumbnail:
        imagePreviews[0] || `https://picsum.photos/seed/${Date.now()}/800/400`,
      images: imagePreviews,
      course,
    };

    saveUserLifePost(newPost);

    alert("글이 등록되었습니다!");
    navigate("/showcase/life");
  };

  return (
    <>
      {showModal && (
        <SchedulePickerModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelectPlaces}
        />
      )}

      <WriteForm
        titleText={isEditMode ? "인생거리 수정하기" : "인생거리 작성하기"}
        descriptionText={
          isEditMode
            ? "작성한 인생 여행 코스를 수정해보세요."
            : "나만의 인생 여행 코스를 공유해보세요."
        }
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitText={isEditMode ? "수정하기" : "등록하기"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegionSelect
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            isRegionOpen={isRegionOpen}
            setIsRegionOpen={setIsRegionOpen}
            regions={gyeonggiRegions}
          />

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
              placeholder="여행 코스 제목을 입력해주세요"
              required
              inputClassName="fs-down-1"
            />
          </div>
        </div>

        <ImageUpload
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          handleImageChange={handleImageChange}
        />

        <div>
          <label className="block fs-down-2 font-bold text-gray-700 mb-3">
            여행 이야기
          </label>

          <div className="fs-down-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-[#0F9B73] transition-colors">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="15"
              placeholder="여행의 이야기를 자유롭게 적어주세요."
              className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed"
              // required
            />
          </div>
        </div>

        <CourseSection
          course={course}
          onOpenModal={() => setShowModal(true)}
          onRemoveCourseItem={removeCourseItem}
          onUpdateCourseItem={updateCourseItem}
        />

        <TagInput
          tags={tags}
          setTags={setTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          handleTagKeyDown={handleTagKeyDown}
        />
      </WriteForm>
    </>
  );
};

export default CommunityLifeWrite;