import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import '@assets/css/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');
  const [searchKeyword, setSearchKeyword] = useState('');

  const citiesSouth = ['수원시', '성남시', '용인시', '안양시', '안산시', '과천시', '광명시', '광주시', '군포시', '부천시', '시흥시', '안성시', '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시', '여주시', '양평군'];
  const citiesNorth = ['고양시', '구리시', '남양주시', '동두천시', '양주시', '의정부시', '파주시', '포천시', '연천군', '가평군'];

  const currentCities = activeTab === '남부' ? citiesSouth : citiesNorth;

  // 🚀 핵심: 선택한 지역 이름을 state로 담아서 메인 페이지로 보냅니다!

  const goToMainPage = (regionName) => {
    navigate(`/${regionName}`);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(searchKeyword); // 검색어 기반으로 이동
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#f8f6f0] bg-cover bg-center"
      // 배경 이미지가 준비되면 아래 주석을 풀고 경로를 넣어주세요
      // style={{ backgroundImage: "url('/images/korean-traditional-bg.jpg')" }}
    >
      {/* 1. 상단 로그인 버튼 영역 */}
      <header className="flex justify-end p-5 md:py-[30px] md:px-[50px]">
        <button className="bg-[#0F9B73] text-white border-none py-[10px] px-[30px] rounded font-bold cursor-pointer text-[14px]">
          로그인
        </button>
      </header>

      {/* 2. 중앙 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center pt-10 pb-20 md:pt-[50px] md:pb-[100px] px-5 w-full">
        
        {/* 거리에섯 로고 */}
        <h1 className="landing-logo text-[60px] md:text-[80px] font-griun text-[#222] mb-10 md:mb-[50px]">
          거리에섯
        </h1>

        {/* 검색창 컨테이너 */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-[20px] md:rounded-[50px] p-4 md:py-[10px] md:px-[20px] w-full max-w-[800px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-10 md:mb-[50px] gap-3 md:gap-0">
          
          <select className="w-full md:w-auto border-b md:border-b-0 md:border-r border-[#ddd] bg-transparent text-[16px] text-[#333] py-2 md:py-[10px] px-[20px] outline-none cursor-pointer text-center md:text-left">
            <option>지역 선택</option>
            <option>테마 선택</option>
          </select>
          
          <input 
            type="text" 
            placeholder="떠나고 싶은 지역이나 테마를 입력하세요" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border-none px-[20px] text-[16px] outline-none w-full text-center md:text-left bg-transparent"
          />
          
          <button 
            onClick={handleSearch} 
            className="w-full md:w-auto bg-[#333] text-white border-none py-3 md:py-[15px] px-[35px] rounded-[30px] text-[16px] cursor-pointer transition-colors duration-200 hover:bg-[#0F9B73]"
          >
            검색
          </button>
        </div>

        {/* 3. 지역 선택 박스 (글래스모피즘 효과) */}
        <div className="bg-white/40 backdrop-blur-[8px] border border-white/50 rounded-[20px] p-5 md:p-[40px] w-full max-w-[1000px]">
          
          {/* 남부/북부 탭 */}
          <div className="flex justify-center gap-[15px] mb-[30px]">
            <button
              className={`py-[12px] px-[40px] text-[16px] font-bold rounded cursor-pointer transition-all duration-200 border-none ${
                activeTab === '남부' 
                  ? 'bg-[#2B4A48] text-white' 
                  : 'bg-white/70 text-[#555]'
              }`}
              onClick={() => setActiveTab('남부')}
            >
              경기 남부
            </button>
            <button
              className={`py-[12px] px-[40px] text-[16px] font-bold rounded cursor-pointer transition-all duration-200 border-none ${
                activeTab === '북부' 
                  ? 'bg-[#2B4A48] text-white' 
                  : 'bg-white/70 text-[#555]'
              }`}
              onClick={() => setActiveTab('북부')}
            >
              경기 북부
            </button>
          </div>

          {/* 5열 도시 버튼 그리드 (모바일 3열) */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-[15px]">
            {currentCities.map((city, index) => (
              <button 
                key={index} 
                onClick={() => goToMainPage(city)}
                className="bg-white/90 border-none py-[18px] px-[10px] rounded-lg text-[16px] font-medium cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 hover:bg-[#0F9B73] hover:text-white hover:-translate-y-[2px]"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        
      </main>

      {/* 4. 공통 푸터 */}
      <Footer />
    </div>
  );
};

export default LandingPage;