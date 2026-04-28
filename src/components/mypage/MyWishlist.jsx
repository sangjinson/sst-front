import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination';

// 🚀 작성해주신 함수 임포트
import { toEnRegion } from '@utils/regionMap'; 

const ITEMS_PER_PAGE = 8;

function getFoodLikes() {
  try { return JSON.parse(localStorage.getItem("food_likes")) || []; }
  catch { return []; }
}

const MyWishlist = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => { 
    setLikes(getFoodLikes()); 
  }, []);

  const totalPages = Math.ceil(likes.length / ITEMS_PER_PAGE) || 1;
  const currentItems = likes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleRemove = (item) => {
    const updated = likes.filter((f) => !(f.id === item.id && f.name === item.name));
    localStorage.setItem("food_likes", JSON.stringify(updated));
    setLikes(updated);

    const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE) || 1;
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  };

  // 🚀 주소에서 "수원시" 등을 뽑아내어 영어로 변환하는 함수
  const getRegionEn = (address) => {
    if (!address) return 'suwon'; // 주소가 없으면 기본값
    
    const regionKo = address.split(' ')[1]; // 예: "경기도 수원시 ..." -> "수원시"
    const eng = toEnRegion(regionKo); // 작성하신 함수 사용
    
    // 만약 변환이 안 돼서 한글(원본)이 그대로 리턴되었다면 기본값 'suwon'
    return eng === regionKo ? 'suwon' : eng;
  };

  const getShortAddress = (address) => {
    if (!address) return '위치 정보 없음';
    return address.split(' ').slice(0, 2).join(' '); 
  };

  return (
    <div className="p-4 md:p-7">
      <h2 className="text-lg md:text-xl font-bold mb-5 text-gray-900">내 찜 목록</h2>
      
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
                // 🚀 클릭 시 영어 지역명으로 안전하게 이동
                onClick={() => navigate(`/${getRegionEn(item.address)}/food/view?id=${item.id}`, { state: { food: item } })}
              >
                <img src={item.image} alt={item.name} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3 pb-8">
                  <div className="text-sm font-semibold truncate text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                </div>
                <div className="absolute bottom-2 left-3 bg-black/45 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {getShortAddress(item.address)}
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