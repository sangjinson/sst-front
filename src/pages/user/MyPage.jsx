// src/pages/user/MyPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

// 🚀 공통 브레드크럼 컴포넌트 임포트! (경로 확인해주세요)
import Breadcrumb from '@components/common/Breadcrumb';

// ─────────────────────────────────────────
// 더미 데이터
// ─────────────────────────────────────────
const DUMMY_POSTS = [
  { id: 1, title: "경기도 화성 1일차", desc: "화성행궁 다녀왔습니다.", image: "https://images.unsplash.com/photo-1590393275627-0c46bc8ea23c?w=400&q=80", likes: 30, author: "경기도 청년" },
  { id: 2, title: "수원 왕갈비 투어", desc: "수원 통닭거리도 가봤어요!", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80", likes: 62, author: "부산 소녀" },
  { id: 3, title: "경기도에 이런 곳이!", desc: "경기도에 이런 곳이 있네요??", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", likes: 5, author: "thstkdwls13" },
];

const DUMMY_SCHEDULES = [
  { id: 1, title: "이천 여행", startDate: "2026.02.25", endDate: "2026.02.27", status: "여행완료" },
  { id: 2, title: "엄마랑 고양 여행~~^", startDate: "2026.03.30", endDate: "2026.04.01", status: "여행 완료" },
  { id: 3, title: "친구들이랑 3일 슈웃", startDate: "2026.04.20", endDate: "2026.04.23", status: "여행 예정" },
];

const STATUS_COLOR = {
  "여행완료":  { bg: "#d1fae5", color: "#065f46" },
  "여행 완료": { bg: "#d1fae5", color: "#065f46" },
  "여행 예정": { bg: "#fef3c7", color: "#92400e" },
  "여행중":    { bg: "#dbeafe", color: "#1e40af" },
};

const ITEMS_PER_PAGE = 8;

function getFoodLikes() {
  try { return JSON.parse(localStorage.getItem("food_likes")) || []; }
  catch { return []; }
}

// ─────────────────────────────────────────
// 페이지네이션
// ─────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "28px", flexWrap: "wrap" }}>
    <button onClick={() => onPageChange(Math.max(1, page - 1))} style={pageBtnStyle(false)}>&lt;</button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button key={p} onClick={() => onPageChange(p)} style={pageBtnStyle(p === page)}>{p}</button>
    ))}
    <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} style={pageBtnStyle(false)}>&gt;</button>
  </div>
);
const pageBtnStyle = (active) => ({
  width: "34px", height: "34px", borderRadius: "50%",
  border: active ? "none" : "1px solid #e5e7eb",
  background: active ? "#0F9B73" : "#fff",
  color: active ? "#fff" : "#374151",
  cursor: "pointer", fontWeight: active ? 700 : 400, fontSize: "0.85rem",
});

// ─────────────────────────────────────────
// 섹션: 회원정보
// ─────────────────────────────────────────
const labelStyle = { fontSize: "0.75rem", color: "#9ca3af", display: "block", marginBottom: "4px" };
const inputStyle = {
  width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb",
  borderRadius: "8px", fontSize: "0.88rem", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};

const MemberInfo = ({ profile, onUpdate }) => {
  const [form, setForm] = useState({ ...profile, password: "", passwordConfirm: "", address: "", detailAddress: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (form.password && form.password !== form.passwordConfirm) { alert("비밀번호가 일치하지 않습니다."); return; }
    onUpdate({ name: form.name, phone: form.phone, email: form.email, location: form.location });
    alert("회원정보가 수정되었습니다.");
  };
  return (
    <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", fontWeight: 700, marginBottom: "20px" }}>회원 정보</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* 프로필 미리보기 */}
        <div style={{ width: "clamp(160px, 20vw, 200px)", background: "#f9fafb", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", border: "1px solid #e5e7eb", flexShrink: 0 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>마이페이지</p>
          <div style={{ position: "relative" }}>
            <img src="https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png" alt="프로필" style={{ width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", border: "3px solid #0F9B73" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, background: "#0F9B73", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", cursor: "pointer" }}>✎</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{form.name} 📍</div>
          <div style={{ fontSize: "0.72rem", color: "#6b7280", textAlign: "center", lineHeight: 1.5 }}>안녕하세요! {form.name}입니다.<br />리액트 참 좋네요!</div>
          <div style={{ width: "100%", marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {[["♦", form.location, false], ["♦", "가입일: 2026-04-10", false], ["♦", form.phone, true], ["♦", form.email, true]].map(([icon, text, green], i) => (
              <div key={i} style={{ fontSize: "0.72rem", color: green ? "#0F9B73" : "#6b7280", display: "flex", gap: "4px" }}><span>{icon}</span><span style={{ wordBreak: "break-all" }}>{text}</span></div>
            ))}
          </div>
        </div>
        {/* 수정 폼 */}
        <div style={{ flex: 1, minWidth: "240px", background: "#fff", borderRadius: "14px", padding: "clamp(16px, 3vw, 22px)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px" }}>정보수정</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
            {[["name","이름","text"],["phone","연락처","text"],["password","비밀번호","password"],["passwordConfirm","비밀번호 확인","password"]].map(([n,l,t]) => (
              <div key={n}><label style={labelStyle}>{l}</label><input name={n} type={t} value={form[n]} onChange={handleChange} placeholder="필수입력 입니다." style={inputStyle} /></div>
            ))}
            <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>이메일</label><input name="email" value={form.email} onChange={handleChange} placeholder="필수입력 입니다." style={inputStyle} /></div>
            <div><label style={labelStyle}>우편번호</label><input placeholder="필수입력 입니다." style={inputStyle} /></div>
            <div style={{ display: "flex", alignItems: "flex-end" }}><button style={{ width: "100%", padding: "10px", background: "#0F9B73", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>주소검색</button></div>
            <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>주소</label><input name="address" value={form.address} onChange={handleChange} placeholder="주소검색을 클릭하세요." style={inputStyle} /></div>
            <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>상세주소</label><input name="detailAddress" value={form.detailAddress} onChange={handleChange} placeholder="필수입력 입니다." style={inputStyle} /></div>
            <div><label style={labelStyle}>거주지</label><input name="location" value={form.location} onChange={handleChange} placeholder="예) 경기도 수원시" style={inputStyle} /></div>
          </div>
          <button onClick={handleSave} style={{ marginTop: "16px", width: "100%", padding: "11px", background: "#0F9B73", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 뽐낼거리
// ─────────────────────────────────────────
const MyShowcase = () => {
  const [page, setPage] = useState(1);
  return (
    <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", fontWeight: 700, marginBottom: "18px" }}>내 뽐낼 거리</h2>
      <div className="showcase-grid">
        {DUMMY_POSTS.map((post) => (
          <div key={post.id} style={{ background: "#fff", borderRadius: "14px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{post.author}</span>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}><span style={{ color: "#ef4444" }}>♥</span> {post.likes}</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{post.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={3} onPageChange={setPage} />
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 일정관리
// ─────────────────────────────────────────
const MySchedule = () => {
  const [page, setPage] = useState(1);
  return (
    <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", fontWeight: 700, marginBottom: "18px" }}>내 일정 관리</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
              {["번호", "제목", "여행 날짜", "상태"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_SCHEDULES.map((s) => {
              const sc = STATUS_COLOR[s.status] || { bg: "#f3f4f6", color: "#374151" };
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "16px 14px", fontSize: "0.88rem", color: "#6b7280" }}>{s.id}</td>
                  <td style={{ padding: "16px 14px", fontSize: "0.88rem", fontWeight: 500 }}>{s.title}</td>
                  <td style={{ padding: "16px 14px", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.8, whiteSpace: "nowrap" }}>{s.startDate}<br />~<br />{s.endDate}</td>
                  <td style={{ padding: "16px 14px" }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: "4px 12px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>{s.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={3} onPageChange={setPage} />
    </div>
  );
};

// ─────────────────────────────────────────
// 섹션: 내 찜목록
// ─────────────────────────────────────────
const MyWishlist = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => { setLikes(getFoodLikes()); }, []);

  const totalPages = Math.ceil(likes.length / ITEMS_PER_PAGE) || 1;
  const currentItems = likes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleRemove = (item) => {
    const updated = likes.filter((f) => !(f.id === item.id && f.name === item.name));
    localStorage.setItem("food_likes", JSON.stringify(updated));
    setLikes(updated);
  };

  return (
    <div style={{ padding: "clamp(16px, 3vw, 28px)" }}>
      <h2 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", fontWeight: 700, marginBottom: "18px" }}>내 찜 목록</h2>
      {likes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💔</div>
          <p style={{ fontSize: "0.9rem" }}>아직 찜한 목록이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {currentItems.map((item, idx) => (
              <div
                key={idx}
                style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", position: "relative" }}
                onClick={() => navigate(`/${item.address?.split(' ')[1] || "수원시"}/food/view?id=${item.id}`, { state: { food: item } })}
              >
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                <div style={{ padding: "10px 12px 28px" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "2px" }}>{item.category}</div>
                </div>
                <div style={{ position: "absolute", bottom: "8px", left: "10px", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "0.65rem", padding: "2px 7px", borderRadius: "9999px" }}>
                  {item.address?.split(' ').slice(0, 2).join(' ')}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                  style={{ position: "absolute", bottom: "6px", right: "8px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                  title="찜 해제"
                >❤️</button>
              </div>
            ))}
          </div>
          {likes.length > ITEMS_PER_PAGE && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// 카드 정의
// ─────────────────────────────────────────
const CARDS = [
  { key: "member",   label: "회원정보",    icon: "👤" },
  { key: "showcase", label: "내 뽐낼거리", icon: "🖼️" },
  { key: "schedule", label: "내 일정관리", icon: "📅" },
  { key: "wishlist", label: "내 찜목록",   icon: "❤️" },
];

// ─────────────────────────────────────────
// MyPage
// ─────────────────────────────────────────
const MyPage = () => {
  const [activeSection, setActiveSection] = useState("member");
  const [profile, setProfile] = useState({
    name: "홍길동",
    phone: "010-5882-1253",
    email: "hong01@ksmart.or.kr",
    location: "경기도 성남시",
  });

  const renderSection = () => {
    switch (activeSection) {
      case "member":   return <MemberInfo profile={profile} onUpdate={setProfile} />;
      case "showcase": return <MyShowcase />;
      case "schedule": return <MySchedule />;
      case "wishlist": return <MyWishlist />;
      default:         return null;
    }
  };

  const sectionLabel = CARDS.find((c) => c.key === activeSection)?.label || "";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .mp-wrap {
          display: flex;
          gap: 24px;
          padding: clamp(16px, 3vw, 30px) clamp(16px, 4vw, 40px);
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Pretendard', sans-serif;
          min-height: 100vh;
          background: #f9fafb;
        }

        /* ── 사이드바 ── */
        .mp-sidebar {
          width: 220px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mp-box {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .mp-box h3 { font-size: 0.9rem; font-weight: 700; color: #374151; margin: 0 0 14px 0; }
        .mp-profile-center { display: flex; flex-direction: column; align-items: center; gap: 7px; margin-bottom: 14px; }
        .mp-avatar { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 3px solid #0F9B73; }
        .mp-name { font-weight: 700; font-size: 0.95rem; color: #111; }
        .mp-desc { font-size: 0.75rem; color: #6b7280; text-align: center; line-height: 1.5; }
        .mp-info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
        .mp-info-list li { font-size: 0.78rem; color: #374151; display: flex; align-items: flex-start; gap: 6px; }
        .mp-link-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .mp-link-list a { text-decoration: none; color: inherit; }
        .mp-link-list li { font-size: 0.82rem; color: #374151; display: flex; align-items: center; gap: 8px; padding: 5px 0; cursor: pointer; transition: color 0.2s; }
        .mp-link-list li:hover { color: #0F9B73; }

        /* ── 메인 ── */
        .mp-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; }

        /* ── 카드 4개 행 ── */
        .mp-card-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        /* ── 상단 카드 ── */
        .mp-stat-card {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .mp-stat-card:hover {
          border-color: #0F9B73;
          box-shadow: 0 4px 14px rgba(15,155,115,0.12);
          transform: translateY(-2px);
        }
        .mp-stat-card.active {
          border-color: #0F9B73;
          background: #f0fdf9;
          box-shadow: 0 4px 14px rgba(15,155,115,0.15);
        }
        .mp-stat-card .card-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          align-self: flex-start;
        }
        .mp-stat-card.active .card-label { color: #0F9B73; }
        .mp-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 3px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          transition: border-color 0.2s;
        }
        .mp-stat-card.active .mp-circle { border-color: #0F9B73; }

        /* ── 섹션 패널 ── */
        .mp-section-panel {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          min-height: 300px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── 그리드: 뽐낼거리 ── */
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* ── 그리드: 찜목록 ── */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        /* ════════════════════════
           반응형 breakpoints
        ════════════════════════ */

        /* 태블릿 이하 (≤1024px): 사이드바 숨김, 카드 2열 */
        @media (max-width: 1024px) {
          .mp-sidebar { display: none; }
          .mp-card-row { grid-template-columns: repeat(2, 1fr); }
          .wishlist-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* 소형 태블릿 (≤768px): 카드 2열 유지, 그리드 축소 */
        @media (max-width: 768px) {
          .mp-wrap { padding: 16px; gap: 0; }
          .mp-card-row { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .showcase-grid { grid-template-columns: repeat(2, 1fr); }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr); }
          .mp-circle { width: 48px; height: 48px; font-size: 1.2rem; }
        }

        /* 모바일 (≤480px): 카드 2열, 그리드 1열 */
        @media (max-width: 480px) {
          .mp-card-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .mp-stat-card { padding: 14px 10px; gap: 8px; }
          .mp-stat-card .card-label { font-size: 0.78rem; }
          .mp-circle { width: 42px; height: 42px; font-size: 1rem; }
          .showcase-grid { grid-template-columns: 1fr; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="mp-wrap">

        {/* ── 사이드바 (1024px 이상만 표시) ── */}
        <aside className="mp-sidebar">
          <div className="mp-box">
            <h3>마이페이지</h3>
            <div className="mp-profile-center">
              <img src="https://img1.daumcdn.net/thumb/C500x500.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6qYm/image/eAFjiZeA-fGh8Y327AH7oTQIsxQ.png" alt="프로필" className="mp-avatar" />
              <div className="mp-name">{profile.name} 🏅</div>
              <div className="mp-desc">안녕하세요! {profile.name}입니다.<br />리액트 참 좋네요! 잘 부탁드려요.</div>
            </div>
            <ul className="mp-info-list">
              <li><span>🗺️</span>{profile.location} 거주</li>
              <li><span>📅</span>가입일: 2026-04-10</li>
              <li><span>📞</span>{profile.phone}</li>
              <li><span>✉️</span>{profile.email}</li>
            </ul>
          </div>
          <div className="mp-box">
            <h3>프로필 더보기</h3>
            <ul className="mp-link-list">
              <Link to="/customersupport/notice"><li><span>👤</span> 공지사항</li></Link>
              <Link to="/customersupport/faq"><li><span>🚫</span> 자주 하는 질문</li></Link>
            </ul>
          </div>
        </aside>

        {/* ── 메인 ── */}
        <section className="mp-main">

          {/* 🚀 브레드크럼을 메인 섹션 최상단으로 이동! */}
          <Breadcrumb 
            paths={[
              { label: '홈', to: '/' },
              { label: '마이페이지', to: '/user/mypage' },
              { label: sectionLabel }
            ]} 
            className="mb-0" // 기존 컴포넌트 내부 여백이 있어 0으로 설정
          />

          {/* 카드 4개 고정 */}
          <div className="mp-card-row">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className={`mp-stat-card${activeSection === card.key ? " active" : ""}`}
                onClick={() => setActiveSection(card.key)}
              >
                <span className="card-label">{card.label}</span>
                <div className="mp-circle">{card.icon}</div>
              </div>
            ))}
          </div>

          {/* 섹션 패널 */}
          <div className="mp-section-panel" key={activeSection}>
            {renderSection()}
          </div>

        </section>
      </div>
    </>
  );
};

export default MyPage;