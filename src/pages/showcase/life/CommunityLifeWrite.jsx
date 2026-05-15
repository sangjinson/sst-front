import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@api/axios";
import { useAuth } from "@hooks/useAuth";

import TextInput from "@modules/form/TextInput";
import RegionSelect from "@components/modules/community/write/RegionSelect";
import TagInput from "@components/modules/community/write/TagInput";
import ImageUpload from "@components/modules/community/write/ImageUpload";
import WriteForm from "@components/modules/community/write/WriteForm";
import SchedulePickerModal from "@components/modules/community/life/SchedulePickerModal";
import CourseSection from "@components/modules/community/life/CourseSection";

const CommunityLifeWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [importedSchedule, setImportedSchedule] = useState(null);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [course, setCourse] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [regions, setRegions] = useState([]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    api
      .get("/regions")
      .then((res) => {
        setRegions(res.data);
      })
      .catch((err) => {
        console.error("지역 목록 조회 실패:", err);
      });
  }, []);

  useEffect(() => {
    if (!user?.mbrId) return;

    api
      .get("/community/life/schedules", {
        params: {
          mbrId: user.mbrId,
        },
      })
      .then((res) => {
        setSchedules(res.data);
      })
      .catch((err) => {
        console.error("내 AI 일정 목록 조회 실패:", err);
      });
  }, [user]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchEditPost = async () => {
      try {
        const res = await api.get(`/community/${id}`);
        const item = res.data;

        if (item.images?.length > 0) {
          setImagePreviews(item.images.map(getImageUrl));
        } else if (item.commMainImgUrl) {
          setImagePreviews([getImageUrl(item.commMainImgUrl)]);
        }

        setTitle(item.commTitle || "");
        setContent(item.commContent || "");
        setTags(item.hashtagText ? item.hashtagText.split(",") : []);
        setSelectedSchedule({ aisNo: item.commAisNo });

        if (item.commAisNo) {
          setImportedSchedule({ aisNo: item.commAisNo });

          const placeRes = await api.get(
            `/community/life/schedules/${item.commAisNo}/places`
          );

          const firstAddress =
            placeRes.data?.[0]?.address ||
            placeRes.data?.[0]?.plcAddress ||
            "";

          setSelectedRegion({
            rgnCd: item.rgnCd,
            rgnName:
              item.rgnName ||
              firstAddress.split(" ")?.[1] ||
              firstAddress.split(" ")?.[0] ||
              "지역 정보 없음",
          });

          const mappedCourse = placeRes.data.map((place, index) => ({
            order: index + 1,
            name: place.name || place.plcName || "",
            address: place.address || place.plcAddress || "",
            type: place.type || place.plcType || "see",
            image: place.image || place.plcImgUrl || "",
            desc: place.desc || place.description || "",
            dayNo: place.dayNo,
          }));

          setCourse(mappedCourse);
        }
      } catch (err) {
        console.error("인생거리 수정 데이터 조회 실패:", err);
      }
    };

    fetchEditPost();
  }, [isEditMode, id]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/community/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedUrls.push(`http://localhost:8080${res.data}`);
      }

      setImagePreviews((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveImage = async (removeIndex) => {
    const imageUrl = imagePreviews[removeIndex];

    try {
      await api.delete("/community/image", {
        params: {
          imageUrl: imageUrl.replace("http://localhost:8080", ""),
        },
      });

      setImagePreviews((prev) =>
        prev.filter((_, index) => index !== removeIndex)
      );
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      alert("이미지 삭제에 실패했습니다.");
    }
  };

  const handleSelectPlaces = (allPlaces, schedule) => {
    setImportedSchedule(schedule);

    const scheduleRegionName =
      schedule?.rgnName ||
      schedule?.region ||
      schedule?.aisRgnName ||
      allPlaces?.[0]?.rgnName ||
      allPlaces?.[0]?.region ||
      allPlaces?.[0]?.address?.split(" ")?.[1] ||
      "";

    const scheduleRegionCd =
      schedule?.rgnCd ||
      schedule?.rgnNo ||
      allPlaces?.[0]?.rgnCd ||
      allPlaces?.[0]?.rgnNo ||
      "";

    const matchedRegion = regions.find(
      (region) => region.rgnName === scheduleRegionName
    );

    setSelectedRegion({
      rgnCd: matchedRegion?.rgnCd || scheduleRegionCd,
      rgnName: scheduleRegionName,
    });

    const newCourse = allPlaces.map((item, i) => ({
      order: i + 1,
      name: item.name || "",
      address: item.address || "",
      type: item.type || "see",
      image: item.image || "",
      desc: item.desc || "",
      dayNo: item.dayNo,
    }));

    setCourse(newCourse);
    setSelectedSchedule(schedule);

    if (schedule?.aisSchdulName && !title) {
      setTitle(schedule.aisSchdulName);
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

  // 해시태그 공백, # 제거
  const normalizeTag = (tag) =>
    tag
      .trim()
      .replace(/^#/, "")
      .replace(/\s+/g, "");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      const trimmedTag = normalizeTag(tagInput);
      const normalizedTags = tags.map(normalizeTag);

      if (trimmedTag && !normalizedTags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput("");
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTag = normalizeTag(tagInput);

    const finalTags = Array.from(
      new Set(
        [...tags, trimmedTag]
          .map(normalizeTag)
          .filter(Boolean)
      )
    );

    if (!selectedRegion?.rgnCd && !selectedRegion?.rgnName) {
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
      const payload = {
        commTitle: title,
        commContent: content,
        commCatCd: "CMM001",
        commAisNo: selectedSchedule?.aisNo,
        commPlcNo: null,

        commMainImgUrl: imagePreviews[0]
          ? imagePreviews[0].replace("http://localhost:8080", "")
          : "",

        commMbrId: user.mbrId,
        hashtags: finalTags,

        files: imagePreviews.map((url) => {
          const path = url.replace("http://localhost:8080", "");
          const saveName = path.split("/").pop();

          return {
            fileOrgNm: saveName,
            fileSaveNm: saveName,
            filePath: path,
            fileExt: saveName.split(".").pop(),
            fileSize: 0,
            fileMimeType: "image/png",
            fileType: "IMAGE",
          };
        }),
      };

      try {
        await api.put(`/community/${id}`, payload);

        alert("글이 수정되었습니다!");
        navigate(`/showcase/life/view/${id}`);
      } catch (err) {
        console.error("인생거리 수정 실패:", err);
        alert("글 수정에 실패했습니다.");
      }

      return;
    }

    try {
      const payload = {
        commTitle: title,
        commContent: content,
        commCatCd: "CMM001",
        commAisNo: selectedSchedule?.aisNo,
        commPlcNo: null,

        commMainImgUrl: imagePreviews[0]
          ? imagePreviews[0].replace("http://localhost:8080", "")
          : "",

        commMbrId: user.mbrId,
        hashtags: finalTags,

        files: imagePreviews.map((url) => {
          const path = url.replace("http://localhost:8080", "");
          const saveName = path.split("/").pop();

          return {
            fileOrgNm: saveName,
            fileSaveNm: saveName,
            filePath: path,
            fileExt: saveName.split(".").pop(),
            fileSize: 0,
            fileMimeType: "image/png",
            fileType: "IMAGE",
          };
        }),
      };

      await api.post("/community", payload);

      alert("글이 등록되었습니다!");
      navigate("/showcase/life");
    } catch (err) {
      console.error("인생거리 등록 실패:", err);
      alert("글 등록에 실패했습니다.");
    }}

  return (
    <>
      {showModal && (
        <SchedulePickerModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelectPlaces}
          schedules={schedules}
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
            regions={regions}
            disabled={!!importedSchedule}
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
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
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