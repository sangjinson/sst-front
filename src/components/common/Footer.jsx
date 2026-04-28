import React from 'react';
import '@assets/css/footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#2B4A48] text-[#e0e0e0] py-5 text-[13px] leading-relaxed">
      {/* 최대 너비 1920px, 중앙 정렬, 양옆 250px 고정 마진(여백) */}
      <div className="container mx-auto px-[20px] lg:px-[250px]">
        
        {/* 1. 상단 섹션: 로고 단독 배치 */}
        <div className="w-full mt-3 mt-md-5 mb-3">
          <h2 className="fs-10 footer-logo text-white font-griun font-black">
            거리에섯
          </h2>
        </div>

        {/* 2. 중단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 pb-5 border-b border-white/10 items-start">

          {/* 왼쪽: Contract */}
          <div className="flex flex-col gap-2 md:gap-4">

            <h3 className="text-gray-100 font-bold fs-6 fs-md-8 leading-none border-b border-white/20 pb-3 md:pb-6">
              Contract
            </h3>

            <div className="text-gray-300 leading-[2] space-y-1">
              <p className="m-0">(54888) 전북특별자치도 전주시 덕진구 기린대로 499</p>
              <p className="m-0">
                <span className="font-bold">대표전화 010-8728-4276</span>
                <span className="mx-2">|</span>
                <span className="font-bold">팩스 02-123-1234</span>
              </p>
            </div>

            <div className="text-gray-300 leading-[1.8]">
              숨겨진 경기도의 매력을 발견하세요.<br />
              나만의 완벽한 여행 일정을 AI와 함께 쉽게 계획할 수 있습니다.
            </div>

          </div>

          {/* 오른쪽: Dev Team */}
          <div className="flex flex-col gap-2 md:gap-4">

            <h3 className="text-gray-100 font-bold fs-6 fs-md-8 leading-none border-b border-white/20 pb-3 md:pb-6">
              Dev Team
            </h3>

            <ul className="list-none p-0 m-0 text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-x-6 leading-[2]">
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
        <div className="mt-3 fs-up-1 ">
          <p className='text-gray-100'>© 2026 SST. All rights reserved.<br/></p>
          <p className='mt-1 text-gray-100 fs-up-1'>&bull; 본 사이트는 팀 [SST]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며, 일체의 상업적 목적이 없음을 밝힙니다.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;