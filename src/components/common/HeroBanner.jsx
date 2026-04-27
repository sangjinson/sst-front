import React from 'react';


/**
 * <HeroBanner 
  bgImage={item.image} 
  title={item.name} 
  height="200px" // 🚀 아주 얇은 배너
  className="rounded-b-[40px]" // 🚀 className을 통해 하단 테두리만 둥글게 깎는 것도 가능!
/>
 */
// 🚀 height(높이)와 추가 스타일(className)을 props로 받습니다.
// 기본 높이를 400px로 설정해두면 메인 페이지에서는 따로 안 넘겨줘도 됩니다.
const HeroBanner = ({ bgImage, title, subtitle, className = '' }) => {
  return (
    <section 
      className={`w-full bg-cover bg-center flex justify-center items-center relative transition-all duration-500 ${className} h-[200px] md:h-[300px]`}
      style={{ 
        backgroundImage: `url('${bgImage}')`,
        //height: height // 🚀 props로 받은 높이를 직접 적용합니다.
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 text-center text-white drop-shadow-md">
        <h1 className="font-griun text-[50px] md:text-[80px] mb-[15px] font-black">
          {title} 
        </h1>
        {subtitle && (
          <p className="text-[18px] md:text-[24px] font-medium tracking-[2px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;