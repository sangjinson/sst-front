import { useState, useEffect } from 'react';

// TODO: API 연동 시 이 키 대신 서버 API 호출로 교체
export const STORAGE_KEY = 'sst_wishlist';

// ─── 임시 로컬 스토리지 유틸 (API 연동 시 아래 함수들을 API 호출로 교체) ───

function _fetchWishlist() {
  // TODO: API 연동 시 → GET /api/wishlist
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function _addWishItem(itemData) {
  // TODO: API 연동 시 → POST /api/wishlist
  const list = _fetchWishlist();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, itemData]));
}

function _removeWishItem(id, type) {
  // TODO: API 연동 시 → DELETE /api/wishlist/:id
  const list = _fetchWishlist();
  const updated = list.filter(
    (w) => !(String(w.id) === String(id) && w.type === type)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * 찜 상태 관리 훅
 *
 * @param {string|number} itemId   - 아이템 ID
 * @param {string}        itemType - 카테고리 타입 ('food' | 'see' | 'sleep')
 * @returns {{ isWished: boolean, toggleWish: (itemData: object) => void }}
 *
 * itemData 구조:
 * { id, name, image, category, address, type, region }
 */
export function useWishlist(itemId, itemType) {
  const [isWished, setIsWished] = useState(false);

  // 페이지 진입 시 찜 여부 초기화
  useEffect(() => {
    if (!itemId) return;
    // TODO: API 연동 시 → GET /api/wishlist/check?id=&type= 으로 교체
    const list = _fetchWishlist();
    setIsWished(
      list.some((w) => String(w.id) === String(itemId) && w.type === itemType)
    );
  }, [itemId, itemType]);

  // 찜 토글: 이미 찜 → 제거 / 아니면 → 추가
  const toggleWish = (itemData) => {
    if (isWished) {
      _removeWishItem(itemData.id, itemData.type);
    } else {
      _addWishItem(itemData);
    }
    setIsWished((prev) => !prev);
  };

  return { isWished, toggleWish };
}

// MyPage 등 외부에서 전체 찜 목록 조회 시 사용
export { _fetchWishlist as getWishlist };
