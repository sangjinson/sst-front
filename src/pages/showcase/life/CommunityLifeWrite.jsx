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

// ✅ 내 일정 선택 모달 - 일정 클릭 시 장소 전부 가져오기
const SchedulePickerModal = ({ onClose, onSelect }) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedTrips') || '[]');
    setSchedules(saved);
  }, []);

  const handleTripClick = (trip) => {
    const allPlaces = (trip.schedule || []).flat();
    onSelect(allPlaces, trip.region || '');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] mx-4 flex flex-col max-h-[70vh]">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">내 일정에서 가져오기</h3>
            <p className="text-xs text-gray-400 mt-0.5">일정을 선택하면 장소가 자동으로 추가돼요</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">✕</button>
        </div>

        {/* 일정 목록 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm font-medium">저장된 일정이 없습니다.</p>
              <p className="text-xs mt-1 text-gray-300">내거리에서 일정을 먼저 만들어보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedules.map(trip => {
                const placeCount = (trip.schedule || []).flat().length;
                return (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => handleTripClick(trip)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#0F9B73] hover:bg-green-50 transition text-left group"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#0F9B73]/10 flex items-center justify-center text-xl shrink-0 group-hover:bg-[#0F9B73]/20 transition">
                      📍
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{trip.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{trip.region}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{trip.period}</span>
                        {trip.startDate && (
                          <>
                            <span className="text-gray-200">·</span>
                            <span className="text-xs text-gray-400">{trip.startDate}~{trip.endDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-semibold text-[#0F9B73]">장소 {placeCount}개</span>
                      <span className="text-xs text-gray-400 group-hover:text-[#0F9B73] transition">전체 가져오기 →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────
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
  const [course, setCourse] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  useEffect(() => {
    if (!isEditMode || !currentPost) return;
    setTitle(currentPost.title);
    setContent(currentPost.description);
    setSelectedRegion(currentPost.region || '');
    setThumbnail(currentPost.thumbnail || '');
    setTags(currentPost.hashtags || []);
    setCourse(currentPost.course || []);
  }, [isEditMode, currentPost]);

  if (isEditMode && !currentPost) {
    return <div className="py-20 text-center font-bold text-gray-500">수정할 게시글이 존재하지 않습니다.</div>;
  }

  // ✅ 모달에서 일정 선택 시 장소 전부 추가
  const handleSelectPlaces = (allPlaces, region) => {
    const newCourse = allPlaces.map((item, i) => ({
      order: course.length + i + 1,
      name: item.name || '',
      address: item.address || '',
      type: item.type || 'see',
      image: item.image || '',
      desc: item.desc || item.description || '',
    }));
    setCourse(prev => [...prev, ...newCourse]);
    if (!selectedRegion && region) setSelectedRegion(region);
  };

  const removeCourseItem = (idx) => {
    setCourse(prev => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, order: i + 1 })));
  };

  const updateCourseItem = (idx, field, value) => {
    setCourse(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

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
    if (course.length === 0) { alert('일정에서 장소를 가져와주세요.'); return; }

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
    <>
      {showModal && (
        <SchedulePickerModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelectPlaces}
        />
      )}

      <div className="container py-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b px-8 py-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? '인생거리 수정하기' : '인생거리 작성하기'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">나만의 인생 여행 코스를 공유해보세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* 지역 + 제목 */}
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
                  <p className="text-sm">이미지 추가</p>
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

            {/* ✅ 여행 코스 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">
                  여행 코스
                  <span className="ml-2 text-xs text-gray-400 font-normal">내 일정에서 장소를 가져와주세요</span>
                </label>
                <button type="button" onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-[#0F9B73] text-white text-xs font-semibold rounded-lg hover:bg-[#0d8a66] transition flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  내 일정에서 가져오기
                </button>
              </div>

              {course.length === 0 ? (
                <div onClick={() => setShowModal(true)}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#0F9B73] hover:bg-green-50 transition">
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-sm font-semibold text-gray-500">내 일정에서 장소를 가져오세요</p>
                  <p className="text-xs text-gray-400 mt-1">클릭하면 내 여행 일정 목록이 열려요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.map((c, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#0F9B73] text-white text-sm font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        {idx < course.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[12px]" />}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex gap-3">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xl shrink-0">
                            {c.type === 'food' ? '🍽' : c.type === 'sleep' ? '🛏' : c.type === 'play' ? '🎡' : '🏛'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[c.type]}`}>
                              {TYPE_LABEL[c.type]}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{c.name}</p>
                          {c.address && <p className="text-xs text-gray-400 mt-0.5 truncate">{c.address}</p>}
                          <input
                            value={c.desc}
                            onChange={(e) => updateCourseItem(idx, 'desc', e.target.value)}
                            placeholder="장소 설명을 입력해주세요 (선택)"
                            className="mt-1.5 w-full px-2 py-1 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0F9B73] bg-white transition"
                          />
                        </div>
                        <button type="button" onClick={() => removeCourseItem(idx)}
                          className="shrink-0 self-start p-1.5 text-gray-300 hover:text-red-400 transition">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={() => setShowModal(true)}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 hover:border-[#0F9B73] hover:text-[#0F9B73] transition">
                    + 다른 일정에서 더 가져오기
                  </button>
                </div>
              )}
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
    </>
  );
};

export default CommunityLifeWrite;