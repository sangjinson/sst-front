import { useState, useCallback } from 'react';
import { createReview, updateReview, deleteReview } from '@api/reviewApi';


// 리뷰 관련 상태랑 로직을 담당하는 커스텀 훅

/**
 * useReview
 *
 * @param {number} plcNo      - 장소번호 (PLACE.PLC_NO)
 * @param {object} currentUser - 로그인 유저 { mbrId, nickname, ... } | null
 */
export const useReview = (plcNo, currentUser) => {

  // 리뷰 목록 (등록/수정/삭제 시 직접 조작)
  const [reviews, setReviews] = useState([]);

  // 현재 인라인 수정 중인 리뷰 ID (null이면 수정 모드 아님)
  const [editingId, setEditingId] = useState(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 에러 메시지
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────
  // 리뷰 등록
  // ─────────────────────────────────────────
  const submitReview = useCallback(async ({ rvwRating, rvwContent }) => {
    if (!currentUser) throw new Error('로그인이 필요합니다.');

    setIsLoading(true);
    setError(null);

    try {
      const newReview = await createReview({
        rvwPlcNo  : plcNo,
        rvwMbrId  : currentUser.mbrId,
        rvwRating,
        rvwContent,
      });

      // 낙관적 업데이트: 응답받은 리뷰를 목록 맨 앞에 추가
      setReviews((prev) => [newReview, ...prev]);

    } catch (err) {
      setError(err?.response?.data?.message ?? '리뷰 등록에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [plcNo, currentUser]);

  // ─────────────────────────────────────────
  // 리뷰 수정
  // ─────────────────────────────────────────
  const editReview = useCallback(async (rvwNo, { rvwRating, rvwContent }) => {
    setIsLoading(true);
    setError(null);

    try {
      const updated = await updateReview(rvwNo, {
        rvwPlcNo  : plcNo,
        rvwMbrId  : currentUser.mbrId,
        rvwRating,
        rvwContent,
      });

      // 수정된 리뷰만 교체
      setReviews((prev) =>
        prev.map((r) => (r.rvwNo === rvwNo ? { ...r, ...updated } : r))
      );
      setEditingId(null);

    } catch (err) {
      setError(err?.response?.data?.message ?? '리뷰 수정에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [plcNo, currentUser]);

  // ─────────────────────────────────────────
  // 리뷰 삭제
  // ─────────────────────────────────────────
  const removeReview = useCallback(async (rvwNo) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteReview(rvwNo, {
        rvwPlcNo : plcNo,
        rvwMbrId : currentUser.mbrId,
      });

      // 삭제된 리뷰 목록에서 제거
      setReviews((prev) => prev.filter((r) => r.rvwNo !== rvwNo));

    } catch (err) {
      setError(err?.response?.data?.message ?? '리뷰 삭제에 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [plcNo, currentUser]);

  return {
    reviews,
    setReviews,   // 초기 리뷰 목록 세팅용 (AreaReview에서 사용)
    editingId,
    setEditingId,
    isLoading,
    error,
    submitReview,
    editReview,
    removeReview,
  };
};