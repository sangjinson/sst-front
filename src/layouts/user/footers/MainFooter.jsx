import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import { useConfig } from '@hooks/useConfig'; // Config 훅
import '@assets/css/footer.css';

import AOS from "aos";
import "aos/dist/aos.css";

const MainFooter = () => {
  useEffect(() => { AOS.init(); }, []);

  const { getConfig } = useConfig();

  // 데이터들을 config에서 추출
  const companyName = getConfig('logoText', '거리에섯');
  const zipCode = getConfig('footer.zipCode', '');
  const address = getConfig('footer.address', '');
  const phone = getConfig('footer.phone', '');
  const fax = getConfig('footer.fax', '');
  const slogan = getConfig('footer.slogan', '');
  const subSlogan = getConfig('footer.subSlogan', '');
  const copyright = getConfig('footer.copyright', '');
  const portfolioNotice = getConfig('footer.portfolioNotice', '');
  const devTeam = getConfig('footer.devTeam', []);

  return (
    <footer className="w-full bg-[#2B4A48] text-[#e0e0e0] py-5 text-[13px] leading-relaxed">
      <div className="container mx-auto px-[20px] lg:px-[250px]">
        
        {/* 1. 상단 섹션: 로고 */}
        <div className="w-full mt-3 mt-md-5 mb-3">
          <h2 className="fs-10 footer-logo text-white font-griun font-black">{companyName}</h2>
        </div>

        {/* 2. 중단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 pb-5 border-b border-white/10 items-start">

          {/* 왼쪽: Contract */}
          <div className="flex flex-col gap-2 md:gap-4" >
            <h3 className="text-gray-100 font-bold fs-6 fs-md-8 leading-none border-b border-white/20 pb-3 md:pb-6">
              Contract
            </h3>

            <div className="text-gray-300 leading-[2] space-y-1">
              <p className="m-0">({zipCode}) {address}</p>
              <p className="m-0">
                <span className="font-semibold">대표전화 {phone}</span>
                <span className="mx-2">|</span>
                <span className="font-semibold">팩스 {fax}</span>
              </p>
            </div>

            <div className="text-gray-300 leading-[1.8]">
              {slogan}<br />
              {subSlogan}
            </div>
          </div>

          {/* 오른쪽: Dev Team */}
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="text-gray-100 font-bold fs-6 fs-md-8 leading-none border-b border-white/20 pb-3 md:pb-6">
              Dev Team
            </h3>

            {/* 💡 배열 데이터를 map으로 돌려 처리하므로 팀원이 늘어나거나 줄어들어도 유연하게 대응합니다. */}
            <ul className="list-none p-0 m-0 text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-x-6 leading-[2]">
              {devTeam.map((member, idx) => (
                <li key={idx}>{member.name} {member.email}</li>
              ))}
            </ul>

            <div className="text-gray-300 border-t border-white/20 pt-3 md:border-t-0 md:pt-0 font-bold">
              <ul className="flex items-center text-gray-300 border-white/20 pt-3 md:pt-0 font-bold list-none">
                <li>
                  <Link to="/customersupport/notice" className="text-white hover:text-sky-400! transition-colors duration-200">공지사항</Link>
                </li>
                <li className="mx-2.5 text-white/30" aria-hidden="true">|</li>
                <li>
                  <Link to="/customersupport/faq" className="text-white hover:text-sky-400! transition-colors duration-200">자주하는 질문</Link>
                </li>
              </ul>
            </div>
          </div>
          
        </div>

        {/* 3. 하단 섹션: 카피라이트 */}
        <div className="mt-3 fs-up-1">
          <p className='text-gray-100'>{copyright}<br/></p>
          <p className='mt-1 text-gray-100 fs-up-1'>&bull; {portfolioNotice}</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;