import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'; // 🚀 useOutletContext 추가됨
import AttractionCard from '../../../components/card/AttractionCard';
import { getSeeDataByRegion } from './seeData';

const categories = ['전체', '박물관', '도서관', '지역명소', '공원'];

const SeeList = () => {
  const navigate = useNavigate();
  const { selectedRegion } = useOutletContext() || {};
  const region = selectedRegion || '수원';
  const data = getSeeDataByRegion(region);

  const [activeCategory, setActiveCategory] = useState('전체');
  const [sort, setSort] = useState('latest');
  const [activePage, setActivePage] = useState(1);

  const itemsPerPage = 9;

  // ✅ 필터 + 정렬
  const filteredData = useMemo(() => {
    const categoryData =
      activeCategory === '전체'
        ? data
        : data.filter((item) => item.tag === activeCategory);

    return [...categoryData].sort((a, b) => {
      if (sort === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [activeCategory, data, sort]);

  // ✅ 페이지 계산
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const currentData = filteredData.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // ✅ 카테고리 / 정렬 / 지역이 바뀌면 페이지 초기화
  useEffect(() => {
    setActivePage(1);
  }, [activeCategory, sort, region]); // 🚀 regionName -> region 으로 수정됨

  return (
    <div className="bg-[#f8f6f0] min-h-screen pb-10">
      {/* CONTENT */}
      <div className="max-w-[1200px] mx-auto mt-10 px-4">
        
        {/* 카테고리 + 정렬 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

          {/* 카테고리 */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`px-4 py-2 rounded-full text-sm cursor-pointer border border-gray-200 transition ${
                  activeCategory === item
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 정렬 (🚀 중간에 꼬여있던 잘못된 코드 블록 완전 삭제 후 정상 복구됨) */}
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setSort('latest')}
              className={`px-4 py-1.5 text-sm rounded-full transition cursor-pointer ${
                sort === 'latest'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`px-4 py-1.5 text-sm rounded-full transition cursor-pointer ${
                sort === 'popular'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              인기순
            </button>
          </div>
          
        </div>

        {/* 카드 그리드 영역 */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 max-w-[1050px] w-full">
            {currentData.map((item) => (
              <AttractionCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/${region}/see/view?id=${item.id}`)}
              />
            ))}
          </div>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 items-center gap-2">
            {/* 이전 버튼 */}
            <button
              onClick={() => setActivePage((prev) => (prev > 1 ? prev - 1 : prev))}
              disabled={activePage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
            >
              ←
            </button>

            {/* 페이지 숫자 */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
              <button
                key={n}
                onClick={() => setActivePage(n)}
                className={`w-9 h-9 rounded-lg text-sm transition cursor-pointer flex items-center justify-center ${
                  activePage === n
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {n}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button
              onClick={() => setActivePage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={activePage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
            >
              →
            </button>
          </div>
        )}

      </div>
    </div> // 🚀 닫는 태그 수정 완료 (</> -> </div>)
  );
};

export default SeeList;