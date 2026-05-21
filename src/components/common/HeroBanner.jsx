import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import AOS from "aos";
import "aos/dist/aos.css";

const HeroBanner = ({ bgImage, title, subtitle, className = '', to }) => {
  useEffect(() => { AOS.init(); }, []);
  const navigate = useNavigate();

  return (
    <section
      onClick={() => to && navigate(to)}
      className={`w-full bg-cover bg-center flex justify-center items-center relative transition-all duration-500 ${className} h-[200px] md:h-[300px] ${to ? 'cursor-pointer' : ''}`}
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      {/* ✅ to가 있으면 호버 효과 */}
      {to && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 z-10" />
      )}

      <div className="relative z-20 text-center text-white drop-shadow-md">
        <h1 className="fs-up-10 md:text-[80px] mb-[15px] font-black" data-aos="fade">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[18px] md:text-[24px] font-medium tracking-[2px]" data-aos="fade-up" data-aos-once="true">
            {subtitle}
          </p>
        )}
        {/* ✅ to 있으면 클릭 안내 텍스트 */}
        {to && (
          <p className="mt-2 text-sm text-white/70">
            클릭하면 {title} 메인페이지로 이동해요
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;