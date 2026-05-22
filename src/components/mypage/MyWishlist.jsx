import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';
import { getWishlist } from '@hooks/useWishlist';
import { useAuth } from '@hooks/useAuth';
import api from '@api/axios';
import { toEnRegion } from '@utils/regionMap'; 

const ITEMS_PER_PAGE = 8;

// 컴포넌트 밖 (import 아래)에 선언
const CAT_TYPE_MAP = {
  'PLC001': 'see',
  'PLC002': 'play',
  'PLC003': 'food',
  'PLC004': 'sleep',
};

const CAT_LABEL_MAP = {
  'PLC001': '볼거리',
  'PLC002': '놀거리',
  'PLC003': '먹거리',
  'PLC004': '잘거리',
};


const MyWishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [likes, setLikes]   = useState([]);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  // 찜 목록 조회
  useEffect(() => {
    if (!user?.mbrId) { setLoading(false); return; }
    getWishlist(user.mbrId)
      .then((data) => setLikes(data))
      .catch(() => setLikes([]))
      .finally(() => setLoading(false));
  }, [user?.mbrId]);

  const totalPages   = Math.ceil(likes.length / ITEMS_PER_PAGE) || 1;
  const currentItems = likes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // 찜 해제
  const handleRemove = async (item) => {
    try {
      await api.post('/wishlist/toggle', {
        wishMbrId: user.mbrId,
        wishPlcNo: item.wishPlcNo,
      });
      setLikes((prev) => prev.filter((w) => w.wishPlcNo !== item.wishPlcNo));

      const newTotalPages = Math.ceil((likes.length - 1) / ITEMS_PER_PAGE) || 1;
      if (page > newTotalPages) setPage(newTotalPages);
    } catch {
      alert('찜 해제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) return (
    <div className="p-4 md:p-7 text-center text-gray-400 py-16">
      불러오는 중...
    </div>
  );

  return (
    <div className="p-4 md:p-7">
      <h3 className="fs-up-3 font-bold text-gray-700 mb-4">내 찜 목록</h3>
      <hr className="w-full border-b border-t-0 border-gray-200 mt-2 mb-7" />

      {likes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💔</div>
          <p className="text-sm">아직 찜한 목록이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {currentItems.map((item, idx) => {
              const type = CAT_TYPE_MAP[item.plcCatCd] ?? 'see';
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                  onClick={() => navigate(`/${toEnRegion(item.rgnName)}/${type}/view?id=${item.wishPlcNo}`)}
                >
                  <img
                    src={item.plcMainImgUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}
                    alt={item.plcName}
                    className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'; }}
                  />
                  <div className="p-3 pb-8">
                    <div className="text-sm font-semibold truncate text-gray-900">{item.plcName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{CAT_LABEL_MAP[item.plcCatCd] ?? ''}</div>
                  </div>
                  <div className="absolute bottom-2 left-3 bg-black/45 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {item.plcAddr?.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                    className="absolute bottom-1.5 right-2 text-lg hover:scale-110 transition-transform"
                    title="찜 해제"
                  >
                    ❤️
                  </button>
                </div>
              );
            })}
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