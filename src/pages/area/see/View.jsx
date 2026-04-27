import { useNavigate, useParams } from "react-router-dom";

const SeeView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // 🔥 상세페이지 (id 있을 때)
  // =========================
  if (id) {
    return (
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* 상단 이미지 */}
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1590490359683-658d3d23f972"
            alt="이미지"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />

          {/* 제목 */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
              수원 화성
            </h1>
            <p>경기도 수원시 팔달구</p>
          </div>
        </div>

        {/* 상세 설명 */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>상세 설명</h2>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            수원 화성은 조선 정조 때 축성된 성곽으로, 세계문화유산으로 지정된 역사적 명소입니다.
            아름다운 성곽과 함께 다양한 문화재를 감상할 수 있습니다.
          </p>
        </div>

        {/* 이용 정보 */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>이용 정보</h2>

          <div style={{ marginTop: "10px" }}>
            <p>📍 주소: 경기도 수원시 팔달구</p>
            <p>⏰ 이용시간: 09:00 ~ 18:00</p>
            <p>💰 이용요금: 1,500원</p>
            <p>📞 전화번호: 031-123-4567</p>
          </div>
        </div>

        {/* 지도 */}
        <div style={{ marginTop: "20px" }}>
          <h2>위치</h2>

          <iframe
            title="map"
            width="100%"
            height="300"
            style={{ border: 0, marginTop: "10px", borderRadius: "10px" }}
            src="https://maps.google.com/maps?q=수원화성&t=&z=13&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>

        {/* 리뷰 */}
        <div style={{ marginTop: "20px" }}>
          <h2>리뷰</h2>

          <input
            placeholder="소중한 리뷰를 남겨주세요."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />

          <button
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            리뷰 등록
          </button>

          {/* 리뷰 리스트 */}
          <div style={{ marginTop: "15px" }}>
            <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              ⭐⭐⭐⭐⭐ 너무 좋았어요!
            </div>
            <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              👍 추천합니다
            </div>
          </div>
        </div>

        {/* 추천 */}
        <div style={{ marginTop: "30px" }}>
          <h2>연관 추천 볼거리</h2>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  width: "23%",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
                onClick={() => navigate(`/area/see/${item}`)}
              >
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  alt="추천"
                  style={{ width: "100%", height: "100px", objectFit: "cover" }}
                />
                <p style={{ padding: "10px" }}>추천 장소 {item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 뒤로가기 */}
        <button
          onClick={() => navigate("/area/see")}
          style={{
            marginTop: "30px",
            padding: "10px 15px",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  // =========================
  // 🔥 리스트페이지 (id 없을 때)
  // =========================
  return (
    <div style={{ padding: "20px" }}>
      <h1>👀 볼거리</h1>

      <div
        onClick={() => navigate("/area/see/1")}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "20px",
          cursor: "pointer",
          borderRadius: "10px",
        }}
      >
        수원 화성
      </div>

      <div
        onClick={() => navigate("/area/see/2")}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginTop: "10px",
          cursor: "pointer",
          borderRadius: "10px",
        }}
      >
        경기전
      </div>
    </div>
  );
};

export default SeeView;