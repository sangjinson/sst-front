import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');
  const [searchKeyword, setSearchKeyword] = useState('');

  const citiesSouth = ['수원시', '성남시', '용인시', '안양시', '안산시', '과천시', '광명시', '광주시', '군포시', '부천시', '시흥시', '안성시', '오산시', '의왕시', '이천시', '평택시', '하남시', '화성시', '여주시', '양평군'];
  const citiesNorth = ['고양시', '구리시', '남양주시', '동두천시', '양주시', '의정부시', '파주시', '포천시', '연천군', '가평군'];

  const currentCities = activeTab === '남부' ? citiesSouth : citiesNorth;

  // 🚀 핵심: 선택한 지역 이름을 state로 담아서 메인 페이지로 보냅니다!
  const goToMainPage = (regionName) => {
    navigate('/user', { state: { selectedRegion: regionName } });
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    goToMainPage(searchKeyword); // 검색어 기반으로 이동
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] bg-cover bg-center">
      {/* 로그인 버튼 (모바일에서는 여백 축소) */}
      <header className="flex justify-end py-5 px-5 md:py-8 md:px-12">
        <button className="bg-primary text-white py-2 px-6 md:py-2.5 md:px-8 rounded text-sm font-bold border-none cursor-pointer">
          로그인
        </button>
      </header>

      {/* 중앙 메인 콘텐츠 (반응형 패딩) */}
      <main className="flex-1 flex flex-col items-center pt-10 pb-20 px-5">
        <h1 className="text-[60px] md:text-[80px] font-griun font-black text-gray-900 mb-10 md:mb-[50px]">거리에섯</h1>

        {/* 검색창 */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-[20px] md:rounded-full p-2.5 md:px-5 md:py-2.5 w-full max-w-[800px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-10 md:mb-[50px] gap-3 md:gap-0">
          <select className="w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-200 bg-transparent text-base p-2.5 outline-none cursor-pointer text-gray-800 text-center md:text-left">
            <option>지역 선택</option>
            <option>테마 선택</option>
          </select>
          <input 
            type="text" 
            placeholder="떠나고 싶은 지역이나 테마를 입력하세요" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border-none px-5 text-base outline-none w-full text-center md:text-left"
          />
          <button onClick={handleSearch} className="w-full md:w-auto bg-gray-900 hover:bg-primary text-white border-none py-3 px-8 rounded-full text-base cursor-pointer transition-colors">
            검색
          </button>
        </div>

        {/* 지역 선택 박스 (글래스모피즘) */}
        <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-5 md:p-10 w-full max-w-[1000px]">
          <div className="flex justify-center gap-3.5 mb-8">
            <button
              className={`py-3 px-10 text-base font-bold rounded cursor-pointer transition-colors ${activeTab === '남부' ? 'bg-[#2B4A48] text-white' : 'bg-white/70 text-gray-600'}`}
              onClick={() => setActiveTab('남부')}
            >
              경기 남부
            </button>
            <button
              className={`py-3 px-10 text-base font-bold rounded cursor-pointer transition-colors ${activeTab === '북부' ? 'bg-[#2B4A48] text-white' : 'bg-white/70 text-gray-600'}`}
              onClick={() => setActiveTab('북부')}
            >
              경기 북부
            </button>
          </div>

          {/* 반응형 그리드: 모바일 3열 -> 태블릿 4열 -> 데스크톱 5열 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
            {currentCities.map((city, index) => (
              <button 
                key={index} 
                onClick={() => goToMainPage(city)} // 클릭 시 해당 도시 이름 전송
                className="bg-white/90 border-none py-3 md:py-4 px-2 rounded-lg text-sm md:text-base font-medium cursor-pointer shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;