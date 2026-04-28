import { useState } from "react";

const foodData = [
  {
    id: 1,
    name: "수원 왕갈비탕",
    category: "한식",
    rating: 4.8,
    reviews: 324,
    description: "60년 전통의 진한 사골육수로 우려낸 수원 대표 왕갈비탕. 두툼한 갈비살이 일품입니다.",
    address: "경기도 수원시 팔달구 행궁로 45",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    tags: ["전통", "대표음식", "가족식사"],
  },
  {
    id: 2,
    name: "화성 통닭골목",
    category: "한식",
    rating: 4.7,
    reviews: 512,
    description: "수원 화성 인근 유명 통닭골목. 바삭한 튀김옷과 육즙 가득한 통닭이 유명합니다.",
    address: "경기도 수원시 팔달구 정조로 777",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
    tags: ["통닭", "명물거리", "야식"],
  },
  {
    id: 3,
    name: "행궁동 스시 오마카세",
    category: "일식",
    rating: 4.9,
    reviews: 198,
    description: "제철 해산물로 구성된 프리미엄 오마카세. 수원에서 즐기는 도심 속 미식 경험.",
    address: "경기도 수원시 팔달구 행궁로 12",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
    tags: ["오마카세", "프리미엄", "데이트"],
  },
  {
    id: 4,
    name: "수원 짜장면 원조",
    category: "중식",
    rating: 4.5,
    reviews: 276,
    description: "50년 전통의 수타면 짜장면. 춘장의 깊은 맛과 쫄깃한 면발이 특징입니다.",
    address: "경기도 수원시 영통구 영통로 88",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    tags: ["중화요리", "전통", "점심"],
  },
  {
    id: 5,
    name: "인계동 파스타",
    category: "양식",
    rating: 4.6,
    reviews: 145,
    description: "이탈리아 정통 레시피로 만든 수제 파스타. 트러플 크림 파스타가 시그니처입니다.",
    address: "경기도 수원시 팔달구 인계로 55",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    tags: ["파스타", "데이트", "이탈리안"],
  },
  {
    id: 6,
    name: "광교 육회비빔밥",
    category: "한식",
    rating: 4.7,
    reviews: 389,
    description: "신선한 한우 육회와 참기름 향이 어우러진 정통 육회비빔밥. 광교 맛집 1위.",
    address: "경기도 수원시 영통구 광교로 145",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
    tags: ["육회", "비빔밥", "한우"],
  },
  {
    id: 7,
    name: "매탄동 라멘집",
    category: "일식",
    rating: 4.4,
    reviews: 231,
    description: "12시간 우린 돈코츠 육수의 진한 라멘. 일본 현지 감성 그대로 재현한 수원 맛집.",
    address: "경기도 수원시 영통구 매탄로 33",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    tags: ["라멘", "돈코츠", "일식"],
  },
  {
    id: 8,
    name: "팔달문 갈비찜",
    category: "한식",
    rating: 4.8,
    reviews: 467,
    description: "간장 양념에 24시간 재운 특제 갈비찜. 부드러운 육질과 달콤한 양념이 일품.",
    address: "경기도 수원시 팔달구 팔달로 200",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    tags: ["갈비찜", "전통", "명절음식"],
  },
  {
    id: 9,
    name: "영통 스테이크하우스",
    category: "양식",
    rating: 4.6,
    reviews: 162,
    description: "드라이에이징 한우 스테이크 전문점. 풍부한 마블링과 깊은 풍미가 특징.",
    address: "경기도 수원시 영통구 영통로 99",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
    tags: ["스테이크", "한우", "특별한날"],
  },
];

const categories = ["전체", "한식", "중식", "일식", "양식"];

export default function SuwonFoodPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popular");
  const [likedCards, setLikedCards] = useState([]);

  const toggleLike = (id) => {
    setLikedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredData =
    activeCategory === "전체"
      ? foodData
      : foodData.filter((item) => item.category === activeCategory);

  const sortedData = [...filteredData].sort((a, b) =>
    sortBy === "popular" ? b.reviews - a.reviews : b.rating - a.rating
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Pretendard:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .food-page {
          font-family: 'Pretendard', sans-serif;
          background: #f7f5f2;
          min-height: 100vh;
        }

        /* ── BANNER ── */
        .banner {
          position: relative;
          width: 100%;
          height: 320px;
          overflow: hidden;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90');
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease;
        }
        .banner:hover .banner-bg {
          transform: scale(1.03);
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.35) 0%,
            rgba(0,0,0,0.60) 60%,
            rgba(0,0,0,0.80) 100%
          );
        }
        .banner-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }
        .banner-title {
          font-family: 'Nanum Myeongjo', serif;
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.08em;
          line-height: 1.1;
          margin-bottom: 14px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .banner-sub {
          font-family: 'Pretendard', sans-serif;
          font-size: clamp(0.85rem, 2vw, 1.05rem);
          font-weight: 300;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.04em;
          line-height: 1.7;
          text-shadow: 0 1px 8px rgba(0,0,0,0.5);
        }

        /* ── CONTENT WRAPPER ── */
        .content-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── BREADCRUMB ── */
        .breadcrumb-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 20px 0 6px;
          font-size: 0.82rem;
          color: #888;
        }
        .breadcrumb-row span { color: #bbb; }
        .breadcrumb-row a {
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb-row a:hover { color: #333; }
        .breadcrumb-row .bc-active {
          color: #c8860a;
          font-weight: 600;
        }

        /* ── FILTER + SORT ROW ── */
        .filter-sort-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 9px 22px;
          border-radius: 9999px;
          border: 1.5px solid #d9d0c4;
          background: #fff;
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Pretendard', sans-serif;
        }
        .tab-btn:hover {
          border-color: #c8860a;
          color: #c8860a;
        }
        .tab-btn.active {
          background: #c8860a;
          border-color: #c8860a;
          color: #fff;
          font-weight: 600;
        }
        .sort-select {
          padding: 8px 14px;
          border: 1.5px solid #d9d0c4;
          border-radius: 8px;
          font-size: 0.85rem;
          font-family: 'Pretendard', sans-serif;
          color: #555;
          background: #fff;
          cursor: pointer;
          outline: none;
        }
        .sort-select:focus { border-color: #c8860a; }

        /* ── CARD GRID ── */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding-bottom: 60px;
        }
        @media (max-width: 900px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .card-grid { grid-template-columns: 1fr; } }

        .food-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .food-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.13);
        }

        .card-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .food-card:hover .card-img-wrap img {
          transform: scale(1.06);
        }
        .card-category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          backdrop-filter: blur(4px);
          letter-spacing: 0.04em;
        }
        .like-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .like-btn:hover { transform: scale(1.1); }
        .like-btn.liked { background: #fee2e2; }
        .heart-icon {
          width: 16px;
          height: 16px;
          fill: none;
          stroke: #999;
          stroke-width: 2;
          transition: all 0.2s;
        }
        .like-btn.liked .heart-icon {
          fill: #ef4444;
          stroke: #ef4444;
        }

        .card-body {
          padding: 16px 18px 20px;
        }
        .card-name {
          font-family: 'Nanum Myeongjo', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .card-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .star-icon {
          width: 14px;
          height: 14px;
          fill: #f59e0b;
          stroke: none;
        }
        .rating-num {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a1a1a;
        }
        .reviews-num {
          font-size: 0.78rem;
          color: #aaa;
        }
        .card-desc {
          font-size: 0.82rem;
          color: #666;
          line-height: 1.65;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .tag {
          font-size: 0.72rem;
          color: #c8860a;
          background: #fef9ed;
          border: 1px solid #f0d88a;
          border-radius: 9999px;
          padding: 3px 10px;
          font-weight: 500;
        }
        .card-address {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          color: #aaa;
        }
        .pin-icon {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
          stroke: #c8860a;
          fill: none;
          stroke-width: 2;
        }

        /* ── RESULT COUNT ── */
        .result-count {
          font-size: 0.82rem;
          color: #999;
          padding-bottom: 8px;
        }
        .result-count strong { color: #333; }
      `}</style>

      <div className="food-page">
        {/* BANNER */}
        <div className="banner">
          <div className="banner-bg" />
          <div className="banner-overlay" />
          <div className="banner-content">
            <div className="banner-title">수원</div>
            <div className="banner-sub">
              정조의 효심과 화성의 기상이 깃든, 미래를 여는 수반 도시
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-wrap">
          {/* BREADCRUMB */}
          <div className="breadcrumb-row">
            <a href="#">홈</a>
            <span>&gt;</span>
            <a href="#">경기도</a>
            <span>&gt;</span>
            <a href="#">수원시</a>
            <span>&gt;</span>
            <span className="bc-active">먹거리</span>
          </div>

          {/* FILTER + SORT */}
          <div className="filter-sort-row">
            <div className="category-tabs"> 
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`tab-btn${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">인기순</option>
              <option value="rating">별점순</option>
            </select>
          </div>

          {/* RESULT COUNT */}
          <div className="result-count">
            총 <strong>{sortedData.length}개</strong>의 먹거리
          </div>

          {/* CARD GRID */}
          <div className="card-grid">
            {sortedData.map((item) => (
              <div className="food-card" key={item.id}>
                <div className="card-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="card-category-badge">{item.category}</span>
                  <button
                    className={`like-btn${likedCards.includes(item.id) ? " liked" : ""}`}
                    onClick={() => toggleLike(item.id)}
                    aria-label="좋아요"
                  >
                    <svg className="heart-icon" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <div className="card-name">{item.name}</div>
                  <div className="card-rating-row">
                    <svg className="star-icon" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="rating-num">{item.rating}</span>
                    <span className="reviews-num">({item.reviews}개 리뷰)</span>
                  </div>
                  <p className="card-desc">{item.description}</p>
                  <div className="card-tags">
                    {item.tags.map((tag) => (
                      <span className="tag" key={tag}>#{tag}</span>
                    ))}
                  </div>
                  <div className="card-address">
                    <svg className="pin-icon" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}