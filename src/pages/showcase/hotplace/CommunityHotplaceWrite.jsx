import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextInput from "@modules/form/TextInput";
import { gyeonggiRegions } from "./communityHotplaceData";
import RegionSelect from "@components/modules/community/hotplace/RegionSelect";
import TagInput from "@components/modules/community/write/TagInput";
import ImageUpload from "@components/modules/community/write/ImageUpload";
import api from "@api/axios";
import { useAuth } from "@hooks/useAuth";

// 공통 글쓰기 폼
import WriteForm from "@components/modules/community/write/WriteForm";

const CommunityHotplaceWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const [loading, setLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
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
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/community/${id}`);
        const post = res.data;

        const imageUrl = post.commMainImgUrl
          ? post.commMainImgUrl.startsWith("http")
            ? post.commMainImgUrl
            : `http://localhost:8080${post.commMainImgUrl}`
          : "";

        setTitle(post.commTitle || "");
        setContent(post.commContent || "");
        setImagePreviews(imageUrl ? [imageUrl] : []);

        // 아직 DB에 지역/장소/해시태그 컬럼이 없어서 임시 기본값
        setPlaceName("");
        setSelectedRegion("");
        setTags(post.hashtagText ? post.hashtagText.split(",") : []);
      } catch (error) {
        console.error("수정 게시글 조회 실패:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [isEditMode, id]);

  if (loading) {
    return <div className="py-20 text-center font-bold text-gray-500">게시글을 불러오는 중입니다.</div>;
  }

  if (notFound) {
    return <div className="py-20 text-center font-bold text-gray-500">수정할 게시글이 존재하지 않습니다.</div>;
  }

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

  const handleSubmit = async(e) => {
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
      const payload = {
        commTitle: title,
        commContent: content,
        commMainImgUrl: imagePreviews[0]
          ? imagePreviews[0].replace("http://localhost:8080", "")
          : "",
        hashtags: finalTags,

        files: imagePreviews.map((url, index) => {
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
        // 게시글 수정 요청
        await api.put(`/community/${id}`, payload);
        alert("글이 수정되었습니다!");
        // 수정 완료 후 상세페이지 이동
        navigate(`/showcase/hotplace/view/${id}`);
      } catch (error) {
        console.error("글 수정 실패:", error);
        alert("글 수정에 실패했습니다.");
      }
    } else {
      // 로그인 여부 확인
      if (!user?.mbrId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const payload = {
        commMbrId: user.mbrId,
        commCatCd: "CMM002",
        commTitle: title,
        commContent: content,
        commMainImgUrl: imagePreviews[0]
          ? imagePreviews[0].replace("http://localhost:8080", "")
          : "",
        hashtags: finalTags,

        files: imagePreviews.map((url, index) => {
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
        await api.post("/community", payload);

        alert("글이 등록되었습니다!");
        navigate("/showcase/hotplace");
      } catch (error) {
        console.error("글 등록 실패:", error);
        alert("글 등록에 실패했습니다.");
      }
    }
  };

  return (
    <WriteForm
      titleText={isEditMode ? "핫플거리 수정하기" : "핫플거리 작성하기"}
      descriptionText={isEditMode ? "작성한 경기도 여행 순간을 수정해보세요." : "나만의 경기도 여행 순간을 기록해 보세요."}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      submitText={isEditMode ? "수정하기" : "등록하기"}>
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
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage} 
      />

      {/* 내용 */}
      <div>
        <label className="block fs-down-2 font-bold text-gray-700 mb-3">내용</label>
        <div className="fs-down-2 border border-gray-200 rounded-lg  overflow-hidden shadow-sm focus-within:border-[#0F9B73] transition-colors">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15" 
            placeholder="경기도 여행의 추억을 담아보세요."
            className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed"
            // required
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