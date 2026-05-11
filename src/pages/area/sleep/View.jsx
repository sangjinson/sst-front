import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSleepDataById, getSleepDataByRegion } from './Sleepdata';
import { toKorRegion } from '@utils/regionMap';
import { WishlistHeartButton } from '@components/modules/ActionButtons';
import {
  AreaDetailHero,
  AreaDescription,
  AreaInfoSection,
  AreaMap,
  AreaReview,
  AreaRelated,
} from '@components/modules/area/areaview';
import IconSVG from '@components/Icon/IconSVG';
import ViewSkeleton from '@components/skeleton/ViewSkeleton';

const CATEGORIES = ['전체', '호텔/모텔', '콘도', '펜션', '게스트하우스', '캠핑'];

const View = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const regionKor = toKorRegion(region || '수원');

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getSleepDataById(id);
        setItem(data);
      } catch (err) {
        console.error('상세 조회 실패:', err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const fetchRelated = async () => {
      try {
        const all = await getSleepDataByRegion(regionKor);
        const filtered = all
          .filter((s) => s.id !== item.id && s.category === item.category)
          .slice(0, 4);
        setRelatedItems(filtered);
      } catch (err) {
        console.error('연관 추천 조회 실패:', err);
        setRelatedItems([]);
      }
    };
    fetchRelated();
  }, [item, regionKor]);

  if (loading) return <ViewSkeleton />;

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 py-24">
        <div className="text-center">
          <p className="text-5xl mb-4">🏨</p>
          <p className="text-lg">숙소 정보를 찾을 수 없습니다.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 bg-[#0F9B73] text-white rounded-lg text-sm">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AreaDetailHero
        image={item.image}
        name={item.name}
        category={item.category}
        categories={CATEGORIES}
        plcNo={item.plcNo}
        listPath={`/${region}/sleep/list`}
        renderHeart={() => (
          <WishlistHeartButton item={item} itemType="sleep" region={region} />
        )}
      />

      <AreaDescription description={item.description} />

      <AreaInfoSection
        infoItems={[
          { icon: <IconSVG name="location" size={18} className="shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4}/>, label: '주소', value: item.address || '주소 정보 없음' },
          { icon: <IconSVG name="phone" size={18} className="shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={2}/>, label: '전화번호', value: item.phone?.trim() || '전화번호 정보 없음' },
          { icon: <IconSVG name="time" size={18} className="shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4}/>, label: '체크인', value: item.checkIn || '15:00' },
          { icon: <IconSVG name="time" size={18} className="shrink-0 fill-none stroke-[#E8956D] mt-1" strokeWidth={4}/>, label: '체크아웃', value: item.checkOut || '10:00' },
          { icon: <IconSVG name="circleprice" size={18} className="shrink-0 fill-none stroke-[#E8956D]" strokeWidth={4}/>, label: '주차', value: item.parking || '주차 정보 없음' },
          { icon: <IconSVG name="circleprice" size={18} className="shrink-0 fill-none stroke-[#E8956D]" strokeWidth={4}/>, label: '예약', value: item.reservationUrl ? <a href={item.reservationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">🔗 온라인 예약</a> : (item.reservation || '전화 예약 가능합니다.') },
          { icon: <IconSVG name="circleprice" size={18} className="shrink-0 fill-none stroke-[#E8956D]" strokeWidth={4}/>, label: '부대시설', value: item.subFacility || '정보 없음' },
        ]}
        tags={item.facilities || []}
        tagLabel="편의시설"
      />

      <AreaMap lat={item.lat} lng={item.lng} address={item.address} />

      <AreaReview
        plcNo={item.plcNo}
        placeholder="숙소에 대한 솔직한 리뷰를 남겨주세요."
      />

      <AreaRelated
        title="연관 추천 숙소"
        items={relatedItems}
        onItemClick={(rel) => navigate(`/${region}/sleep/view?id=${rel.id}`)}
        nameKey="name"
        categories={CATEGORIES}
      />

      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => { window.scrollTo(0, 0); navigate(`/${region}/sleep/list`); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-xl fs-up-2 font-semibold shadow-lg shadow-black/5 border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200"
        >
          <span className="mb-0.5 text-lg">←</span> 목록으로
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md border border-white/20 rounded-xl text-gray-800 shadow-lg shadow-black/5 hover:bg-white hover:shadow-xl transition-all duration-200"
          title="맨 위로"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default View;