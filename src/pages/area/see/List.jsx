import React, { useEffect, useMemo, useState } from 'react';
import AttractionCard from '../../../components/card/AttractionCard';
import Breadcrumb from '../../../components/common/Breadcrumb';
import HeroBanner from '../../../components/common/HeroBanner';
import { getSeeDataByRegion } from './seeData';
import { useNavigate, useOutletContext } from 'react-router-dom';

const categories = ['전체','박물관','도서관','지역명소','공원'];

const SeeList = () => {

  const navigate = useNavigate();
  const { selectedRegion } = useOutletContext() || {};
  const region = (selectedRegion || '수원').replace(/시$/, '');
  const data = getSeeDataByRegion(region);

  const [activeCategory, setActiveCategory] = useState('전체');
  const [sort, setSort] = useState('latest');
  const [activePage, setActivePage] = useState(1); // 🔥 추가
  const itemsPerPage = 9;

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

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  useEffect(() => {
    setActivePage(1);
  }, [activeCategory, sort, region]);

  return (
    <div className="bg-[#f8f6f0] min-h-screen">

      <HeroBanner
        bgImage="https://picsum.photos/1200/400"
        title={`${region}시`}
        subtitle="정조의 효심과 화성의 기상이 깃든 도시"
      />

      {/* CONTENT */}
      <div className="max-w-[1200px] mx-auto mt-10 px-4">

        <Breadcrumb
          paths={[
            { label: '홈', to: '/' },
            { label: `${region}시`, to: `/${region}` },
            { label: '볼거리' },
          ]}
          className="mb-5"
        />

        {/* 카테고리 + 정렬 */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-3">

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

        {/* 카드 */}
        <div className="grid grid-cols-4 gap-5 mb-12
                lg:grid-cols-3 
                md:grid-cols-2 
                sm:grid-cols-1">
          {currentData.map((item) => (
            <AttractionCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/${region}/see/view?id=${item.id}`)}
            />
          ))}
        </div>

        {/* 🔥 페이지네이션 */}
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

      </div>
    </div>
  );
};

export default SeeList;
