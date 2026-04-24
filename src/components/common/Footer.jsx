import React from 'react';
import '@assets/css/footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#2B4A48] text-[#e0e0e0] py-12 text-[13px] leading-relaxed">
      {/* 최대 너비 1920px, 중앙 정렬, 양옆 250px 고정 마진(여백) */}
      <div className="max-w-[1920px] mx-auto px-[20px] lg:px-[250px]">
        
        {/* 1. 상단 섹션: 로고 단독 배치 */}
        <div className="w-full mb-10">
          <h2 className="footer-logo text-white text-[28px] font-griun font-black">
            거리에섯
          </h2>
        </div>

        {/* 2. 중단 섹션: 왼쪽과 오른쪽 데이터 분리 배치 */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/10">
          
          {/* 왼쪽 영역: 서비스 설명 및 연락처 */}
          <div className="flex-1">
            <p className="mb-6 text-white text-[15px] font-medium">
              숨겨진 경기도의 매력을 발견하세요.<br />
              나만의 완벽한 여행 일정을 AI와 함께 쉽게 계획할 수 있습니다.
            </p>
            <div className="mb-6 space-y-1 text-gray-300">
              <p>(54888) 전북특별자치도 전주시 덕진구 기린대로 499</p>
              <p>
                <span className="font-bold">대표전화 010-8728-4276</span>
                <span className="mx-2">|</span>
                <span className="font-bold">팩스 02-123-1234</span>
              </p>
            </div>
<<<<<<< HEAD
            <div className="flex gap-6 text-gray-300">
              <Link to="/customersupport/notice" className="text-white hover:text-sky-400! transition-colors duration-200">고객지원</Link>
              <Link to="/customersupport/notice" className="text-white hover:text-sky-400! transition-colors duration-200">공지사항</Link>
=======
            <div className="gap-6 text-gray-300">
              <span>고객지원</span>
              <span className="mx-2">|</span>
              <Link to="/customersupport/notice" className="text-white hover:text-sky-400! transition-colors duration-200 mr-2.5">공지사항</Link>
>>>>>>> develop
              <Link to="/customersupport/faq" className="text-white hover:text-sky-400! transition-colors duration-200">자주하는 질문</Link>
            </div>
          </div>

          {/* 오른쪽 영역: 팀원 연락처 (우측 정렬) */}
          <div className="md:text-right">
            <ul className="list-none p-0 m-0 leading-[2.2] text-gray-300">
              <li>김영훈 weed3029@gmail.com</li>
              <li>김지태 jtkim4510@gmail.com</li>
              <li>노승현 dlfakxm12@gmail.com</li>
              <li>소제우 sjo8080@naver.com</li>
              <li>손상진 thstkdwls13@naver.com</li>
              <li>한상인 blueunycon@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* 3. 하단 섹션: 카피라이트 */}
        <div className="pt-6 text-[11px] text-gray-400">
          <p>
            본 사이트는 팀 [SST]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며, 
            일체의 상업적 목적이 없음을 밝힙니다. © 2026 SST. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;