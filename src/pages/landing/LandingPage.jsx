import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import { useAuth } from '@hooks/useAuth';
import { LogIn, LogOut } from 'lucide-react';

import '@assets/css/landing.css';
import { toEnRegion } from '@utils/regionMap';
import { Helmet } from 'react-helmet-async';

const authButtonClass = 'group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-lg font-semibold text-white! bg-black border-0 transition-colors duration-200 ease-out hover:bg-[#f8f6f0] hover:text-black! active:scale-[0.97] cursor-pointer';
const authButtonTextClass = 'text-white! transition-colors duration-200 group-hover:text-black!';
const authButtonIconClass = 'w-4 h-4 text-white! transition-all duration-200 group-hover:text-black!';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('남부');
  const [searchKeyword, setSearchKeyword] = useState('');

  const citiesSouth = [
  '수원시',
  '성남시',
  '용인시',
  '안양시',
  '안산시',
  '과천시',
  '광명시',
  '광주시',
  '군포시',
  '부천시',
  '시흥시',
  '안성시',
  '오산시',
  '의왕시',
  '이천시',
  '평택시',
  '하남시',
  '화성시',
  '여주시',
  '김포시'
];

const citiesNorth = [
  '고양시',
  '구리시',
  '남양주시',
  '동두천시',
  '양주시',
  '의정부시',
  '파주시',
  '포천시',
  '연천군',
  '가평군'
];

  const regionCodeMap = {
  고양시: 28,
  구리시: 31,
  남양주시: 36,
  동두천시: 25,
  양주시: 63,
  연천군: 80,
  의정부시: 15,
  파주시: 48,
  포천시: 65,
  가평군: 82,
  수원시: 11,
  성남시: 13,
  용인시: 46,
  안양시: 17,
  안산시: 27,
  화성시: 59,
  평택시: 22,
  시흥시: 39,
  부천시: 19,
  광명시: 21,
  광주시: 61,
  이천시: 50,
  여주시: 67,
  하남시: 45,
  의왕시: 43,
  군포시: 41,
  오산시: 37,
  안성시: 55,
  김포시: 57,
  과천시: 29,
};

  const currentCities = activeTab === '남부' ? citiesSouth : citiesNorth;

  const goToMainPage = (regionName) => {
  const regionCode = regionCodeMap[regionName];

  navigate(
    `/${toEnRegion(regionName)}?regionCode=${regionCode}`
  );
};

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(searchKeyword);
  };

  return (
    <> 
      <Helmet>
        <title>거리에섯 - Index</title>
      </Helmet>
      
      <div className="page-wrapper min-h-screen bg-[#f8f6f0]">
        <header className="container-fluid flex flex-col pb-[5vw]">
          <div className="container">
            {/* AuthContext의 user 상태를 기준으로 조건부 렌더링 */}
            <div className="flex justify-end p-5 md:py-[30px]">
              {user ? (
                <button className={authButtonClass} onClick={logout}>
                  <span className={authButtonTextClass}>Logout</span>
                  <LogOut className={`${authButtonIconClass} group-hover:translate-x-0.5`} aria-hidden="true" />
                </button>
              ) : (
                <Link to="/login" className={authButtonClass}>
                  <span className={authButtonTextClass}>Login</span>
                  <LogIn className={`${authButtonIconClass} rotate-180 group-hover:-translate-x-0.5`} aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className="flex justify-center md:block md:text-center">
              <h1 className="landing-logo text-[60px] md:text-[80px] font-griun text-[#222]">
                거리에섯
              </h1>
            </div>

          </div>
        </header>
        
        <main className="container-fluid flex flex-col mt-10 pb-[5vw]">
          <div className='container fs-up-3'>
              <div className='w-full md:w-8/12 mx-auto'>
                <div className="flex flex-col md:flex-row items-center bg-white rounded-[20px] md:rounded-[50px] p-4 md:py-[10px] md:px-[20px] w-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-10 md:mb-[50px] gap-3 md:gap-0">
                  
                  <select 
                    id="category"
                    name="category"
                    className="w-full md:w-auto border-b md:border-b-0 md:border-r border-[#ddd] bg-transparent text-[#333] py-2 md:py-[10px] px-[20px] outline-none cursor-pointer text-center md:text-left">
                    <option>지역 선택</option>
                  </select>
                  
                  <input 
                    type="text" 
                    placeholder="떠나고 싶은 지역이나 테마를 입력하세요" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 border-none px-[20px] outline-none w-full text-center md:text-left bg-transparent"
                  />
                  
                  <button 
                    onClick={handleSearch} 
                    className="w-full md:w-auto bg-[#333] text-white border-none py-3 md:py-[15px] px-[35px] rounded-[30px] cursor-pointer transition-colors duration-200 hover:bg-[#0F9B73]"
                  >
                    검색
                  </button>
                </div>

              </div>
          </div>

          <div className='container my-10'>
            <div className="bg-white/40 backdrop-blur-[8px] border border-white/50 rounded-[20px] p-5 md:p-[40px] w-full">
              
              <div className="flex justify-center gap-[15px] mb-[30px] fs-up-3">
                <button
                  className={`py-[12px] px-[40px] font-bold rounded-lg cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '남부' 
                      ? 'bg-[#2B4A48] text-white' 
                      : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('남부')}
                >
                  경기 남부
                </button>
                <button
                  className={`py-[12px] px-[40px] font-bold rounded-lg cursor-pointer transition-all duration-200 border-none ${
                    activeTab === '북부' 
                      ? 'bg-[#2B4A48] text-white' 
                      : 'bg-white/70 text-[#555]'
                  }`}
                  onClick={() => setActiveTab('북부')}
                >
                  경기 북부
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-[15px] fs-up-3">
                {currentCities.map((city, index) => (
                  <button 
                    key={index} 
                    onClick={() => goToMainPage(city)}
                    className="bg-white/90 border-none py-[18px] px-[10px] rounded-lg font-medium cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 hover:bg-[#0F9B73] hover:text-white hover:-translate-y-[2px]"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
