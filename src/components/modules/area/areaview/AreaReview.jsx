import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarRating from '@components/modules/StarRating';
import Swal from 'sweetalert2';
import { useAuth } from '@hooks/useAuth';
import { useApi } from '@hooks/useApi';
import api from '@api/axios';

const REVIEWS_PER_PAGE = 3;

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19h16" />
    <path d="M6 19v-5a6 6 0 0 1 12 0v5" />
    <path d="M5 21h14" />
    <path d="M12 2v2" />
    <path d="M4.9 4.9 6.3 6.3" />
    <path d="M19.1 4.9 17.7 6.3" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 15H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

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

const AreaReview = ({ plcNo, placeholder = '리뷰를 남겨주세요.' }) => {
  const apiTool = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [reviews, setReviews]               = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewRating, setReviewRating]     = useState(0);
  const [reviewComment, setReviewComment]   = useState('');
  const [editingId, setEditingId]           = useState(null);
  const [editRating, setEditRating]         = useState(0);
  const [editComment, setEditComment]       = useState('');

  useEffect(() => {
    if (!plcNo) return;
    const fetchReviewsData = async () => {
      try {
        const data = await apiTool.getReviews(plcNo);
        if (data && Array.isArray(data)) {
          setReviews(data.map((r) => ({
            ...r,
            id     : r.rvwNo,
            user   : r.nickname ?? '익명',
            rating : r.rvwRating,
            comment: r.rvwContent,
            isMine : r.rvwMbrId === user?.mbrId,
            date   : r.rvwRegDate ? formatDate(r.rvwRegDate) : '',
          })));
        }
      } catch (error) {
        console.error('리뷰 목록 로드 실패:', error);
      }
    };
    fetchReviewsData();
  }, [plcNo, user]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // ─────────────────────────────────────────
  // 리뷰 등록
  // ─────────────────────────────────────────
  const handleReviewSubmit = async () => {
    if (reviewRating === 0)    { alert('별점을 선택해주세요.'); return; }
    if (!reviewComment.trim()) { alert('리뷰 내용을 입력해주세요.'); return; }
    try {
      const newReview = await apiTool.createReview({
        rvwPlcNo  : plcNo,
        rvwMbrId  : user.mbrId,
        rvwRating : reviewRating,
        rvwContent: reviewComment.trim(),
      });
      setReviews((prev) => [{
        ...newReview,
        id     : newReview.rvwNo,
        user   : user.mbrNickname,
        rating : newReview.rvwRating,
        comment: newReview.rvwContent,
        isMine : true,
        date   : formatDate(new Date()),
      }, ...prev]);
      setReviewRating(0);
      setReviewComment('');
    } catch {
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ─────────────────────────────────────────
  // 리뷰 수정
  // ─────────────────────────────────────────
  const handleEditStart = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleEditSave = async (id) => {
    if (editRating === 0)    { alert('별점을 선택해주세요.'); return; }
    if (!editComment.trim()) { alert('리뷰 내용을 입력해주세요.'); return; }
    try {
      await apiTool.updateReview(id, {
        rvwPlcNo  : plcNo,
        rvwMbrId  : user.mbrId,
        rvwRating : editRating,
        rvwContent: editComment.trim(),
      });
      setReviews((prev) =>
        prev.map((r) => r.id === id
          ? { ...r, rating: editRating, comment: editComment.trim(), date: formatDate(new Date()) }
          : r
        )
      );
      setEditingId(null);
    } catch {
      alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ─────────────────────────────────────────
  // 리뷰 삭제
  // ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await apiTool.deleteReview(id, {
          rvwPlcNo: plcNo,
          rvwMbrId: user.mbrId,
        });
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } catch {
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // ─────────────────────────────────────────
  // 리뷰 신고
  // ─────────────────────────────────────────
  const handleReport = async (reviewId) => {
    const result = await Swal.fire({
      title: '신고 사유를 선택해주세요',
      html: `
        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-top:8px;">
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
            <input type="radio" name="report-review" value="부적절한 리뷰로 인한 신고" data-code="RSN002" style="accent-color:#f97316;" />
            부적절한 리뷰로 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
            <input type="radio" name="report-review" value="불법 광고 및 홍보 인한 신고" data-code="RSN001" style="accent-color:#f97316;" />
            불법 광고 및 홍보 인한 신고
          </label>
          <label style="display:flex; align-items:center; gap:12px; padding:14px 16px; border:1.5px solid #e5e7eb; border-radius:12px; cursor:pointer;">
            <input type="radio" name="report-review" value="기타" data-code="RSN003" style="accent-color:#f97316;"
              onclick="document.getElementById('etc-review-wrap').style.display='block'" />
            기타
          </label>
          <div id="etc-review-wrap" style="display:none; margin-top:4px;">
            <textarea id="etc-review-input" placeholder="기타 신고 내용을 입력해주세요."
              style="width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px; resize:none; outline:none; height:80px;"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '신고하기',
      cancelButtonText: '취소',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#9ca3af',
      preConfirm: () => {
        const selected = document.querySelector('input[name="report-review"]:checked');
        if (!selected) { Swal.showValidationMessage('신고 사유를 선택해주세요.'); return false; }

        const reasonCd = selected.dataset.code;
        let reasonContent = selected.value;

        if (selected.value === '기타') {
          const val = document.getElementById('etc-review-input')?.value?.trim();
          if (!val) { Swal.showValidationMessage('기타 내용을 입력해주세요.'); return false; }
          reasonContent = val;
        }

        return { reasonCd, reasonContent };
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.post('/reports', {
        rptTypeCd       : 'RPT001',  // 리뷰 신고
        rptReviewNo     : reviewId,
        rptReasonCd     : result.value.reasonCd,
        rptReasonContent: result.value.reasonContent,
      });

      const blinded = res.data === 2;

      if (blinded) {
        // 블라인드 처리된 경우 목록에서 제거
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        await Swal.fire({
          icon: 'success',
          title: '블라인드 처리 완료',
          text: '신고 누적으로 블라인드 처리되었습니다.',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: 'success',
          title: '신고 완료',
          text: '신고가 정상적으로 접수되었습니다.',
          timer: 1500,
          showConfirmButton: false,
        });
      }

    } catch (err) {
      console.error('신고 실패:', err);

      // 중복 신고 에러 처리
      const errorMsg = err.response?.data?.message;
      if (err.response?.status === 409 || errorMsg?.includes('ALREADY_REPORTED')) {
        Swal.fire({
          icon: 'warning',
          title: '이미 신고한 리뷰입니다.',
          text: '동일한 리뷰는 중복 신고할 수 없습니다.',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({ icon: 'error', title: '신고 실패', text: '다시 시도해주세요.' });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">

      {/* 헤더 */}
      <div className="flex items-end justify-between mb-3">
        <h2 className="fs-up-3 font-bold text-gray-900">평점 & 리뷰</h2>
        <div className="flex items-end gap-2 fs-5">
          <StarRating rating={Number(avgRating)} theme={{ size: 'fs-5', fillColor: 'text-[#E8956D]' }} />
          <span className="font-bold text-[#E8956D]">{avgRating}</span>
          <span className="text-gray-400">({reviews.length}개)</span>
        </div>
      </div>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-3 mb-5" />

      {/* 리뷰 작성 폼 */}
      {isLoggedIn ? (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 flex flex-col">
          <div className="flex items-end justify-between mb-3 md:mb-4">
            <p className="fs-5 font-semibold text-gray-700 order-1">리뷰 작성</p>
            <button
              onClick={handleReviewSubmit}
              className="hidden md:block md:order-2 px-6 py-2 bg-[#E8956D] text-white rounded-lg fs-up-1 font-medium hover:bg-[#f07e48] transition-colors"
            >
              리뷰 등록
            </button>
          </div>
          <div className="mb-3 order-2">
            <div className="mb-2">
              <StarSelector value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 fs-4 text-gray-700 outline-none resize-none focus:border-[#E8956D] transition-colors"
            />
          </div>
          <button
            onClick={handleReviewSubmit}
            className="md:hidden order-3 w-full py-2.5 bg-[#E8956D] text-white rounded-xl fs-up-3 font-medium hover:bg-[#f07e48] transition-colors"
          >
            리뷰 등록
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-2">리뷰를 등록하려면 로그인이 필요합니다.</p>
          <button
            onClick={() => {
              navigate('/login', { state: { from: location.pathname + location.search } })}}
            className="px-5 py-2 border border-[#E8956D] text-[#E8956D] rounded-lg text-sm font-medium hover:bg-[#f07e48] hover:text-white transition-colors"
          >
            로그인하러 가기
          </button>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-3 fs-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">
            아직 작성된 리뷰가 없어요. 첫 번째 리뷰를 남겨보세요!
          </p>
        ) : (
          (showAllReviews ? reviews : reviews.slice(0, REVIEWS_PER_PAGE)).map((review) => (
            <div key={review.id} className="relative border border-gray-100 rounded-xl p-4 pb-14">
              {editingId === review.id ? (
                <div>
                  <div className="absolute right-4 top-4 flex items-center gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => handleEditSave(review.id)}
                      className="cursor-pointer text-[#E8956D] hover:text-[#f07e48]"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      취소
                    </button>
                  </div>
                  <div className="mb-2 pr-20">
                    <p className="mb-1 text-sm font-medium text-gray-500">별점 수정</p>
                    <StarSelector value={editRating} onChange={setEditRating} />
                  </div>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none resize-none focus:border-[#E8956D] transition-colors mb-2"
                  />
                </div>
              ) : (
                <>
                  {!review.isMine && isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => handleReport(review.id)}
                      className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                      aria-label="리뷰 신고"
                      title="신고하기"
                    >
                      <ReportIcon />
                    </button>
                  )}
                  <div className="mb-3 pr-12">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">{review.user}</p>
                      <StarRating rating={review.rating} theme={{ size: 'text-xl' }} />
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-400">{review.date}</p>
                  </div>
                  <p className="text-gray-500">{review.comment}</p>
                  {review.isMine && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditStart(review)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                        aria-label="리뷰 수정"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                        aria-label="리뷰 삭제"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* 더보기 / 접기 */}
      {reviews.length > REVIEWS_PER_PAGE && (
        <button
          onClick={() => setShowAllReviews((prev) => !prev)}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 fs-up-2 font-semibold text-gray-600 transition-all duration-200 hover:border-[#E8956D]/40 hover:bg-[#E8956D]/10 hover:text-[#E8956D] active:scale-[0.99]"
        >
          {showAllReviews ? '접기 ▲' : '리뷰 더보기 ▼'}
        </button>
      )}
    </div>
  );
};

export default AreaReview;