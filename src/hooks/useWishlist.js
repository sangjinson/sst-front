import { useState, useEffect } from 'react';
import api from '@api/axios';

/**
 * 찜 상태 관리 훅 - DB 연동
 *
 * @param {string|number} itemId   - 아이템 ID (plcNo)
 * @param {string}        itemType - 카테고리 타입 ('food' | 'see' | 'sleep' | 'play')
 * @param {object}        user     - 로그인 유저 { mbrId, ... } | null
 */
export function useWishlist(itemId, itemType, user) {
  const [isWished, setIsWished] = useState(false);

  // 페이지 진입 시 찜 여부 확인
  useEffect(() => {
    if (!itemId || !user?.mbrId) return;

    api.get('/wishlist/check', {
      params: {
        mbrId: user.mbrId,
        plcNo: itemId,
      }
    })
    .then((res) => setIsWished(res.data.isWished))
    .catch(() => setIsWished(false));

  }, [itemId, user?.mbrId]);

  // 찜 토글
  const toggleWish = async (itemData) => {
    if (!user?.mbrId) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const res = await api.post('/wishlist/toggle', {
        wishMbrId: user.mbrId,
        wishPlcNo: itemId,
      });
      setIsWished(res.data.isWished);
    } catch {
      alert('찜 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return { isWished, toggleWish };
}

// 내 찜 목록 조회 (마이페이지용)
export const getWishlist = async (mbrId) => {
  const res = await api.get('/wishlist', { params: { mbrId } });
  return res.data;
};