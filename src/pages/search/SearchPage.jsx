import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '@api/axios';
import AreaListCard from '@components/modules/area/arealist/AreaListCard';
import Pagination from '@components/common/Pagination';
import ListSkeleton from '@components/skeleton/ListSkeleton';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import { useAuth } from '@hooks/useAuth';
import { toEnRegion } from '@utils/regionMap';

const PLACE_CATEGORIES = [
  { code: 'ALL',    name: '전체' },
  { code: 'PLC001', name: '볼거리' },
  { code: 'PLC003', name: '먹거리' },
  { code: 'PLC004', name: '잘거리' },
  { code: 'PLC002', name: '놀거리' },
];

const CAT_LABEL_MAP = Object.fromEntries(
  PLACE_CATEGORIES.filter(c => c.code !== 'ALL').map(c => [c.code, c.name])
);

const getCategoryPath = (catCd) => {
  if (catCd === 'PLC001' || catCd === '볼거리') return 'see';
  if (catCd === 'PLC003' || catCd === '먹거리') return 'food';
  if (catCd === 'PLC004' || catCd === '잘거리') return 'sleep';
  if (catCd === 'PLC002' || catCd === '놀거리') return 'play';
  return 'see';
};

// ✅ 커뮤니티 경로 분기
const getCommunityPath = (commCatCd, commNo) => {
  if (commCatCd === 'CMM001') return `/showcase/life/view/${commNo}`;
  return `/showcase/hotplace/view/${commNo}`;
};

const getRegionFromAddr = (addr) => {
  if (!addr) return sessionStorage.getItem('lastVisitedRegion') || 'suwon';
  const match = addr.match(/(\S+시|\S+군)/);
  const korRegion = match ? match[1] : null;
  if (korRegion) {
    const enRegion = toEnRegion(korRegion);
    return enRegion || korRegion;
  }
  return sessionStorage.getItem('lastVisitedRegion') || 'suwon';
};

const SearchPage = () => {
  const { keyword: pathKeyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const keyword         = pathKeyword || searchParams.get('keyword') || '';
  const currentTab      = searchParams.get('tab')      || 'all';
  const currentCategory = searchParams.get('category') || 'ALL';
  const currentPage     = parseInt(searchParams.get('page') || '1', 10);
  const currentRegion   = searchParams.get('region') || null;
  const regionParam     = currentRegion ? `&region=${encodeURIComponent(currentRegion)}` : '';

  const [loading, setLoading]           = useState(true);
  const [wishedPlcNos, setWishedPlcNos] = useState([]);

  const [placeData,     setPlaceData]     = useState({ list: [], totalCount: 0, totalPages: 1 });
  const [communityData, setCommunityData] = useState({ list: [], totalCount: 0, totalPages: 1 });

  const [integratedData, setIntegratedData] = useState({
    see:       { list: [], totalCount: 0 },
    food:      { list: [], totalCount: 0 },
    sleep:     { list: [], totalCount: 0 },
    play:      { list: [], totalCount: 0 },
    community: { list: [], totalCount: 0 },
  });

  const fetchWishStatus = async (plcNos) => {
    if (!user?.mbrId || plcNos.length === 0) return;
    try {
      const res = await api.get('/wishlist/check-bulk', {
        params: { mbrId: user.mbrId, plcNos: plcNos.join(',') }
      });
      setWishedPlcNos(res.data);
    } catch (err) {
      console.error('찜 상태 조회 실패:', err);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) { setLoading(false); return; }

      setLoading(true);
      try {
        if (currentTab === 'all') {
          const [seeRes, foodRes, sleepRes, playRes, commRes] = await Promise.all([
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC001&page=1&size=4${regionParam}`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC003&page=1&size=4${regionParam}`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC004&page=1&size=4${regionParam}`),
            api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=PLC002&page=1&size=4${regionParam}`),
            api.get(`/search/communities?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=12${regionParam}`),
          ]);

          const seeData   = seeRes?.data?.data   || { list: [], totalCount: 0 };
          const foodData  = foodRes?.data?.data  || { list: [], totalCount: 0 };
          const sleepData = sleepRes?.data?.data || { list: [], totalCount: 0 };
          const playData  = playRes?.data?.data  || { list: [], totalCount: 0 };

          setIntegratedData({
            see:       seeData,
            food:      foodData,
            sleep:     sleepData,
            play:      playData,
            community: commRes?.data?.data || { list: [], totalCount: 0 },
          });

          const allPlcNos = [
            ...seeData.list,
            ...foodData.list,
            ...sleepData.list,
            ...playData.list,
          ].map(item => item.plcNo).filter(Boolean);
          await fetchWishStatus(allPlcNos);

        } else if (currentTab === 'places') {
          const res = await api.get(`/search/places?keyword=${encodeURIComponent(keyword)}&category=${currentCategory}&page=${currentPage}&size=12${regionParam}`);
          const data = res?.data?.data || { list: [], totalCount: 0, totalPages: 1 };
          setPlaceData(data);

          const plcNos = data.list.map(item => item.plcNo).filter(Boolean);
          await fetchWishStatus(plcNos);

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
  }, [keyword, currentTab, currentCategory, currentPage, currentRegion]);

  const handleTabChange      = (tabName) => setSearchParams({ tab: tabName, category: 'ALL', page: 1, ...(currentRegion && { region: currentRegion }) });
  const handleCategoryChange = (catCode) => setSearchParams({ tab: currentTab, category: catCode, page: 1, ...(currentRegion && { region: currentRegion }) });
  const handlePageChange     = (page)    => setSearchParams({ tab: currentTab, category: currentCategory, page, ...(currentRegion && { region: currentRegion }) });

  if (loading) return <ListSkeleton />;

  const totalIntegratedCount =
    integratedData.see.totalCount   +
    integratedData.food.totalCount  +
    integratedData.sleep.totalCount +
    integratedData.play.totalCount  +
    integratedData.community.totalCount;

  const renderIntegratedSection = (title, dataObj, targetCategoryCode, isCommunity = false) => (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-4 border-b pb-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">
          {title} <span className="text-sm font-normal text-[#0F9B73]">({dataObj.totalCount})</span>
        </h3>
        {dataObj.totalCount > 4 && (
          <button
            onClick={() =>
              isCommunity
                ? handleTabChange('communities')
                : setSearchParams({ tab: 'places', category: targetCategoryCode, page: 1, ...(currentRegion && { region: currentRegion }) })
            }
            className="text-sm text-gray-500 hover:text-[#0F9B73] transition-colors"
          >
            더보기 →
          </button>
        )}
      </div>

      {dataObj.list?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dataObj.list.map((item) =>
            isCommunity ? (
              <div
                key={item.commNo}
                onClick={() => navigate(getCommunityPath(item.commCatCd, item.commNo))} // ✅ 수정
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <img
                  src={item.commMainImgUrl || 'https://via.placeholder.com/400x300'}
                  alt={item.commTitle}
                  className="w-full h-40 object-cover"
                />
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
                  id:          item.plcNo,
                  name:        item.plcName,
                  image:       item.plcMainImgUrl,
                  desc:        item.plcOverview,
                  category:    CAT_LABEL_MAP[item.plcCatCd] ?? item.plcCatCd,
                  address:     item.plcAddr,
                  rating:      item.plcAvgRating,
                  reviewCount: item.plcReviewCnt,
                }}
                onClick={() =>
                  navigate(`/${getRegionFromAddr(item.plcAddr)}/${getCategoryPath(item.plcCatCd)}/view?id=${item.plcNo}`)
                }
                renderHeart={() => (
                  <WishlistHeartButton
                    item={{
                      id:       item.plcNo,
                      name:     item.plcName,
                      image:    item.plcMainImgUrl,
                      category: CAT_LABEL_MAP[item.plcCatCd] ?? item.plcCatCd,
                      address:  item.plcAddr,
                    }}
                    itemType={getCategoryPath(item.plcCatCd)}
                    region={getRegionFromAddr(item.plcAddr)}
                    initialWished={wishedPlcNos.includes(item.plcNo)}
                  />
                )}
              />
            )
          )}
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
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        <span className="text-[#0F9B73]">'{keyword}'</span> 검색 결과
        {currentTab === 'all' && ` (${totalIntegratedCount}건)`}
      </h2>

      {currentRegion && (
        <p className="text-center text-sm text-gray-500 mb-6">
          📍 <span className="font-bold text-[#0F9B73]">{currentRegion}</span> 지역 내 검색 결과
        </p>
      )}

      <div className="flex justify-center mb-8 border-b border-gray-200">
        {[
          { key: 'all',         label: '통합 검색' },
          { key: 'places',      label: '장소' },
          { key: 'communities', label: '뽐낼거리' },
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

      {currentTab === 'all' && (
        <div className="space-y-4">
          {renderIntegratedSection('볼거리', integratedData.see,       'PLC001')}
          {renderIntegratedSection('먹거리', integratedData.food,      'PLC003')}
          {renderIntegratedSection('잘거리', integratedData.sleep,     'PLC004')}
          {renderIntegratedSection('놀거리', integratedData.play,      'PLC002')}
          {renderIntegratedSection('뽐낼거리', integratedData.community, null, true)}
        </div>
      )}

      {currentTab === 'places' && (
        <>
          <div className="flex gap-2 justify-center mb-6">
            {PLACE_CATEGORIES.map(cat => (
              <button
                key={cat.code}
                onClick={() => handleCategoryChange(cat.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  currentCategory === cat.code
                    ? 'bg-[#0F9B73] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {placeData?.list?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {placeData.list.map(place => (
                <AreaListCard
                  key={place.plcNo}
                  item={{
                    id:          place.plcNo,
                    name:        place.plcName,
                    image:       place.plcMainImgUrl,
                    desc:        place.plcOverview,
                    category:    CAT_LABEL_MAP[place.plcCatCd] ?? place.plcCatCd,
                    address:     place.plcAddr,
                    rating:      place.plcAvgRating,
                    reviewCount: place.plcReviewCnt,
                  }}
                  onClick={() =>
                    navigate(`/${getRegionFromAddr(place.plcAddr)}/${getCategoryPath(place.plcCatCd)}/view?id=${place.plcNo}`)
                  }
                  renderHeart={() => (
                    <WishlistHeartButton
                      item={{
                        id:       place.plcNo,
                        name:     place.plcName,
                        image:    place.plcMainImgUrl,
                        category: CAT_LABEL_MAP[place.plcCatCd] ?? place.plcCatCd,
                        address:  place.plcAddr,
                      }}
                      itemType={getCategoryPath(place.plcCatCd)}
                      region={getRegionFromAddr(place.plcAddr)}
                      initialWished={wishedPlcNos.includes(place.plcNo)}
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
          <Pagination
            page={currentPage}
            totalPages={placeData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {currentTab === 'communities' && (
        <>
          {communityData?.list?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {communityData.list.map((post) => (
                <div
                  key={post.commNo}
                  onClick={() => navigate(getCommunityPath(post.commCatCd, post.commNo))} // ✅ 수정
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <img
                    src={post.commMainImgUrl || 'https://via.placeholder.com/400x300'}
                    alt={post.commTitle}
                    className="w-full h-48 object-cover"
                  />
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
          <Pagination
            page={currentPage}
            totalPages={communityData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;