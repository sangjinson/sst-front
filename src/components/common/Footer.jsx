import React from 'react';
import '@assets/css/footer.css'; // 분리한 CSS 파일 임포트
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* 왼쪽 섹션 */}
        <div className="footer-left">
          <h2 className="footer-logo">거리에섯</h2>
          <p className="footer-description">
            숨겨진 경기도의 매력을 발견하세요.<br />
            나만의 완벽한 여행 일정을 AI와 함께 쉽게 계획할 수 있습니다.
          </p>
          <div className="footer-info">
            <p>(54888) 전북특별자치도 전주시 덕진구 기린대로 499</p>
            <p><strong>대표전화 010-8728-4276</strong> | <strong>팩스 02-123-1234</strong></p>
          </div>
          <div className="footer-links">
            <Link to="/customersupport/notice" style={{ color: "#fff" }}><span>고객지원</span></Link>
            <Link to="/customersupport/notice" style={{ color: "#fff" }}><span>공지사항</span></Link>
            <Link to="/customersupport/faq" style={{ color: "#fff" }}><span>자주하는 질문</span></Link>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="footer-right">
          <ul className="footer-team-list">
            <li>김영훈 weed3029@gmail.com</li>
            <li>김지태 jtkim4510@gmail.com</li>
            <li>노승현 dlfakxm12@gmail.com</li>
            <li>소제우 sjo8080@naver.com</li>
            <li>손상진 thstkdwls13@naver.com</li>
            <li>한상인 blueunycon@gmail.com</li>
          </ul>
        </div>
      </div>
      
      {/* 하단 카피라이트 섹션 */}
      <div className="footer-bottom-bar">
        <p>본 사이트는 팀 [SST]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며, 일체의 상업적 목적이 없음을 밝힙니다. © 2026 SST. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;