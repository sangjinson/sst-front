// src/components/mypage/MyWishlist.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';

// 🚀 직접 작성해주신 커스텀 훅 불러오기
import { getWishlist, STORAGE_KEY } from '@hooks/useWishlist';

const ITEMS_PER_PAGE = 8;

const MyWishlist = () => {
  const navigate = useNavigate();
  
  // 🚀 기존 로컬스토리지 함수 대신 getWishlist() 훅 사용
  const [likes, setLikes] = useState(() => getWishlist());
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(likes.length / ITEMS_PER_PAGE) || 1;
  const currentItems = likes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // 🚀 직접 작성해주신 id와 type을 모두 비교하는 삭제 로직 적용
  const handleRemove = (item) => {
    const updated = likes.filter(
      (w) => !(String(w.id) === String(item.id) && w.type === item.type)
    );
    // TODO: API 연동 시 → DELETE /api/wishlist/:id 로 교체, localStorage 줄 제거
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLikes(updated);

    // 💡 참고: 마지막 아이템 지울 때 빈 페이지 남지 않게 하는 방어 코드는 유지해 두었습니다.
    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE) || 1;
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  };

  return (
    <div className="p-4 md:p-7">
      <h3 className="fs-up-3 font-bold text-gray-700 mb-4">내 찜 목록</h3>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7 order-2 md:order-4" />


      {likes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💔</div>
          <p className="text-sm">아직 찜한 목록이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {currentItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                // 🚀 직접 작성해주신 안전한 라우팅 경로 적용
                onClick={() => navigate(`/${item.region}/${item.type}/view?id=${item.id}`)}
              >
                <img src={item.image} alt={item.name} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3 pb-8">
                  <div className="text-sm font-semibold truncate text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                </div>
                <div className="absolute bottom-2 left-3 bg-black/45 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.address?.split(' ').slice(0, 2).join(' ')}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                  className="absolute bottom-1.5 right-2 text-lg hover:scale-110 transition-transform"
                  title="찜 해제"
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
          {likes.length > ITEMS_PER_PAGE && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default MyWishlist;