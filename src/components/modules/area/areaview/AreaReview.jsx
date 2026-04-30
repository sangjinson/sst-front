import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '@components/modules/StarRating';
import Swal from 'sweetalert2';

const REVIEWS_PER_PAGE = 3;

const StarSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => onChange(star)}
        className={`text-2xl cursor-pointer transition-colors ${
          star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').slice(0, -1);
};

const AreaReview = ({
  rating,
  reviewCount,
  reviews: initialReviews = [],
  isLoggedIn = false,
  placeholder = '리뷰를 남겨주세요.',
}) => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState(
    initialReviews.map((r, idx) => ({
      ...r,
      id: idx,
      isMine: false,
      date: r.date || '2026.01.01', // ✅ 더미데이터 기본 날짜
    }))
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  // ✅ 평균 평점 계산
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : Number(rating).toFixed(1);

  const handleReviewSubmit = () => {
    if (reviewRating === 0) { alert('별점을 선택해주세요.'); return; }
    if (!reviewComment.trim()) { alert('리뷰 내용을 입력해주세요.'); return; }
    const newReview = {
      id: Date.now(),
      user: '나',
      rating: reviewRating,
      comment: reviewComment.trim(),
      isMine: true,
      date: formatDate(new Date()), // ✅ 작성 날짜
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewRating(0);
    setReviewComment('');
  };

  const handleEditStart = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSave = (id) => {
    if (editRating === 0) { alert('별점을 선택해주세요.'); return; }
    if (!editComment.trim()) { alert('리뷰 내용을 입력해주세요.'); return; }
    setReviews((prev) =>
      prev.map((r) => r.id === id ? { ...r, rating: editRating, comment: editComment.trim() } : r)
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleReport = async () => {
    const result = await Swal.fire({
      title: '신고 사유를 선택해주세요',
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report" value="부적절한 댓글로 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            부적절한 댓글로 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report" value="불법 광고 및 홍보 인한 신고" style="accent-color:#f97316; width:16px; height:16px;" />
            불법 광고 및 홍보 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer; font-size:14px; font-weight:500; color:#111827;"
            onmouseover="this.style.borderColor='#f97316'; this.style.background='#fff7ed'"
            onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='white'">
            <input type="radio" name="report" value="기타" id="report-etc"
              style="accent-color:#f97316; width:16px; height:16px;"
              onclick="document.getElementById('etc-input-wrap').style.display='block'" />
            기타
          </label>
          <div id="etc-input-wrap" style="display:none; margin-top:4px;">
            <textarea id="etc-input" placeholder="기타 신고 내용을 입력해주세요."
              style="width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px 12px; font-size:13px; color:#374151; resize:none; outline:none; height:80px; box-sizing:border-box;"
              onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '신고하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#9ca3af',
      preConfirm: () => {
        const selected = document.querySelector('input[name="report"]:checked');
        if (!selected) { Swal.showValidationMessage('신고 사유를 선택해주세요.'); return false; }
        if (selected.value === '기타') {
          const etcText = document.getElementById('etc-input')?.value?.trim();
          if (!etcText) { Swal.showValidationMessage('기타 신고 내용을 입력해주세요.'); return false; }
          return `기타: ${etcText}`;
        }
        return selected.value;
      },
    });
    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: '신고 완료',
        text: '신고가 정상적으로 완료되었습니다.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">

      {/* ✅ 헤더 - 평균 평점 숫자 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">평점 & 리뷰</h2>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} theme={{ size: 'text-xl' }} />
          <span className="text-base font-bold text-yellow-500">{avgRating}</span>
          <span className="text-sm text-gray-400">({reviewCount}개)</span>
        </div>
      </div>

      {/* 리뷰 등록 폼 */}
      {isLoggedIn ? (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">리뷰 작성</p>
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">별점 선택</p>
            <StarSelector value={reviewRating} onChange={setReviewRating} />
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none resize-none focus:border-[#E8956D] transition-colors"
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-2 w-full py-2.5 bg-[#E8956D] text-white rounded-xl text-sm font-medium hover:bg-[#f07e48] transition-colors"
          >
            리뷰 등록
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-2">리뷰를 등록하려면 로그인이 필요합니다.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 border border-[#E8956D] text-[#E8956D] rounded-lg text-sm font-medium hover:bg-[#f07e48] hover:text-white transition-colors"
          >
            로그인하러 가기
          </button>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-3">
        {(showAllReviews ? reviews : reviews.slice(0, REVIEWS_PER_PAGE)).map((review) => (
          <div key={review.id} className="border border-gray-100 rounded-xl p-4">

            {/* 수정 모드 */}
            {editingId === review.id ? (
              <div>
                <div className="mb-2">
                  <p className="text-xs text-gray-400 mb-1">별점 수정</p>
                  <StarSelector value={editRating} onChange={setEditRating} />
                </div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none resize-none focus:border-[#E8956D] transition-colors mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleEditSave(review.id)}
                    className="flex-1 py-2 bg-[#E8956D] text-white rounded-lg text-xs font-medium hover:bg-[#f07e48] transition">
                    저장
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition">
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ✅ 1줄: 작성자 + 날짜 */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{review.user}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>

                {/* ✅ 2줄: 별점 + 수정/삭제/신고 */}
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-1">
                    {review.isMine ? (
                      <>
                        <button
                          onClick={() => handleEditStart(review)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition"
                          title="수정하기"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="삭제하기"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleReport}
                        className="p-1.5 rounded-md text-orange-400 hover:text-orange-600 hover:bg-orange-50 transition"
                        title="신고하기"
                      >
                        <svg viewBox="0 0 64 64" className="w-4 h-4">
                          <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor"/>
                          <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(45 32 32)"/>
                          <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(90 32 32)"/>
                          <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(135 32 32)"/>
                          <rect x="30" y="2" width="4" height="7" rx="2" fill="currentColor" transform="rotate(-45 32 32)"/>
                          <path d="M12 34 A20 20 0 0 1 52 34 Z" fill="currentColor"/>
                          <rect x="10" y="34" width="44" height="11" rx="5" fill="currentColor"/>
                          <rect x="8" y="45" width="48" height="10" rx="5" fill="#2d2d4e"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* 리뷰 내용 */}
                <p className="text-sm text-gray-500">{review.comment}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 더보기 / 접기 */}
      <button
        onClick={() => setShowAllReviews((prev) => !prev)}
        className="w-full mt-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
      >
        {showAllReviews ? '접기 ▲' : '리뷰 더보기 ▼'}
      </button>
    </div>
  );
};

export default AreaReview;