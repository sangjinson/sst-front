import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Footer from '@components/common/Footer';
import Header from '@components/common/Header';
import { getSleepDataById, getSleepDataByRegion } from './sleepDummyData';

// 별점 컴포넌트
const StarRating = ({ rating, size = 'md' }) => {
  const textSize = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${textSize} ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
      <span className={`${size === 'lg' ? 'text-base' : 'text-sm'} text-gray-500 ml-1`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// 카테고리 배지 색상
const categoryColor = {
  호텔: 'bg-blue-100 text-blue-700',
  펜션: 'bg-green-100 text-green-700',
  게스트하우스: 'bg-orange-100 text-orange-700',
  모텔: 'bg-gray-100 text-gray-600',
  리조트: 'bg-purple-100 text-purple-700',
};

const View = () => {
  const { region } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;

    // 숙소 단건 조회
    const data = getSleepDataById(id);
    setItem(data);

    // 연관 숙소: 같은 지역에서 본인 제외 최대 4개
    if (data) {
      const all = getSleepDataByRegion(data.region);
      const related = all.filter((d) => d.id !== data.id).slice(0, 4);
      setRelatedItems(related);
    }
  }, [id]);

  // 데이터 없을 때
  if (!item) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex flex-col">
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-5xl mb-4">🏨</p>
            <p className="text-lg">숙소 정보를 찾을 수 없습니다.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-5 py-2 bg-[#0F9B73] text-white rounded-lg text-sm"
            >
              돌아가기
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <div className="max-w-[900px] mx-auto px-4 py-6">

        {/* 브레드크럼 */}
        <p className="text-sm text-gray-400 mb-4">
          <span
            className="cursor-pointer hover:text-[#0F9B73] transition-colors"
            onClick={() => navigate('/')}
          >
            홈
          </span>
          {' > '}
          <span
            className="cursor-pointer hover:text-[#0F9B73] transition-colors"
            onClick={() => navigate(`/${region}`)}
          >
            {region}
          </span>
          {' > '}
          <span
            className="cursor-pointer hover:text-[#0F9B73] transition-colors"
            onClick={() => navigate(`/${region}/sleep/list`)}
          >
            잘거리
          </span>
          {' > '}
          <span className="text-gray-700 font-medium">{item.name}</span>
        </p>

        {/* 대표 이미지 */}
        <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-96">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* 이름 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${
                categoryColor[item.category] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{item.name}</h1>
          </div>
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white transition"
          >
            ← 목록으로
          </button>
        </div>

        {/* 상세 설명 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
          <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {item.description}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-[#0F9B73] font-medium hover:underline"
          >
            {isExpanded ? '접기 ▲' : '더보기 ▼'}
          </button>
        </div>

        {/* 이용 정보 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">이용 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">주소</p>
                <p className="text-sm text-gray-700">{item.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">전화번호</p>
                <p className="text-sm text-gray-700">{item.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">체크인 / 체크아웃</p>
                <p className="text-sm text-gray-700">
                  체크인 {item.checkIn} &nbsp;/&nbsp; 체크아웃 {item.checkOut}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">요금</p>
                <p className="text-sm font-semibold text-[#0F9B73]">{item.price}</p>
              </div>
            </div>
          </div>

          {/* 편의시설 태그 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">편의시설</p>
            <div className="flex flex-wrap gap-2">
              {item.facilities.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">위치</h2>
          <div className="w-full h-52 rounded-xl overflow-hidden bg-gray-100">
            <iframe
              title="지도"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">📍 {item.address}</p>
        </div>

        {/* 평점 & 리뷰 */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">평점 & 리뷰</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={item.rating} size="lg" />
              <span className="text-sm text-gray-400">({item.reviewCount}개)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {item.reviews.map((review, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{review.user}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-500">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* 리뷰 더보기 버튼 */}
          <button className="w-full mt-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
            리뷰 더보기
          </button>
        </div>

        {/* 연관 추천 숙소 */}
        {relatedItems.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">연관 추천 숙소</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedItems.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/${region}/sleep/view?id=${rel.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="h-28 rounded-xl overflow-hidden mb-2">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-[#0F9B73] transition-colors">
                    {rel.name}
                  </p>
                  <p className="text-xs text-gray-400">{rel.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default View;
