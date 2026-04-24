import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FoodView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { food, selectedRegion } = location.state || {};

  // 댓글 상태 관리 (초기 더미 데이터)
  const [comments, setComments] = useState([
    { id: 1, user: "5스틴", text: "여기 진짜 맛있어요! 추천합니다.", date: "2024.03.20" },
    { id: 2, user: "여행가 영혼", text: "수원 오면 꼭 들러야 하는 곳이네요.", date: "2024.03.21" }
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!food) {
      navigate(-1);
    }
    window.scrollTo(0, 0); // 페이지 상단 이동
  }, [food, navigate]);

  if (!food) return null;

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      user: "방문자",
      text: newComment,
      date: new Date().toLocaleDateString()
    };
    setComments([...comments, commentObj]);
    setNewComment("");
  };

  return (
    <>
      <style>{`
        .food-view-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Pretendard', sans-serif;
          color: #333;
        }

        /* 히어로 섹션 */
        .view-hero {
          position: relative;
          width: 100%;
          height: 400px;
          border-radius: 15px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        .view-hero img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          color: #fff;
        }
        .hero-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 5px; }

        /* 섹션 공통 스타일 */
        .section-card {
          background: #fff;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .section-h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; color: #111; }

        /* 상세 설명 */
        .desc-text { line-height: 1.8; color: #666; font-size: 0.95rem; }

        /* 이용 정보 그리드 */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-item { display: flex; align-items: center; gap: 12px; }
        .info-icon { width: 40px; height: 40px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10b981; }
        .info-content dt { font-size: 0.8rem; color: #888; margin-bottom: 2px; }
        .info-content dd { font-size: 0.9rem; font-weight: 600; }

        /* 위치 (지도 더미) */
        .map-placeholder {
          width: 100%;
          height: 300px;
          background: #e5e7eb;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .map-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; }

        /* 댓글 섹션 */
        .comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .comment-input-wrap { display: flex; gap: 10px; margin-bottom: 20px; }
        .comment-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; outline: none; }
        .comment-submit { background: #10b981; color: #fff; border: none; padding: 0 20px; border-radius: 8px; cursor: pointer; }
        
        .comment-list { display: flex; flex-direction: column; gap: 12px; }
        .comment-item { padding: 15px; border-bottom: 1px solid #f1f1f1; display: flex; justify-content: space-between; }
        .comment-user { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; }
        .comment-text { font-size: 0.85rem; color: #555; }
        .comment-date { font-size: 0.75rem; color: #bbb; }
      `}</style>

      <div className="food-view-container">
        {/* 상단 히어로 이미지 영역 */}
        <div className="view-hero">
          <img src={food.image} alt={food.name} />
          <div className="hero-overlay">
            <h1 className="hero-title">{food.name}</h1>
            <p>{selectedRegion} {food.category}</p>
          </div>
        </div>

        {/* 상세 설명 */}
        <section className="section-card">
          <h3 className="section-h3">상세 설명</h3>
          <p className="desc-text">{food.description}</p>
        </section>

        {/* 이용 정보 */}
        <section className="section-card">
          <h3 className="section-h3">이용 정보</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <dt>주소</dt>
                <dd>{food.address}</dd>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <dt>전화번호</dt>
                <dd>031-290-3600</dd>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div className="info-content">
                <dt>이용시간</dt>
                <dd>09:00 - 21:00</dd>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <dt>평균가격대</dt>
                <dd>10,000원 ~ 30,000원</dd>
              </div>
            </div>
          </div>
        </section>

        {/* 위치 섹션 */}
        <section className="section-card">
          <h3 className="section-h3">위치</h3>
          <div className="map-placeholder">
            {/* 실제 지도를 넣으려면 Kakao/Google Map API가 필요합니다. 우선 이미지로 대체 */}
            <img src="https://api.vworld.kr/req/image?key=test&center=127.009,37.285&level=15&size=800,300" className="map-img" alt="map dummy" />
            <div style={{position:'absolute', color:'#ff4d4d', fontWeight:'bold', fontSize:'2rem'}}>📍</div>
          </div>
        </section>

        {/* 댓글 섹션 */}
        <section className="section-card">
          <div className="comment-header">
            <h3 className="section-h3">댓글 ({comments.length})</h3>
            <button className="comment-submit" style={{padding:'5px 12px', height:'auto'}} onClick={handleCommentSubmit}>댓글 쓰기</button>
          </div>
          
          <div className="comment-input-wrap">
            <input 
              className="comment-input" 
              placeholder="따뜻한 댓글을 남겨주세요." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          <div className="comment-list">
            {comments.map(c => (
              <div key={c.id} className="comment-item">
                <div>
                  <div className="comment-user">{c.user}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
                <div className="comment-date">{c.date}</div>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={() => navigate(-1)}
          style={{width:'100%', padding:'15px', borderRadius:'10px', border:'1px solid #ddd', background:'#fff', cursor:'pointer', fontWeight:'600'}}
        >
          목록으로 돌아가기
        </button>
      </div>
    </>
  );
}