import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "@api/axios";
import { useAuth } from "@hooks/useAuth";

import TextInput from "@modules/form/TextInput";
import RegionSelect from "@components/modules/community/write/RegionSelect";
import TagInput from "@components/modules/community/write/TagInput";
import ImageUpload from "@components/modules/community/write/ImageUpload";
import WriteForm from "@components/modules/community/write/WriteForm";
import SchedulePickerModal from "@components/modules/community/life/SchedulePickerModal";
import CourseSection from "@components/modules/community/life/CourseSection";

const BASE_URL = import.meta.env.VITE_API_URL;

const CommunityLifeWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 화면 미리보기용 이미지
  const [imagePreviews, setImagePreviews] = useState([]);

  // 새로 선택한 실제 파일
  const [imageFiles, setImageFiles] = useState([]);

  // 수정 모드에서 기존 서버 이미지 경로
  const [existingImageUrls, setExistingImageUrls] = useState([]);

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
  const [isComposing, setIsComposing] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:")) return url;
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const getServerPath = (url) => {
    if (!url) return "";
    if (url.startsWith(BASE_URL)) {
      return url.replace(BASE_URL, "");
    }
    return url;
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

        let serverImages = [];

        if (item.images?.length > 0) {
          serverImages = item.images.map((img) =>
            typeof img === "string" ? img : img.filePath
          );
        } else if (item.commMainImgUrl) {
          serverImages = [item.commMainImgUrl];
        }

        setExistingImageUrls(serverImages);
        setImagePreviews(serverImages.map(getImageUrl));

        setTitle(item.commTitle || "");
        setContent(item.commContent || "");
        setTags(item.hashtagText ? item.hashtagText.split(",") : []);

        if (item.commAisNo) {
          setSelectedSchedule({ aisNo: item.commAisNo });
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const handleRemoveImage = (removeIndex) => {
    const removePreview = imagePreviews[removeIndex];

    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== removeIndex)
    );

    if (removePreview.startsWith(BASE_URL)) {
      const serverPath = getServerPath(removePreview);

      setExistingImageUrls((prev) =>
        prev.filter((url) => url !== serverPath)
      );

      return;
    }

    const existingCount = existingImageUrls.length;
    const fileIndex = removeIndex - existingCount;

    if (fileIndex >= 0) {
      setImageFiles((prev) =>
        prev.filter((_, index) => index !== fileIndex)
      );
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
      dayNo: item.dayNo,
    }));

    setCourse(newCourse);
    setSelectedSchedule(schedule);

    if (schedule?.aisSchdulName && !title) {
      setTitle(schedule.aisSchdulName);
    }
  };

  // 리스트에서 코스 공유하기를 통해 넘어온 일정 자동 반영
  useEffect(() => {
    if (isEditMode) return;

    const selectedPlaces = location.state?.selectedPlaces;
    const selectedSchedule = location.state?.selectedSchedule;

    if (!selectedPlaces || !selectedSchedule) return;

    handleSelectPlaces(selectedPlaces, selectedSchedule);

    if (selectedSchedule?.aisSchdulName) {
      setTitle(selectedSchedule.aisSchdulName);
    }
  }, [location.state, isEditMode]);

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

  const normalizeTag = (tag) =>
    tag
      .trim()
      .replace(/^#/, "")
      .replace(/\s+/g, "");

  const parseTags = (value) =>
    value
      .split(/[,\s#]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);

  const handleTagKeyDown = (e) => {
    if (isComposing || e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();

      const nextTags = parseTags(tagInput);

      setTags((prev) => [
        ...new Set([
          ...prev,
          ...nextTags.map(normalizeTag),
        ]),
      ]);

      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const createFormData = (payload) => {
    const formData = new FormData();

    formData.append(
      "community",
      new Blob([JSON.stringify(payload)], {
        type: "application/json",
      })
    );

    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalTags = Array.from(
      new Set(
        [...tags, ...parseTags(tagInput)]
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

    const payload = {
      commTitle: title,
      commContent: content,
      commCatCd: "CMM001",
      commAisNo: selectedSchedule?.aisNo,
      commPlcNo: null,
      commMbrId: user.mbrId,
      hashtags: finalTags,

      existingImageUrls,
      commMainImgUrl: existingImageUrls[0] || "",
    };

    const formData = createFormData(payload);

    try {
      if (isEditMode) {
        await api.put(`/community/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("글이 수정되었습니다!");
        navigate(`/showcase/life/view/${id}`);
        return;
      }

      await api.post("/community", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("글이 등록되었습니다!");
      navigate("/showcase/life");
    } catch (err) {
      console.error(
        isEditMode ? "인생거리 수정 실패:" : "인생거리 등록 실패:",
        err
      );
      alert(isEditMode ? "글 수정에 실패했습니다." : "글 등록에 실패했습니다.");
    }
  };

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
              rows="10"
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
          setIsComposing={setIsComposing}
        />
      </WriteForm>
    </>
  );
};

export default CommunityLifeWrite;