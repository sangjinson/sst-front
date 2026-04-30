import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "@components/common/Breadcrumb";
import { ClipButton } from "@components/modules/ActionButtons";
import { getAllLifePosts, lifeComments, TYPE_LABEL, TYPE_COLOR } from "./communityLifeData";
import Swal from "sweetalert2";

const CommunityLifeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLogin = true;

  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(lifeComments);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const posts = getAllLifePosts();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return <div className="py-20 text-center font-bold text-gray-500">존재하지 않는 게시물입니다.</div>;
  }

  const viewCount = post.viewCnt + 1;
  const wishCount = post.wishCnt + (isLiked ? 1 : 0);

  // ✅ 내 일정으로 가져오기
  const handleImportSchedule = () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');

    // 코스를 일정 형식으로 변환
    const scheduleItems = post.course.map((c, i) => ({
      id: `life-${post.id}-${c.order}`,
      time: `${9 + i * 2}:00`,
      name: c.name,
      desc: c.desc,
      image: c.image,
      type: c.type,
      region: post.region,
    }));

    const newTrip = {
      id: Date.now(),
      name: post.title,
      region: post.region,
      period: post.course.some(c => c.type === 'sleep') ? '1박2일' : '당일여행',
      startDate: '',
      endDate: '',
      themes: post.hashtags.slice(0, 2),
      schedule: [scheduleItems],
      createdAt: new Date().toISOString(),
      fromLife: true, // 인생거리에서 가져온 일정 표시
    };

    savedTrips.push(newTrip);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));

    Swal.fire({
      icon: 'success',
      title: '내 일정에 추가되었어요!',
      text: '마이페이지 > 내 일정 관리에서 확인할 수 있어요.',
      confirmButtonText: '내 일정 보러가기',
      showCancelButton: true,
      cancelButtonText: '계속 보기',
      confirmButtonColor: '#0F9B73',
      cancelButtonColor: '#9ca3af',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/user/mypage', { state: { tab: 'schedule' } });
      }
    });
  };

  // ✅ 이 코스로 일정 만들기 (savedTrips 없을 때)
  const handleMakePlan = () => {
    const scheduleItems = post.course.map((c, i) => ({
      id: `life-${post.id}-${c.order}`,
      time: `${9 + i * 2}:00`,
      name: c.name,
      desc: c.desc,
      image: c.image,
      type: c.type,
      region: post.region,
    }));

    navigate('/plan/result', {
      state: {
        region: post.region,
        period: post.course.some(c => c.type === 'sleep') ? '1박2일' : '당일여행',
        themes: post.hashtags.slice(0, 2),
        startDate: '',
        endDate: '',
        schedule: [scheduleItems],
      }
    });
  };

  // ✅ 신고
  const handleReport = async () => {
    const result = await Swal.fire({
      title: '신고 사유를 선택해주세요',
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life" value="부적절한 게시글로 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            부적절한 게시글로 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life" value="불법 광고 및 홍보 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            불법 광고 및 홍보 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life" value="기타" id="report-life-etc"
              style="accent-color:#f97316; width:16px; height:16px;"
              onclick="document.getElementById('etc-life-wrap').style.display='block'" />
            기타
          </label>
          <div id="etc-life-wrap" style="display:none; margin-top:4px;">
            <textarea id="etc-life-input" placeholder="기타 신고 내용을 입력해주세요."
              style="width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-size:13px; color:#374151; resize:none; outline:none; height:80px; box-sizing:border-box;"
              onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
          </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: '신고하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#9ca3af',
      preConfirm: () => {
        const selected = document.querySelector('input[name="report-life"]:checked');
        if (!selected) { Swal.showValidationMessage('신고 사유를 선택해주세요.'); return false; }
        if (selected.value === '기타') {
          const etcText = document.getElementById('etc-life-input')?.value?.trim();
          if (!etcText) { Swal.showValidationMessage('기타 신고 내용을 입력해주세요.'); return false; }
          return `기타: ${etcText}`;
        }
        return selected.value;
      },
    });
    if (result.isConfirmed) {
      await Swal.fire({ icon: 'success', title: '신고 완료', text: '신고가 정상적으로 완료되었습니다.', timer: 1500, showConfirmButton: false });
    }
  };

  const handleReportComment = async () => {
    const result = await Swal.fire({
      title: '신고 사유를 선택해주세요',
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life-comment" value="부적절한 댓글로 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            부적절한 댓글로 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life-comment" value="불법 광고 및 홍보 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            불법 광고 및 홍보 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report-life-comment" value="기타" id="report-life-comment-etc"
              style="accent-color:#f97316; width:16px; height:16px;"
              onclick="document.getElementById('etc-life-comment-wrap').style.display='block'" />
            기타
          </label>
          <div id="etc-life-comment-wrap" style="display:none; margin-top:4px;">
            <textarea id="etc-life-comment-input" placeholder="기타 신고 내용을 입력해주세요."
              style="width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-size:13px; color:#374151; resize:none; outline:none; height:80px; box-sizing:border-box;"
              onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
          </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: '신고하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#9ca3af',
      preConfirm: () => {
        const selected = document.querySelector('input[name="report-life-comment"]:checked');
        if (!selected) { Swal.showValidationMessage('신고 사유를 선택해주세요.'); return false; }
        if (selected.value === '기타') {
          const etcText = document.getElementById('etc-life-comment-input')?.value?.trim();
          if (!etcText) { Swal.showValidationMessage('기타 신고 내용을 입력해주세요.'); return false; }
          return `기타: ${etcText}`;
        }
        return selected.value;
      },
    });
    if (result.isConfirmed) {
      await Swal.fire({ icon: 'success', title: '신고 완료', text: '신고가 정상적으로 완료되었습니다.', timer: 1500, showConfirmButton: false });
    }
  };

  // ✅ 댓글 등록
  const handleCommentSubmit = () => {
    if (!newComment.trim()) { alert("댓글 내용을 입력해주세요."); return; }
    setComments([{ id: Date.now(), user: "나", text: newComment, date: new Date().toLocaleDateString() }, ...comments]);
    setNewComment("");
  };

  const startEditing = (commentId, text) => { setEditingId(commentId); setEditText(text); };
  const handleSaveEdit = (commentId) => {
    if (!editText.trim()) { alert("수정할 내용을 입력해주세요."); return; }
    setComments(comments.map((c) => c.id === commentId ? { ...c, text: editText } : c));
    setEditingId(null); setEditText("");
  };
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-6 md:py-10 font-sans">
      <Breadcrumb
        paths={[
          { label: "홈", to: "/" },
          { label: "인생거리", to: "/showcase/life" },
          { label: "상세보기" },
        ]}
        className="mb-4"
      />

      {/* 헤더 */}
      <section className="mb-8 mt-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#0F9B73] pt-2">Life Course Detail</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">인생거리</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">여행자가 직접 만든 인생 코스를 확인해보세요.</p>
        </div>
        <button type="button" onClick={() => navigate("/showcase/life")}
          className="w-fit rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-[#0F9B73] hover:text-[#0F9B73] hover:shadow-sm active:scale-95">
          목록으로
        </button>
      </section>

      {/* 메인 - 네이버 블로그 스타일 */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

        {/* ✅ 왼쪽: 본문 영역 (네이버 블로그 스타일) */}
        <div className="space-y-6">

          {/* 대표 이미지 */}
          <div className="w-full h-[400px] rounded-3xl overflow-hidden">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* 제목 + 메타 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 bg-[#f0fdf9] text-[#0F9B73] text-xs font-semibold rounded-full">📍 {post.region}</span>
              {post.hashtags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-[#0F9B73]">#{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">😊</div>
                <span className="font-semibold text-[#E8956D]">{post.author}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>👁 {viewCount}</span>
                <span>💬 {comments.length}</span>
                <span>❤️ {wishCount}</span>
                <span>{post.regDt}</span>
              </div>
            </div>
          </div>

          {/* 본문 - 네이버 블로그 스타일 */}
          <article className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
            <p className="whitespace-pre-wrap text-base md:text-lg leading-9 text-gray-700">
              {post.description}
            </p>
          </article>

          {/* ✅ 여행 코스 섹션 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
              🗺 여행 코스
              <span className="text-sm font-normal text-gray-400">{post.course.length}개 장소</span>
            </h3>

            <div className="space-y-4">
              {post.course.map((c, i) => (
                <div key={c.order} className="flex gap-4">
                  {/* 순서 + 연결선 */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0F9B73] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {c.order}
                    </div>
                    {i < post.course.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-1 min-h-[20px]" />
                    )}
                  </div>

                  {/* 장소 카드 */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex gap-4 mb-2">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLOR[c.type]}`}>
                          {TYPE_LABEL[c.type]}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ 일정 가져오기 / 코스로 만들기 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleImportSchedule}
                className="flex-1 py-3 bg-[#0F9B73] text-white text-sm font-bold rounded-xl hover:bg-[#0d8a66] transition flex items-center justify-center gap-2"
              >
                📅 내 일정으로 가져오기
              </button>
              <button
                onClick={handleMakePlan}
                className="flex-1 py-3 border border-[#0F9B73] text-[#0F9B73] text-sm font-bold rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                🗺 이 코스로 일정 만들기
              </button>
            </div>
          </div>
        </div>
      </section>

        {/* ✅ 오른쪽: 사이드 정보 */}
        <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6 space-y-6">

          {/* 공유/신고 */}
          <div className="flex items-center gap-2">
            <ClipButton />
            <button type="button" onClick={handleReport}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
              🚩 신고
            </button>
          </div>

          {/* 작성자 */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-xl shadow-sm">😊</div>
            <div>
              <p className="text-xs text-gray-400">작성자</p>
              <h4 className="text-base font-bold text-gray-900">{post.author}</h4>
            </div>
          </div>

          {/* 지역 + 작성일 */}
          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">지역</span>
              <strong className="text-gray-700">{post.region}</strong>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">작성일</span>
              <strong className="text-gray-700">{post.regDt}</strong>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">코스</span>
              <strong className="text-gray-700">{post.course.length}개 장소</strong>
            </div>
          </div>

          {/* 해시태그 */}
          <div>
            <p className="mb-3 text-sm font-bold text-gray-500">해시태그</p>
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">#{tag}</span>
              ))}
            </div>
          </div>

          {/* 조회/댓글/찜 */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
            <div className="rounded-2xl bg-gray-50 px-3 py-4">
              <p className="text-xs text-gray-400">조회</p>
              <strong className="mt-1 block text-lg text-gray-900">{viewCount}</strong>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-4">
              <p className="text-xs text-gray-400">댓글</p>
              <strong className="mt-1 block text-lg text-gray-900">{comments.length}</strong>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-2xl px-3 py-4 transition ${isLiked ? 'bg-red-50' : 'bg-gray-50 hover:bg-red-50'}`}
            >
              <p className="text-xs text-gray-400">찜</p>
              <strong className={`mt-1 block text-lg ${isLiked ? 'text-red-500' : 'text-gray-900'}`}>{wishCount}</strong>
            </button>
          </div>

          {/* 수정/삭제 */}
          {isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate(`/showcase/life/write/${post.id}`)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:border-[#0F9B73] hover:text-[#0F9B73]">
                수정
              </button>
              <button onClick={() => alert("삭제 예정")}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100">
                삭제
              </button>
            </div>
          )}

          {/* ✅ 내 일정으로 가져오기 버튼 (사이드바) */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <button onClick={handleImportSchedule}
              className="w-full py-3 bg-[#0F9B73] text-white text-sm font-bold rounded-xl hover:bg-[#0d8a66] transition">
              📅 내 일정으로 가져오기
            </button>
            <button onClick={handleMakePlan}
              className="w-full py-3 border border-[#0F9B73] text-[#0F9B73] text-sm font-bold rounded-xl hover:bg-green-50 transition">
              🗺 이 코스로 일정 만들기
            </button>
          </div>
        </aside>
      </section>

      {/* 댓글 영역 */}
      <section className="mt-12 border-t border-gray-100 pt-10">
        <h4 className="mb-6 text-xl font-extrabold text-gray-900">
          댓글 <span className="text-[#0F9B73]">{comments.length}</span>
        </h4>
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all focus-within:border-[#0F9B73] focus-within:ring-2 focus-within:ring-green-100">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
            className="h-28 w-full resize-none bg-transparent text-base text-gray-700 outline-none"
            placeholder="이 여행 코스에 대한 감상을 남겨주세요." />
          <div className="mt-3 flex justify-end">
            <button onClick={handleCommentSubmit}
              className="rounded-xl bg-[#0F9B73] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d8a66] active:scale-95">
              댓글 등록
            </button>
          </div>
        </div>

        <div className="mb-16 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-sm">👤</div>
                  <div>
                    <p className="font-bold text-gray-900">{comment.user}</p>
                    <p className="text-sm text-gray-400">{comment.date}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">
                  {editingId === comment.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(comment.id)} className="text-blue-500 hover:text-blue-700">저장</button>
                      <button onClick={() => { setEditingId(null); setEditText(""); }} className="text-gray-400 hover:text-gray-600">취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(comment.id, comment.text)} className="text-gray-400 hover:text-blue-500">수정</button>
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500">삭제</button>
                      <button onClick={() => handleReportComment()} className="text-gray-400 hover:text-orange-500">신고</button>
                    </>
                  )}
                </div>
              </div>
              {editingId === comment.id ? (
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="3"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
              ) : (
                <p className="whitespace-pre-wrap text-base leading-7 text-gray-700">{comment.text}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunityLifeDetail;