import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSleepDataByRegion } from './sleepDummyData';
import { toKorRegion } from '@utils/regionMap';
import { GridCard, GridCardHeader, GridCardBody, GridCardFooter } from '@components/modules/GridCard';
import { HeartButton } from '@components/card/AttractionCard';

// 별점 컴포넌트
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-sm ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))}
    <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
  </div>
);

// 카테고리 배지 색상
const categoryColor = {
  호텔: 'bg-blue-100 text-blue-700',
  펜션: 'bg-green-100 text-green-700',
  게스트하우스: 'bg-orange-100 text-orange-700',
  모텔: 'bg-gray-100 text-gray-600',
  리조트: 'bg-purple-100 text-purple-700',
};

const List = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const regionKor = toKorRegion(region);

  const [sleepList, setSleepList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 찜 상태 관리 (id 기반으로 관리)
  const [likedItems, setLikedItems] = useState({});

  const handleLike = (e, id) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['전체', '호텔', '리조트', '펜션', '모텔', '게스트하우스'];

  // 지역 데이터 로드
  useEffect(() => {
    const data = getSleepDataByRegion(regionKor);
    setSleepList(data);
  }, [regionKor]);

  // 필터 & 정렬
  useEffect(() => {
    let result = [...sleepList];

    if (selectedCategory !== '전체') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (sortOption === 'latest') {
      // 최신순: id 내림차순 (id가 클수록 최근 등록)
      result.sort((a, b) => b.id - a.id);
    } else if (sortOption === 'popular') {
      // 인기순: 평점 높은 순
      result.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [selectedCategory, sortOption, sleepList]);

  // 페이지네이션
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 상세 페이지 이동
  const goToDetail = (id) => {
    navigate(`/${region}/sleep/view?id=${id}`);
  };

  return (
    <div className="min-h-screen">

      {/* 필터 & 정렬 영역 */}
      <div className="py-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-[#0F9B73] text-white border-[#0F9B73]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 정렬 버튼 */}
          <div className="flex gap-2">
            {[{ value: 'latest', label: '최신순' }, { value: 'popular', label: '인기순' }].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortOption(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${sortOption === opt.value
                  ? 'bg-[#0F9B73] text-white border-[#0F9B73]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#0F9B73] hover:text-[#0F9B73]'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 수 */}
        <p className="text-sm text-gray-500 mb-3">
          총 <span className="font-semibold text-gray-800">{filtered.length}</span>개의 숙소
        </p>

        {/* 카드 그리드 */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((item) => (
              <GridCard key={item.id} onClick={() => goToDetail(item.id)} >
                {/* 썸네일 */}
                <GridCardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                      <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* 카테고리 배지 */}
                      <span
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                          categoryColor[item.category] || "bg-gray-100 text-gray-600"
                      }`}
                      >
                      {item.category}
                      </span>

                      {/* 찜 버튼 추가 */}
                      <div className="absolute top-3 right-3 scale-75 origin-top-right">
                        <HeartButton
                          liked={!!likedItems[item.id]}
                          onClick={(e) => handleLike(e, item.id)}
                        />
                      </div>
                  </div>
                </GridCardHeader>

                {/* 카드 정보 */}
                <GridCardBody className="px-4 py-3">
                    <h3 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-[#0F9B73] transition-colors">
                        {item.name}
                    </h3>
                    <StarRating rating={item.rating} icon="★" />
                    <p className="text-xs text-gray-400 mt-0.5 mb-2">
                        리뷰 {item.reviewCount}개
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                    </p>
                </GridCardBody>

                {/* 푸터 */}
                <GridCardFooter className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate max-w-[150px]">
                        {item.address}
                        </span>
                    </p>
                </GridCardFooter>
            </GridCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🏨</span>
            <p className="text-lg font-medium">해당 카테고리의 숙소가 없습니다</p>
            <p className="text-sm mt-1">다른 카테고리를 선택해보세요</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === page
                  ? 'bg-[#0F9B73] text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;