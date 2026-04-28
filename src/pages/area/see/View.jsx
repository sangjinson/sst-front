import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from '@components/common/Breadcrumb';
import { ClipButton, HeartButton } from '@components/card/AttractionCard';
import { getSeeDataByRegion } from './seeData';
import { toKorRegion } from '@utils/regionMap';


const SeeDetail = () => {
  const { region: regionParam } = useParams();
  const [searchParams] = useSearchParams();
  const region = (regionParam || '수원').replace(/시$/, '');
  const itemId = searchParams.get('id');
  const regionKor = toKorRegion(regionParam);
  const item = getSeeDataByRegion(regionKor).find((seeItem) => String(seeItem.id) === String(itemId));

  const [liked, setLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

// 상태 (컴포넌트 상단에 추가)
const [rating, setRating] = useState(0);
const [hover, setHover] = useState(0);
const [content, setContent] = useState("");

const [reviews, setReviews] = useState([
  {
    id: 1,
    name: "5스틴",
    rating: 5,
    content: "분위기 최고 👍",
    date: "2026-04-26",
    isMine: false,
  },
  {
    id: 2,
    name: "여행가 영훈",
    rating: 4,
    content: "좋아요!",
    date: "2026-04-25",
    isMine: true,
  },
]);

// 별점 텍스트
const ratingText = {
  1: "많이 아쉬워요",
  2: "그냥 그래요",
  3: "나름 괜찮아요",
  4: "좋아요",
  5: "최고예요",
};

// 평균 평점 계산
const ratingAvg =
  reviews.length === 0
    ? 0
    : reviews.reduce((acc, cur) => acc + cur.rating, 0) /
      reviews.length;

// 리뷰 등록
const handleSubmit = () => {
  if (!rating || !content) return;

  const newReview = {
    id: Date.now(),
    name: "나",
    rating,
    content,
    date: new Date().toISOString().slice(0, 10),
    isMine: true,
  };

  setReviews([newReview, ...reviews]);
  setRating(0);
  setContent("");
};

// 삭제
const handleDelete = (id) => {
  setReviews(reviews.filter((r) => r.id !== id));
};

const getCurrentUrl = () => window.location.href;

const handleShareClick = () => {
  setIsShareOpen((prev) => !prev);
  setCopied(false);
};

const handleCopyLink = async () => {
  const url = getCurrentUrl();

  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  setCopied(true);
};

  if (!item) {
    return (
      <div className="bg-[#f8f6f0] min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">볼거리 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);

  return (
    <div className="bg-[#f8f6f0] min-h-screen">

      <div className="max-w-[1000px] mx-auto px-4 py-12">
        {/* 🔥 HERO (완전 개선) */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-14">

          <img
            src={item.image}
            alt={item.title}
            className="w-full h-[420px] object-cover hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-8 text-white">
            <p className="text-sm opacity-80 mb-1">{item.location}</p>
            <h1 className="text-4xl font-bold">{item.title}</h1>
          </div>

          {/* 버튼 */}
          <div className="absolute top-5 right-5 flex gap-3">
            <ClipButton onClick={handleShareClick} />
            <HeartButton liked={liked} onClick={() => setLiked(!liked)} />

          </div>

          {isShareOpen && (
            <div className="absolute top-[70px] right-5 w-[320px] max-w-[calc(100%-40px)] rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                페이지 링크
              </p>

              <div className="flex gap-2">
                <input
                  value={getCurrentUrl()}
                  readOnly
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none"
                />

                <button
                  onClick={handleCopyLink}
                  className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition cursor-pointer"
                >
                  복사
                </button>
              </div>

              {copied && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  링크가 복사되었습니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 🔥 설명 */}
        <section className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold mb-4">상세 설명</h2>

          <p className={`text-gray-600 leading-relaxed text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
            {item.desc}
          </p>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 text-emerald-600 text-sm hover:underline cursor-pointer"
          >
            {isExpanded ? '접기 ▲' : '더보기 ▼'}
          </button>
        </section>

        {/* 🔥 이용정보 (카드화) */}
        <section className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold mb-4">이용 정보</h2>

          <div className="grid grid-cols-2 gap-4">

            {[
              {
                title: '주소',
                value: item.location,
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                )
              },
              {
                title: '이용시간',
                value: '09:00 - 18:00',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                )
              },
              {
                title: '전화번호',
                value: '031-290-3600',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92V21a1 1 0 0 1-1.09 1 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 3.09 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75l.7 3a1 1 0 0 1-.27.95l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a1 1 0 0 1 .95-.27l3 .7a1 1 0 0 1 .75 1z" />
                  </svg>
                )
              },
              {
                title: '이용요금',
                value: '현장 확인',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 1v22M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H6" />
                  </svg>
                )
              },
            ].map((info, i) => (
              <div
                key={i}
                className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition flex items-center gap-4"
              >
                <div className="text-gray-400 shrink-0">
                  {info.icon}
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400 leading-none">{info.title}</p>
                  <p className="font-semibold text-sm text-gray-800 mt-1.5 leading-snug">{info.value}</p>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* 🔥 지도 */}
        <section className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-lg font-bold mb-4">위치</h2>

          <div className="rounded-2xl overflow-hidden h-[260px] bg-gray-200 relative shadow-sm">

            <img
              src="https://picsum.photos/1000/300"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white px-3 py-1 rounded-full shadow text-sm">
                {item.title}
              </div>
              <div className="text-red-500 text-xl text-center">📍</div>
            </div>

          </div>
        </section>

        <section className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
  <h2 className="text-lg font-bold mb-4">
    리뷰 <span className="text-emerald-600">({reviews.length})</span>
  </h2>

  {/* 🔥 총 평점 */}
  <div className="flex items-center gap-3 mb-6">
    <div className="flex text-yellow-400">
      {[1,2,3,4,5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`w-5 h-5 ${
            star <= Math.round(ratingAvg)
              ? 'fill-current'
              : 'text-gray-300'
          }`}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      ))}
    </div>

    <span className="text-lg font-bold">
      {ratingAvg.toFixed(1)}
    </span>

    
  </div>

  {/* 🔥 리뷰 입력 */}
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">

    <div className="flex items-center gap-3 mb-3">

      {/* 별점 */}
      <div className="flex gap-1">
        {[1,2,3,4,5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 24 24"
            className={`w-6 h-6 cursor-pointer transition ${
              (hover || rating) >= star
                ? 'text-yellow-400 scale-110'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        ))}
      </div>

      {/* 점수 + 텍스트 */}
      {rating > 0 && (
        <span className="text-sm text-gray-600">
          {rating}.0 · {ratingText[rating]}
        </span>
      )}
    </div>

    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="리뷰를 남겨주세요"
      className="w-full border rounded-lg p-3 text-sm resize-none"
    />

    <div className="flex justify-end mt-2">
      <button
        onClick={handleSubmit}
        className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-emerald-700 cursor-pointer"
      >
        등록
      </button>
    </div>
  </div>

  {/* 🔥 리뷰 리스트 */}
      
<div className="space-y-3">
  {sortedReviews.map((r) => (
    <div
      key={r.id}
      className="bg-white px-5 py-4 rounded-xl shadow-sm hover:shadow-md transition"
    >

      {/* 🔥 상단: 닉네임 + 별점 */}
      <div className="flex justify-between items-start">

        <div className="text-base font-semibold text-gray-900">
          {r.name}
        </div>

        {/* ⭐ 별점 + 점수 (크게) */}
        <div className="flex items-center gap-1 text-yellow-500 text-base font-semibold">
          <span>
            {'★'.repeat(r.rating)}
            {'☆'.repeat(5 - r.rating)}
          </span>
          <span className="text-gray-600 text-sm ml-1">
            {r.rating}.0
          </span>
        </div>

      </div>

      {/* 🔥 중단: 리뷰 내용 */}
      <div className="text-sm text-gray-700 mt-1 leading-relaxed">
        {r.content}
      </div>

      {/* 🔥 하단: 날짜 + 버튼 */}
<div className="flex justify-end items-center gap-3 mt-auto text-xs">

  {/* 날짜 */}
  <span className="text-gray-400 whitespace-nowrap">
    {r.date}
  </span>

        {/* 버튼 그룹 */}
  <div className="flex items-center gap-1">

    {r.isMine ? (
      <>
        {/* 수정 */}
        <button className="p-1.5 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>

        {/* 삭제 */}
        <button
          onClick={() => handleDelete(r.id)}
          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </>
    ) : (
      /* 신고 */
      <button className="p-1.5 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 22V4" />
          <path d="M4 4h10l-1 3 1 3H4" />
        </svg>
      </button>
    )}

  </div>

</div>

    </div>
  ))}
</div>
</section>

        {/* 🔥 추천 (카드 통일) */}
        <section className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="text-lg font-bold mb-5">연관 추천 볼거리</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {[1,2,3,4].map(i => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition cursor-pointer"
              >
                <img
                  src={`https://picsum.photos/200/150?${i}`}
                  className="w-full h-[120px] object-cover"
                />

                <div className="p-3 text-sm font-semibold text-center">
                  추천 장소 {i}
                </div>
              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
};

export default SeeDetail;
