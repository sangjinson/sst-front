import React from "react";


const Notice = () => {
  return (
    <div style={{ display: "flex", padding: "40px" }}>

      {/* 왼쪽 메뉴 */}
      <div style={{ width: "200px", marginRight: "40px" }}>
        <h3>고객지원</h3>
        <hr />
        <p style={{ fontWeight: "bold" }}>공지사항</p>
        <p>자주하는 질문</p>
      </div>

      {/* 오른쪽 내용 */}
      <div style={{ flex: 1 }}>
        <h2>공지사항</h2>

        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th>번호</th>
              <th>제목</th>
              <th>등록일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>운영 시간 변경 안내</td>
              <td>2026.02.25</td>
              <td>안내중</td>
            </tr>
            <tr>
              <td>2</td>
              <td>시스템 점검 안내</td>
              <td>2026.03.30</td>
              <td>안내중</td>
            </tr>
            <tr>
              <td>1</td>
              <td>신규 서비스 오픈 안내</td>
              <td>2026.03.20</td>
              <td>안내중</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Notice;