import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllLifePosts, saveUserLifePost, TYPE_LABEL, TYPE_COLOR } from "./communityLifeData";

const gyeonggiRegions = [
  "수원시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시",
  "시흥시", "파주시", "의정부시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시",
  "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시",
  "가평군", "과천시", "연천군",
];

const COURSE_TYPES = ['see', 'food', 'sleep', 'play'];

const defaultCourseItem = () => ({
  order: 1,
  name: '',
  address: '',
  type: 'see',
  image: '',
  desc: '',
});

const CommunityLifeWrite = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const currentPost = isEditMode ? getAllLifePosts().find(p => p.id === Number(id)) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [course, setCourse] = useState([{ ...defaultCourseItem() }]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  useEffect(() => {
    if (!isEditMode || !currentPost) return;
    setTitle(currentPost.title);
    setContent(currentPost.description);
    setSelectedRegion(currentPost.region || '');
    setThumbnail(currentPost.thumbnail || '');
    setTags(currentPost.hashtags || []);
    setCourse(currentPost.course || [{ ...defaultCourseItem() }]);
  }, [isEditMode, currentPost]);

  if (isEditMode && !currentPost) {
    return <div className="py-20 text-center font-bold text-gray-500">수정할 게시글이 존재하지 않습니다.</div>;
  }

  // 코스 아이템 추가
  const addCourseItem = () => {
    setCourse(prev => [...prev, { ...defaultCourseItem(), order: prev.length + 1 }]);
  };

  // 코스 아이템 삭제
  const removeCourseItem = (idx) => {
    setCourse(prev => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i + 1 })));
  };

  // 코스 아이템 변경
  const updateCourseItem = (idx, field, value) => {
    setCourse(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  // 태그
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // 썸네일
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!selectedRegion) { alert('지역을 선택해주세요.'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
    if (course.some(c => !c.name.trim())) { alert('코스 장소명을 모두 입력해주세요.'); return; }

    if (isEditMode) {
      const saved = JSON.parse(localStorage.getItem('lifePosts') || '[]');
      const updated = saved.map(p =>
        p.id === Number(id)
          ? { ...p, title, description: content, region: selectedRegion, hashtags: tags, thumbnail, course }
          : p
      );
      localStorage.setItem('lifePosts', JSON.stringify(updated));
      alert('수정되었습니다!');
      navigate(`/showcase/life/view/${id}`);
    } else {
      const newPost = {
        id: Date.now(),
        title,
        author: '나',
        region: selectedRegion,
        regDt: new Date().toISOString().slice(0, 10),
        viewCnt: 0,
        wishCnt: 0,
        commentCnt: 0,
        hashtags: tags,
        thumbnail: thumbnail || `https://picsum.photos/seed/${Date.now()}/800/400`,
        description: content,
        course,
      };
      saveUserLifePost(newPost);
      alert('등록되었습니다!');
      navigate('/showcase/life');
    }
  };

  return (
    <div className="container py-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b px-8 py-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? '인생거리 수정하기' : '인생거리 작성하기'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">나만의 인생 여행 코스를 공유해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* 지역 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-3">여행 지역</label>
              <button type="button" onClick={() => setIsRegionOpen(!isRegionOpen)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white flex justify-between items-center focus:border-[#0F9B73] transition">
                <span className={selectedRegion ? 'text-gray-900' : 'text-gray-400'}>{selectedRegion || '지역 선택'}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isRegionOpen && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {gyeonggiRegions.map((region) => (
                    <div key={region} onClick={() => { setSelectedRegion(region); setIsRegionOpen(false); }}
                      className="px-4 py-3 hover:bg-green-50 hover:text-[#0F9B73] cursor-pointer text-sm text-gray-700 transition">
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">제목</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="여행 코스 제목을 입력해주세요"
                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition" />
            </div>
          </div>

          {/* 대표 이미지 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">이미지 가져오기</label>
            {thumbnail && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 border">
                <img src={thumbnail} alt="썸네일" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setThumbnail('')}
                  className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center">✕</button>
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center text-gray-400">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm">대표 이미지 추가</p>
              </div>
              <input type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
            </label>
          </div>

          {/* 본문 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">여행 이야기</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-[#0F9B73] transition">
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                rows="12" placeholder="여행의 이야기를 자유롭게 적어주세요."
                className="w-full px-4 py-4 outline-none resize-none text-gray-700 leading-relaxed text-base" />
            </div>
          </div>

          {/* ✅ 여행 코스 등록 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-700">여행 코스 등록</label>
              <button type="button" onClick={addCourseItem}
                className="px-4 py-2 bg-[#0F9B73] text-white text-xs font-semibold rounded-lg hover:bg-[#0d8a66] transition">
                + 장소 추가
              </button>
            </div>

            <div className="space-y-4">
              {course.map((c, idx) => (
                <div key={idx} className="flex gap-3">
                  {/* 순서 */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0F9B73] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    {idx < course.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>

                  {/* 입력 폼 */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">장소명 *</label>
                        <input value={c.name} onChange={(e) => updateCourseItem(idx, 'name', e.target.value)}
                          placeholder="예) 화성행궁"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition bg-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">카테고리</label>
                        <select value={c.type} onChange={(e) => updateCourseItem(idx, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition bg-white">
                          {COURSE_TYPES.map(t => (
                            <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">주소</label>
                      <input value={c.address} onChange={(e) => updateCourseItem(idx, 'address', e.target.value)}
                        placeholder="예) 경기도 수원시 팔달구 행궁로 11"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">장소 설명</label>
                      <input value={c.desc} onChange={(e) => updateCourseItem(idx, 'desc', e.target.value)}
                        placeholder="이 장소에 대해 간단히 설명해주세요"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">이미지 URL (선택)</label>
                      <input value={c.image} onChange={(e) => updateCourseItem(idx, 'image', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0F9B73] transition bg-white" />
                    </div>

                    {/* 삭제 버튼 */}
                    {course.length > 1 && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => removeCourseItem(idx)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100 transition">
                          이 장소 삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">태그</label>
            <div className="w-full flex flex-wrap gap-2 items-center border border-gray-200 rounded-lg p-3 focus-within:border-[#0F9B73] transition">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-green-50 text-[#0F9B73] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-red-500">×</button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? '태그 입력 후 엔터' : ''}
                className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 bg-transparent" />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition">취소</button>
            <button type="submit"
              className="px-6 py-2.5 bg-[#0F9B73] text-white font-semibold rounded-lg hover:bg-[#0d8a66] shadow-md transition">
              {isEditMode ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityLifeWrite;