import React, { useEffect, useMemo, useState } from 'react';
import AttractionCard from '../../../components/card/AttractionCard';
import { getSeeDataByRegion } from './seeData';
import { useNavigate, useParams } from 'react-router-dom';

const categories = ['전체','박물관','도서관','지역명소','공원'];

const SeeList = () => {

  const navigate = useNavigate();

  // ✅ URL에서 region 가져오기
  const { region } = useParams();
  const regionName = (region || '수원').replace(/시$/, '');

  // ✅ 데이터 가져오기
  const data = getSeeDataByRegion(regionName);

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

  // ✅ 카테고리 / 정렬 바뀌면 페이지 초기화
  useEffect(() => {
    setActivePage(1);
  }, [activeCategory, sort, regionName]);

  return (
    <>
      {/* 🔥 카테고리 + 정렬 (카드와 width 맞춤) */}
      <div className="flex justify-center">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2 max-w-[1050px] w-full">

          {/* 카테고리 */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`
                  px-4 py-2 rounded-full text-sm cursor-pointer
                  border border-gray-200 transition
                  ${
                    activeCategory === item
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-black'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setSort('latest')}
              className={`
                px-4 py-1.5 text-sm rounded-full transition cursor-pointer
                ${
                  sort === 'latest'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-black'
                }
              `}
            >
              최신순
            </button>

            <button
              onClick={() => setSort('popular')}
              className={`
                px-4 py-1.5 text-sm rounded-full transition cursor-pointer
                ${
                  sort === 'popular'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-400 hover:text-black'
                }
              `}
            >
              인기순
            </button>
          </div>

        </div>
      </div>


      {/* 카드 */}
      <div className="flex justify-center">
  <div className="
    grid 
    grid-cols-2 
    md:grid-cols-3 
    lg:grid-cols-3 
    gap-5
    max-w-[1050px]
    w-full
  ">
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
      <div className="flex justify-center mt-4 mb-10 items-center gap-2">

        {/* 이전 */}
        <button
          onClick={() => setActivePage(prev => prev > 1 ? prev - 1 : prev)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-900 hover:text-white cursor-pointer transition text-sm"
        >
          ←
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((n)=>(
          <button
            key={n}
            onClick={() => setActivePage(n)}
            className={`
              w-9 h-9 rounded-lg text-sm transition cursor-pointer
              flex items-center justify-center
              ${activePage === n 
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                : 'bg-white border border-gray-200 hover:bg-gray-100'}
            `}
          >
            {n}
          </button>
        ))}

        {/* 다음 */}
        <button
          onClick={() => setActivePage(prev => prev < totalPages ? prev + 1 : prev)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-900 hover:text-white cursor-pointer transition text-sm"
        >
          →
        </button>

      </div>
    </>
  );
};

export default SeeList;