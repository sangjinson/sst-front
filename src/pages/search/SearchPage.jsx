import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '@api/axios';
import AreaListCard from '@components/modules/area/arealist/AreaListCard';
import Pagination from '@components/common/Pagination';
import ListSkeleton from '@components/skeleton/ListSkeleton';

import { WishlistHeartButton } from '@components/modules/ActionButtons';

const PLACE_CATEGORIES = [
  { code: 'ALL', name: '전체' },
  { code: 'PLC001', name: '볼거리' },
  { code: 'PLC003', name: '먹거리' },
  { code: 'PLC004', name: '잘거리' },
  { code: 'PLC002', name: '놀거리' },
];

// 🚀 1. 카테고리 한글명을 URL 영문명으로 변환하는 헬퍼 함수
const getCategoryPath = (catName) => {
  if (catName === '볼거리') return 'see';
  if (catName === '먹거리') return 'food';
  if (catName === '잘거리') return 'sleep';
  if (catName === '놀거리') return 'play';
  return 'see'; // 기본값
};

const SearchPage = () => {
  const { keyword: pathKeyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const keyword = pathKeyword || searchParams.get('keyword') || '';
  const currentTab = searchParams.get('tab') || 'all'; 
  const currentCategory = searchParams.get('category') || 'ALL'; 
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [loading, setLoading] = useState(true);
  
  const [placeData, setPlaceData] = useState({ list: [], totalCount: 0, totalPages: 1 });
  const [communityData, setCommunityData] = useState({ list: [], totalCount: 0, totalPages: 1 });

  const [integratedData, setIntegratedData] = useState({
    see: { list: [], totalCount: 0 },
    food: { list: [], totalCount: 0 },
    sleep: { list: [], totalCount: 0 },
    play: { list: [], totalCount: 0 },
    community: { list: [], totalCount: 0 }
  });

  // 🚀 2. 현재 지역 가져오기 (상세 페이지 이동 시 URL 구성용)
  const currentRegion = localStorage.getItem('lastVisitedRegion') || '수원시';

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        if (currentTab === 'all') {
          const [seeRes, foodRes, sleepRes, playRes, commRes] = await Promise.all([
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC001&page=1&size=4`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC003&page=1&size=4`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC004&page=1&size=4`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC002&page=1&size=4`),
            api.get(`/search/communities?keyword=${encodeURIComponent(keyword)}&page=1&size=4`)
          ]);

          setIntegratedData({
            see: seeRes?.data?.data || { list: [], totalCount: 0 },
            food: foodRes?.data?.data || { list: [], totalCount: 0 },
            sleep: sleepRes?.data?.data || { list: [], totalCount: 0 },
            play: playRes?.data?.data || { list: [], totalCount: 0 },
            community: commRes?.data?.data || { list: [], totalCount: 0 }
          });
        } else if (currentTab === 'places') {
          const res = await api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=${currentCategory}&page=${currentPage}&size=12`);
          setPlaceData(res?.data?.data || { list: [], totalCount: 0, totalPages: 1 });
        } else if (currentTab === 'communities') {
          const res = await api.get(`/search/communities?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=12`);
          setCommunityData(res?.data?.data || { list: [], totalCount: 0, totalPages: 1 });
        }
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword, currentTab, currentCategory, currentPage]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName, category: 'ALL', page: 1 });
  };

  const handleCategoryChange = (catCode) => {
    setSearchParams({ tab: currentTab, category: catCode, page: 1 });
  };

  const handlePageChange = (page) => {
    setSearchParams({ tab: currentTab, category: currentCategory, page });
  };

  if (loading) return <ListSkeleton />;

  const totalIntegratedCount = 
    (integratedData.see.totalCount) + (integratedData.food.totalCount) + 
    (integratedData.sleep.totalCount) + (integratedData.play.totalCount) + 
    (integratedData.community.totalCount);

  // 🚀 3. 렌더링 헬퍼 함수 개선: 새로운 데이터 매핑 및 동적 URL 적용
  const renderIntegratedSection = (title, dataObj, targetCategoryCode, isCommunity = false) => (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-4 border-b pb-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">{title} <span className="text-sm font-normal text-[#0F9B73]">({dataObj.totalCount})</span></h3>
        {dataObj.totalCount > 4 && (
          <button 
            onClick={() => isCommunity ? handleTabChange('communities') : setSearchParams({ tab: 'places', category: targetCategoryCode, page: 1 })} 
            className="text-sm text-gray-500 hover:text-[#0F9B73] transition-colors"
          >
            더보기 →
          </button>
        )}
      </div>
      
      {dataObj.list?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dataObj.list.map((item) => (
            isCommunity ? (
              // 커뮤니티 카드는 기존 유지
              <div key={item.commNo} onClick={() => navigate(`/showcase/view/${item.commNo}`)} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md cursor-pointer">
                <img src={item.commMainImgUrl || 'https://via.placeholder.com/400x300'} alt={item.commTitle} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="font-bold text-gray-900 truncate">{item.commTitle}</div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>{item.mbrNickname}</span>
                    <span>♥ {item.commLikeCnt}</span>
                  </div>
                </div>
              </div>
            ) : (
              <AreaListCard 
                key={item.plcNo} 
                item={{ 
                  id: item.plcNo, 
                  name: item.plcName, 
                  image: item.plcMainImgUrl, 
                  desc: item.plcOverview, 
                  category: item.plcCatCd,
                  address: item.plcAddr,       
                  rating: item.plcAvgRating,   
                  reviewCount: item.plcReviewCnt 
                }} 
                onClick={() => navigate(`/${currentRegion}/${getCategoryPath(item.plcCatCd)}/view?id=${item.plcNo}`)}
                // 🚀 핵심: 찜하기 컴포넌트를 AreaListCard 내부에 주입
                renderHeart={() => (
                  <WishlistHeartButton 
                    item={{
                      id: item.plcNo,
                      name: item.plcName,
                      image: item.plcMainImgUrl,
                      category: item.plcCatCd,
                      address: item.plcAddr
                    }} 
                    itemType={getCategoryPath(item.plcCatCd)} 
                    region={currentRegion} 
                  />
                )}
              />
            )
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <span className="text-3xl mb-2 block opacity-50">🔍</span>
          <p className="text-sm">'{keyword}'에 대한 {title} 검색 결과가 없습니다.</p>
        </div>
      )}
    </section>
  );
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
        <span className="text-[#0F9B73]">'{keyword}'</span> 검색 결과 
        {currentTab === 'all' && ` (${totalIntegratedCount}건)`}
      </h2>

      {/* 탭 네비게이션 */}
      <div className="flex justify-center mb-8 border-b border-gray-200">
        {[
          { key: 'all', label: '통합 검색' },
          { key: 'places', label: `장소` },
          { key: 'communities', label: `뽐낼거리` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-6 py-3 font-semibold text-sm transition-colors ${
              currentTab === tab.key 
              ? 'text-[#0F9B73] border-b-2 border-[#0F9B73]' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 카테고리 필터 (장소 탭 한정) */}
      {currentTab === 'all' && (
        <div className="space-y-4">
          {renderIntegratedSection('볼거리', integratedData.see, 'PLC001')}
          {renderIntegratedSection('먹거리', integratedData.food, 'PLC003')}
          {renderIntegratedSection('잘거리', integratedData.sleep, 'PLC004')}
          {renderIntegratedSection('놀거리', integratedData.play, 'PLC002')}
          {renderIntegratedSection('뽐낼거리', integratedData.community, null, true)}
        </div>
      )}

      {/* 🚀 3. 장소 탭 렌더링 (이곳도 찜하기 버튼 주입) */}
      {currentTab === 'places' && (
        <>
          {placeData?.list?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {placeData.list.map(place => (
                <AreaListCard 
                  key={place.plcNo} 
                  item={{ 
                    id: place.plcNo, 
                    name: place.plcName, 
                    image: place.plcMainImgUrl, 
                    desc: place.plcOverview, 
                    category: place.plcCatCd,
                    address: place.plcAddr,       
                    rating: place.plcAvgRating,   
                    reviewCount: place.plcReviewCnt 
                  }} 
                  onClick={() => navigate(`/${currentRegion}/${getCategoryPath(place.plcCatCd)}/view?id=${place.plcNo}`)} 
                  // 🚀 핵심: 찜하기 컴포넌트 주입
                  renderHeart={() => (
                    <WishlistHeartButton 
                      item={{
                        id: place.plcNo,
                        name: place.plcName,
                        image: place.plcMainImgUrl,
                        category: place.plcCatCd,
                        address: place.plcAddr
                      }} 
                      itemType={getCategoryPath(place.plcCatCd)} 
                      region={currentRegion} 
                    />
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-4xl mb-3 block opacity-50">🔍</span>
              선택한 카테고리에 일치하는 장소가 없습니다.
            </div>
          )}
          <Pagination page={currentPage} totalPages={placeData?.totalPages || 1} onPageChange={handlePageChange} />
        </>
      )}

      {/* 뽐낼거리 탭 렌더링 */}
      {currentTab === 'communities' && (
        <>
          {communityData?.list?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {communityData.list.map((post) => (
                <div key={post.commNo} onClick={() => navigate(`/showcase/view/${post.commNo}`)} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md cursor-pointer">
                  <img src={post.commMainImgUrl || 'https://via.placeholder.com/400x300'} alt={post.commTitle} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="font-bold text-gray-900 line-clamp-1">{post.commTitle}</div>
                    <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
                      <span>👤 {post.mbrNickname}</span>
                      <span className="text-red-500">♥ {post.commLikeCnt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-4xl mb-3 block opacity-50">🔍</span>
              일치하는 뽐낼거리가 없습니다.
            </div>
          )}
          <Pagination page={currentPage} totalPages={communityData?.totalPages || 1} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default SearchPage;