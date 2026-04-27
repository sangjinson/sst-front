// src/pages/area/food/View.jsx
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFoodDataByRegion } from "./foodData";
import { toKorRegion } from "@utils/regionMap";

const LIKE_KEY = "food_likes";

function getLikes() {
  try { return JSON.parse(localStorage.getItem(LIKE_KEY)) || []; }
  catch { return []; }
}
function saveLikes(likes) {
  localStorage.setItem(LIKE_KEY, JSON.stringify(likes));
}
function isLiked(food) {
  return getLikes().some((item) => item.id === food.id && item.name === food.name);
}
function toggleLikeStorage(food) {
  const likes = getLikes();
  const exists = likes.some((item) => item.id === food.id && item.name === food.name);
  if (exists) {
    saveLikes(likes.filter((item) => !(item.id === food.id && item.name === food.name)));
    return false;
  } else {
    saveLikes([...likes, food]);
    return true;
  }
}

const StarRating = ({ rating, size = "md" }) => {
  const textSize = size === "lg" ? "text-xl" : "text-sm";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`${textSize} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
      ))}
      <span className={`${size === "lg" ? "text-base" : "text-sm"} text-gray-500 ml-1`}>{rating.toFixed(1)}</span>
    </div>
  );
};

const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "1점 - 별로예요", "2점 - 그저 그래요", "3점 - 보통이에요", "4점 - 좋아요", "5점 - 최고예요"];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: "0 2px",
            fontSize: "28px",
            color: star <= (hovered || value) ? "#f59e0b" : "#d1d5db",
            transition: "color 0.15s ease, transform 0.1s ease",
            transform: star <= (hovered || value) ? "scale(1.15)" : "scale(1)",
          }}
          aria-label={`${star}점`}
        >★</button>
      ))}
      <span style={{ fontSize: "0.85rem", color: "#6b7280", marginLeft: "6px" }}>
        {labels[hovered || value] || "별점을 선택해주세요"}
      </span>
    </div>
  );
};

const generateReviews = (foodName) => [
  { user: "미식가" + foodName.slice(0, 1) + "123", rating: 5, comment: `${foodName} 진짜 맛있어요! 강력 추천합니다.` },
  { user: "여행중인밥", rating: 4, comment: "분위기도 좋고 음식도 맛있었어요. 또 오고 싶네요." },
  { user: "동네주민", rating: 5, comment: `${foodName} 단골입니다. 항상 맛이 일정하고 서비스도 좋아요.` },
];

const categoryColor = {
  한식: "bg-red-100 text-red-700",
  중식: "bg-yellow-100 text-yellow-700",
  일식: "bg-blue-100 text-blue-700",
  양식: "bg-purple-100 text-purple-700",
};

export default function FoodView() {
  const { region } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // URL용 영어 region, 표시용 한글 regionKor
  const currentRegion = region || location.state?.selectedRegion || "";
  const currentRegionKor = toKorRegion(currentRegion);

  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    const allFoods = getFoodDataByRegion(currentRegionKor); // ✅ 한글로 데이터 로드

    let food = null;

    if (id) {
      food = allFoods.find((f) => String(f.id) === String(id));
    }

    if (!food && location.state?.food) {
      food = location.state.food;
    }

    if (food) {
      setItem(food);
      setComments(generateReviews(food.name));
      setLiked(isLiked(food));

      const related = allFoods
        .filter((f) => f.id !== food.id && f.category === food.category)
        .slice(0, 4);
      setRelatedItems(related);
    }

    window.scrollTo(0, 0);
  }, [id, currentRegionKor, location.state]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-lg text-gray-400">음식점 정보를 찾을 수 없습니다.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 bg-[#c8860a] text-white rounded-lg text-sm">돌아가기</button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    const result = toggleLikeStorage(item);
    setLiked(result);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    if (selectedRating === 0) {
      alert("별점을 선택해주세요! (1점 ~ 5점)");
      return;
    }
    setComments([...comments, { user: "방문자", rating: selectedRating, comment: newComment }]);
    setNewComment("");
    setSelectedRating(0);
  };

  return (
    <>
      <style>{`
        .food-view-wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px 60px; font-family: 'Pretendard', sans-serif; }
        .like-btn-wrap { position: absolute; top: 16px; right: 16px; z-index: 10; }
        .like-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.9); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.2s ease; backdrop-filter: blur(4px); }
        .like-btn:hover { transform: scale(1.1); }
        .like-btn.liked { background: #fee2e2; }
        .like-btn svg { width: 20px; height: 20px; fill: none; stroke: #aaa; stroke-width: 2; transition: all 0.2s; }
        .like-btn.liked svg { fill: #ef4444; stroke: #ef4444; }
        .review-input-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f1f1; display: flex; flex-direction: column; gap: 12px; }
        .review-rating-label { font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 4px; }
      `}</style>

      <div className="min-h-screen bg-[#f8f6f0]">
        <div className="food-view-wrap">

          {/* 브레드크럼 */}
          <p className="text-sm text-gray-400 mb-4">
            <span className="cursor-pointer hover:text-[#c8860a] transition-colors" onClick={() => navigate("/")}>홈</span>
            {" > "}
            <span className="cursor-pointer hover:text-[#c8860a] transition-colors" onClick={() => navigate(`/${currentRegion}`)}>{currentRegionKor}</span>
            {" > "}
            <span className="cursor-pointer hover:text-[#c8860a] transition-colors" onClick={() => navigate(-1)}>먹거리</span>
            {" > "}
            <span className="text-gray-700 font-medium">{item.name}</span>
          </p>

          {/* 히어로 이미지 */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-96">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${categoryColor[item.category] || "bg-gray-100 text-gray-600"}`}>
                {item.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{item.name}</h1>
              <p className="text-white/80 text-sm mt-1">{currentRegionKor}</p>
            </div>
            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white transition">
              ← 목록으로
            </button>
            <div className="like-btn-wrap">
              <button className={`like-btn${liked ? " liked" : ""}`} onClick={handleLike} aria-label="좋아요">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
            </div>
          </div>

          {/* 찜하기 버튼 */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition text-sm font-medium ${liked ? "bg-red-50 border-red-300 text-red-500" : "bg-white border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-400"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {liked ? "찜 완료" : "찜하기"}
            </button>

            {/* ✅ 공유하기 버튼 추가 */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다!");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-500 hover:border-[#0F9B73] hover:text-[#0F9B73] transition text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              공유하기
            </button>


            {liked && <span className="text-xs text-gray-400">마이페이지 내 찜목록에서 확인할 수 있어요</span>}
          </div>

          {/* 상세 설명 */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
            <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}>{item.description}</p>
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-sm text-[#c8860a] font-medium hover:underline">
              {isExpanded ? "접기 ▲" : "더보기 ▼"}
            </button>
          </div>

          {/* 이용 정보 */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">이용 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div><p className="text-xs text-gray-400 mb-0.5">주소</p><p className="text-sm text-gray-700">{item.address}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div><p className="text-xs text-gray-400 mb-0.5">전화번호</p><p className="text-sm text-gray-700">031-000-0000</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div><p className="text-xs text-gray-400 mb-0.5">영업시간</p><p className="text-sm text-gray-700">11:00 - 21:00</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <div><p className="text-xs text-gray-400 mb-0.5">평균 가격대</p><p className="text-sm font-semibold text-[#c8860a]">10,000원 ~ 30,000원</p></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">태그</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#fef9ed] text-[#c8860a] border border-[#f0d88a] text-xs rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 지도 */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">위치</h2>
            <div className="w-full h-52 rounded-xl overflow-hidden bg-gray-100">
              <iframe
                title="지도" width="100%" height="100%" style={{ border: 0 }}
                loading="lazy" allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(item.address)}&z=15&output=embed`}
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
                <span className="text-sm text-gray-400">({item.reviews}개)</span>
              </div>
            </div>

            {comments.length > 0 ? (
              <div className="flex flex-col gap-3">
                {comments.map((review, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-800">{review.user}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-gray-500">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">아직 작성된 리뷰가 없어요. 첫 번째 리뷰를 남겨보세요! 🍽️</p>
            )}

            {/* 리뷰 작성 */}
            <div className="review-input-section">
              <div>
                <p className="review-rating-label">별점 선택 <span style={{ color: "#ef4444" }}>*</span></p>
                <StarPicker value={selectedRating} onChange={setSelectedRating} />
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#c8860a]"
                  placeholder="따뜻한 리뷰를 남겨주세요."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                />
                <button onClick={handleCommentSubmit} className="px-4 py-2 bg-[#c8860a] text-white rounded-xl text-sm font-medium hover:bg-[#b07509] transition">
                  등록
                </button>
              </div>
            </div>
          </div>

          {/* 연관 추천 음식점 */}
          {relatedItems.length > 0 && (
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{currentRegionKor} 비슷한 음식점</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relatedItems.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/${currentRegion}/food/view?id=${rel.id}`, {
                      state: { food: rel, selectedRegion: currentRegion },
                    })}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl overflow-hidden mb-2">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-[#c8860a] transition-colors">{rel.name}</p>
                    <p className="text-xs text-gray-400">{rel.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 목록으로 */}
          <button onClick={() => navigate(-1)} className="w-full py-4 border border-gray-300 rounded-xl text-sm text-gray-600 font-semibold hover:bg-gray-50 transition">
            목록으로 돌아가기
          </button>

        </div>
      </div>
    </>
  );
}